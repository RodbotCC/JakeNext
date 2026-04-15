#!/usr/bin/env node
/**
 * dispatcher.mjs — Sylvia Dispatcher v1
 *
 * Bridges packet arrival in handoff queues to the correct execution path.
 * This is the Phase 3 core: the nerve that detects a packet and fires the
 * right action instead of waiting for a scheduled script to poll.
 *
 * Usage:
 *   node scripts/dispatcher.mjs              # one-shot pass
 *   node scripts/dispatcher.mjs --watch      # poll every 30s (daemon mode)
 *   node scripts/dispatcher.mjs --watch --interval=60
 *   node scripts/dispatcher.mjs --reset      # clear seen-packet state and exit
 *
 * Routing law (mirrors TRIGGER_RULES.md and AGENTS.md):
 *   codex_safe_auto   → invoke consume_codex_safe_packets.mjs immediately
 *   queue_only        → log arrival, surface for Codex review (never auto-run)
 *   claude_semantic   → log arrival, surface for Claude Co-Work (never auto-run)
 *   manual_jake       → log as operator bottleneck, surface in jake/TCL.md
 *
 * Safety invariants:
 *   - Never silently rewrites semantic canon.
 *   - Never auto-executes claude_semantic or manual_jake packets.
 *   - Never deletes or moves packets for non-safe modes.
 *   - All dispatch actions leave a ledger trace and a JSON receipt.
 *   - Duplicate suppression via persistent state in .oraclestate/dispatcher_state.json.
 */

import { readdir } from "node:fs/promises";
import { execFile }  from "node:child_process";
import { promisify } from "node:util";
import {
  appendText, readText, readJson, writeJson, writeText,
  workspacePath, nowIso, GENERATED_STATE_DIR
} from "./lib/oracle_fs.mjs";

const execFileAsync = promisify(execFile);

// ─── Queue definitions ───────────────────────────────────────────────────────

const QUEUES = [
  { dir: "handoff/codex/inbox",        lane: "codex"          },
  { dir: "handoff/claude-cowork/inbox", lane: "claude-cowork"  },
  { dir: "jake/inbox",                  lane: "jake"           },
];

// Ledger files that live in queue directories — never treat as packets.
const LEDGER_FILENAMES = new Set(["FCL.md", "TCL.md", "RLL.md"]);

// ─── Markdown field parser ────────────────────────────────────────────────────

/**
 * Extract the value of a front-matter-style field from a markdown work order.
 * Handles both:
 *   FieldName: `value`
 *   FieldName: value
 */
function fieldValue(markdown, fieldName) {
  const re = new RegExp(`^${fieldName}:\\s*\`?([^\`\\n]+)\`?`, "m");
  const match = markdown.match(re);
  return match ? match[1].trim() : "";
}

// ─── TCL append helper ────────────────────────────────────────────────────────

async function appendTcl(relativePath, heading, body) {
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  await appendText(
    relativePath,
    `\n### ${dateStr} ~${timeStr} EDT — ${heading}\n\n**Action**: ${body}\n`,
  );
}

// ─── Dispatcher state ─────────────────────────────────────────────────────────

const STATE_PATH = `${GENERATED_STATE_DIR}/dispatcher_state.json`;

async function loadState() {
  return readJson(STATE_PATH, { seen: {}, lastRun: null });
}

async function saveState(state) {
  await writeJson(STATE_PATH, { ...state, lastRun: nowIso() });
}

// ─── Dispatch a single packet ─────────────────────────────────────────────────

async function dispatchPacket(queueDir, filename, lane) {
  const rel  = `${queueDir}/${filename}`;
  let text;
  try {
    text = await readText(rel);
  } catch {
    return { packet: rel, outcome: "unreadable" };
  }

  const executionMode = fieldValue(text, "Execution Mode");
  const moduleTarget  = fieldValue(text, "Module Target");
  const blockerType   = fieldValue(text, "Blocker Type");

  const record = {
    timestamp:     nowIso(),
    packet:        rel,
    lane,
    executionMode,
    moduleTarget,
    blockerType,
    action:        null,
    outcome:       null,
  };

  // ── codex lane: safe-auto ─────────────────────────────────────────────────
  if (lane === "codex" && executionMode === "codex_safe_auto") {
    record.action = "invoke_safe_worker";
    try {
      const result = await execFileAsync(
        process.execPath,
        ["scripts/consume_codex_safe_packets.mjs"],
        { cwd: workspacePath("") },
      );
      let workerOutput = {};
      try { workerOutput = JSON.parse(result.stdout.trim()); } catch { /**/ }
      record.outcome          = "executed";
      record.safeWorkerOutput = workerOutput;

      await appendTcl(
        "ledgers/TCL.md",
        "Dispatcher → safe worker executed",
        `Auto-dispatched \`codex_safe_auto\` packet \`${filename}\` (module \`${moduleTarget}\`). Safe worker consumed it. Worker result: consumed=${workerOutput.consumed ?? "?"}.`,
      );
      await appendTcl(
        "handoff/codex/TCL.md",
        "Dispatcher triggered safe execution",
        `Packet \`${filename}\` dispatched and consumed by safe worker.`,
      );
    } catch (err) {
      record.outcome = "error";
      record.error   = err.message;
      await appendTcl(
        "ledgers/TCL.md",
        "Dispatcher safe worker error",
        `Safe worker failed for \`${filename}\` (module \`${moduleTarget}\`): ${err.message}`,
      );
    }

  // ── codex lane: non-auto (queue_only, etc.) ───────────────────────────────
  } else if (lane === "codex") {
    record.action  = "surface_for_codex_review";
    record.outcome = "queued_awaiting_codex";
    await appendTcl(
      "handoff/codex/TCL.md",
      "Dispatcher surfaced codex packet",
      `New \`${executionMode}\` packet \`${filename}\` detected (module \`${moduleTarget}\`). Not auto-executed — requires Codex review.`,
    );
    await appendTcl(
      "ledgers/TCL.md",
      "Dispatcher surfaced codex queue packet",
      `Packet \`${filename}\` in Codex inbox is \`${executionMode}\` — surfaced for Codex, not auto-run.`,
    );

  // ── claude-cowork lane: semantic / queue-only ─────────────────────────────
  } else if (lane === "claude-cowork") {
    record.action  = "surface_for_semantic_review";
    record.outcome = "queued_awaiting_claude_cowork";
    await appendTcl(
      "handoff/claude-cowork/TCL.md",
      "Dispatcher surfaced semantic packet",
      `New \`${executionMode}\` packet \`${filename}\` detected (module \`${moduleTarget}\`). Semantic work queued only — not auto-executed by design.`,
    );
    await appendTcl(
      "ledgers/TCL.md",
      "Dispatcher queued semantic work",
      `Claude Co-Work packet \`${filename}\` (module \`${moduleTarget}\`) is live in inbox and awaiting semantic review.`,
    );

  // ── jake lane: operator bottleneck ────────────────────────────────────────
  } else if (lane === "jake") {
    record.action  = "surface_as_operator_bottleneck";
    record.outcome = "awaiting_jake";
    await appendTcl(
      "jake/TCL.md",
      "Dispatcher flagged Jake request",
      `Operator request \`${filename}\` detected. Module: \`${moduleTarget}\`. Blocker: \`${blockerType}\`. Awaiting Jake input — not reroutable.`,
    );
    await appendTcl(
      "ledgers/TCL.md",
      "Dispatcher flagged Jake bottleneck",
      `Jake-required packet \`${filename}\` (module \`${moduleTarget}\`, blocker \`${blockerType}\`) is an open operator bottleneck.`,
    );
  }

  return record;
}

// ─── Full dispatch pass ───────────────────────────────────────────────────────

async function runDispatchPass(state, verbose = true) {
  const dispatched = [];
  const skipped    = [];
  const passStart  = nowIso();

  for (const { dir, lane } of QUEUES) {
    let files;
    try {
      files = (await readdir(workspacePath(dir)))
        .filter(f => f.endsWith(".md") && !LEDGER_FILENAMES.has(f))
        .sort();
    } catch {
      // Queue directory may not exist yet or be empty — skip cleanly.
      continue;
    }

    for (const file of files) {
      const key = `${dir}/${file}`;

      if (state.seen[key]) {
        skipped.push(key);
        continue;
      }

      const record = await dispatchPacket(dir, file, lane);
      dispatched.push(record);

      // Mark seen immediately after dispatch so watch-mode doesn't re-fire.
      state.seen[key] = { seenAt: nowIso(), outcome: record.outcome };
    }
  }

  // Write receipt if anything was dispatched this pass.
  if (dispatched.length > 0) {
    const stamp       = new Date().toISOString().replace(/[^0-9T]/g, "").slice(0, 15);
    const receiptPath = `events/processed/dispatch_${stamp}Z.json`;
    await writeText(
      receiptPath,
      JSON.stringify(
        {
          generated_at:      passStart,
          dispatcher_version: "1.0",
          total_dispatched:  dispatched.length,
          total_skipped:     skipped.length,
          results:           dispatched,
        },
        null,
        2,
      ),
    );
    await appendTcl(
      "events/processed/TCL.md",
      "Dispatch receipt written",
      `Dispatcher processed ${dispatched.length} new packet(s). Receipt: \`${receiptPath}\`.`,
    );
  }

  const summary = {
    pass_at:    passStart,
    dispatched: dispatched.length,
    skipped:    skipped.length,
    results:    dispatched,
  };

  if (verbose) {
    console.log(JSON.stringify(summary, null, 2));
  } else if (dispatched.length > 0) {
    console.log(
      `[dispatcher] ${new Date().toISOString()} — dispatched ${dispatched.length} packet(s)`,
    );
  }

  return summary;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const argv         = process.argv.slice(2);
const watchMode    = argv.includes("--watch");
const resetMode    = argv.includes("--reset");
const intervalFlag = argv.find(a => a.startsWith("--interval="));
const intervalSec  = intervalFlag ? parseInt(intervalFlag.split("=")[1], 10) : 30;

if (resetMode) {
  await writeJson(STATE_PATH, { seen: {}, lastRun: null });
  console.log("[dispatcher] State reset. Run without --reset to start fresh.");
  process.exit(0);
}

const state = await loadState();

if (watchMode) {
  console.log(`[Sylvia dispatcher] Watch mode — polling every ${intervalSec}s`);
  await runDispatchPass(state, true);
  await saveState(state);

  setInterval(async () => {
    const result = await runDispatchPass(state, false);
    if (result.dispatched > 0) {
      await saveState(state);
    }
  }, intervalSec * 1000);
} else {
  // One-shot: scan queues once, write receipt, exit.
  await runDispatchPass(state, true);
  await saveState(state);
}
