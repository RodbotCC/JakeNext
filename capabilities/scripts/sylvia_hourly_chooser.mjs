#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { appendText, readText, writeText, writeJson, readJson, workspacePath, parseArgs, GENERATED_STATE_DIR } from "./lib/oracle_fs.mjs";

const execFileAsync = promisify(execFile);
const args = parseArgs();
const now = new Date();
const iso = now.toISOString();
const stamp = iso.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const runId = `run_${stamp}`;

const statusWeight = {
  missing: 120,
  scaffolded: 92,
  partial: 68,
  operational: 24
};

async function exists(relativePath) {
  try {
    await stat(workspacePath(relativePath));
    return true;
  } catch {
    return false;
  }
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function packetPathFor(module) {
  const tail = `auto_${module.id}_${slug(module.best_next_move).slice(0, 48)}.md`;
  if (module.blocking_lane === "jake") return `collaboration/jake/inbox/${tail}`;
  if (module.blocking_lane === "claude-cowork") return `collaboration/handoff/claude-cowork/inbox/${tail}`;
  return `collaboration/handoff/codex/inbox/${tail}`;
}

function duplicateLocationsFor(packetPath) {
  if (packetPath.startsWith("collaboration/handoff/codex/inbox/")) {
    const base = path.basename(packetPath);
    return [packetPath, `collaboration/handoff/codex/active/${base}`];
  }
  if (packetPath.startsWith("collaboration/handoff/claude-cowork/inbox/")) {
    const base = path.basename(packetPath);
    return [packetPath, `collaboration/handoff/claude-cowork/active/${base}`];
  }
  if (packetPath.startsWith("collaboration/jake/inbox/")) {
    const base = path.basename(packetPath);
    return [packetPath, `collaboration/jake/active/${base}`];
  }
  return [packetPath];
}

async function openPacketExists(packetPath) {
  for (const candidate of duplicateLocationsFor(packetPath)) {
    if (await exists(candidate)) return true;
  }
  return false;
}

function scoreCandidate(module) {
  const base = statusWeight[module.status] || 0;
  const laneBonus = module.execution_mode === "codex_safe_auto"
    ? 8
    : module.execution_mode === "claude_semantic"
      ? 3
      : 0;
  const blockerPenalty = module.blocker_type === "jake_input"
    ? 8
    : module.blocker_type === "semantic_gap"
      ? 6
      : 0;
  return base + module.priority + laneBonus - blockerPenalty;
}

function workOrderFor(module, chooserSource, packetPath, reused) {
  return `# Work Order

Owner: \`${module.blocking_lane}\`
Status: \`inbox\`
Created: \`${iso}\`

## Source Artifact

\`chooser/MODULE_PROGRESS.md\`

## Reason

Sylvia chooser selected this move as the current best step for closing module gap \`${module.id}\`.

## Module Target

\`${module.id}\`

## Execution Mode

\`${module.execution_mode}\`

## Chooser Source

\`${chooserSource}\`

## Blocker Type

\`${module.blocker_type}\`

## Desired Output

${module.best_next_move}

## Constraints

- Respect the current role boundary.
- Do not rewrite semantic canon unless this packet is Claude-semantic work.
- Leave ledger receipts when queue state or architectural truth changes.
- Skip duplicate reopening if this packet is already the live winner.

## Completion Signal

${module.completion_signal}

## Safe Action

\`${module.id === "09_action_selection_storytelling" ? "safe_substrate_cycle" : module.id === "04_attention_selection" ? "refresh_chooser_state" : module.id === "05_predictive_processing" ? "daily_reflection" : module.id === "06_temporal_continuity" ? "refresh_module_progress" : module.id === "10_global_availability" ? "refresh_chooser_state" : "none"}\`

## Notes

- Packet path: \`${packetPath}\`
- Duplicate reuse: \`${reused ? "yes" : "no"}\`
`;
}

function jakeRequestFor(module, chooserSource, packetPath, reused) {
  return `# Jake Request

Requester: \`codex\`
Status: \`inbox\`
Created: \`${iso}\`

## Blocker

Sylvia chooser selected module \`${module.id}\`, but the real next move depends on Jake-specific truth.

## Module Target

\`${module.id}\`

## Execution Mode

\`${module.execution_mode}\`

## Chooser Source

\`${chooserSource}\`

## Blocker Type

\`${module.blocker_type}\`

## Why Jake Is Needed

${module.current_gap}

## Exact Ask

${module.best_next_move}

## Acceptable Answer Format

- short bullets,
- dictated notes,
- or a rough paragraph.

## Completion Signal

${module.completion_signal}

## Notes

- Packet path: \`${packetPath}\`
- Duplicate reuse: \`${reused ? "yes" : "no"}\`
`;
}

async function appendTcl(relativePath, heading, action) {
  await appendText(relativePath, `\n### ${new Date().toISOString().slice(0, 10)} ~${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} EDT — ${heading}\n\n**Action**: ${action}\n`);
}

const moduleRaw = await execFileAsync(process.execPath, ["capabilities/scripts/update_module_progress.mjs", "--json"], { cwd: workspacePath("") });
const moduleState = JSON.parse(moduleRaw.stdout);
const modules = moduleState.modules || [];

const candidates = [];
for (const module of modules) {
  const packetPath = packetPathFor(module);
  const open = await openPacketExists(packetPath);
  const duplicatePenalty = open ? 12 : 0;
  const score = scoreCandidate(module) - duplicatePenalty;
  candidates.push({
    ...module,
    score,
    packet_path: packetPath,
    duplicate_open: open
  });
}

candidates.sort((a, b) => (b.score - a.score) || (b.priority - a.priority));
const winner = candidates[0];
const chooserSource = `chooser/runs/${runId}.md`;
let packetOpened = false;
let packetReused = false;

if (winner && !winner.duplicate_open && !args["no-open"]) {
  const content = winner.blocking_lane === "jake"
    ? jakeRequestFor(winner, chooserSource, winner.packet_path, false)
    : workOrderFor(winner, chooserSource, winner.packet_path, false);
  await writeText(winner.packet_path, content);
  packetOpened = true;
} else if (winner) {
  packetReused = true;
}

const previousNext = await readText("chooser/NEXT_STEP.md").catch(() => "");
const previousChanged = !previousNext.includes(`\`${winner?.id || ""}\``) || !previousNext.includes(winner?.best_next_move || "");

const nextStep = `# Next Step
### Sylvia Bootstrap Loop v1

> This file is the current active winner chosen by the Sylvia loop.
> Last updated: ${iso.slice(0, 10)}

---

## Current Winner

- Module Target: \`${winner.id}\`
- Chosen Task: ${winner.best_next_move}
- Blocking Lane: \`${winner.blocking_lane}\`
- Execution Mode: \`${winner.execution_mode}\`
- Blocker Type: \`${winner.blocker_type}\`
- Why It Won: It scored highest under \`next_best_move\` after weighting module gap closure first and duplicate/open-block penalties second.

---

## Packet State

- Packet Path: \`${winner.packet_path}\`
- Packet Opened This Run: \`${packetOpened ? "yes" : "no"}\`
- Packet Reused: \`${packetReused ? "yes" : "no"}\`

---

## Success Signal

${winner.completion_signal}
`;

await writeText("chooser/NEXT_STEP.md", nextStep);

const rll = `# RLL — Chooser
### Jake Personal Oracle Project

> Local ratio lattice ledger for \`chooser/\`.
> Last updated: ${iso.slice(0, 10)}

---

## Active local comparators

- \`module_gap_closure\`
- \`next_best_move\`
- \`sylvia_emergence\`

---

## Ranked chooser artifacts

| Rank | Object | module_gap_closure | next_best_move | sylvia_emergence | Confidence | Why it lands here |
|---|---|---:|---:|---:|---|---|
| 1 | \`MODULE_PROGRESS.md\` | 88.00 | 86.00 | 78.00 | high | The chooser cannot pick honestly without a durable picture of where the module gaps are. |
| 2 | \`NEXT_STEP.md\` | 84.00 | 90.00 | 80.00 | high | This is the active focus object that turns ranking into one chosen move. |
| 3 | \`CHOOSER_POLICY.md\` | 82.00 | 82.00 | 76.00 | medium-high | The policy keeps the chooser from degrading into arbitrary task selection. |
| 4 | \`runs/\` | 74.00 | 78.00 | 70.00 | medium | Run receipts matter for continuity and reflection, but they are downstream of selection law. |

---

## Current module gap priority

${candidates.slice(0, 5).map((candidate, index) => `${index + 1}. \`${candidate.id}\` — ${candidate.best_next_move}`).join("\n")}

---

## Current winner

\`${winner.id}\` wins locally because it is the strongest combination of module gap closure, actionability, and low current-blocker drag.
`;
await writeText("chooser/RLLch.md", `${rll}\n`);

const runBody = `# Chooser Run

Run ID: \`${runId}\`
Created: \`${iso}\`

## Boot Sources Read

- \`ledgers/MACRO_LEDGER.md\`
- recent \`ledgers/TCLl.md\`
- \`ledgers/RLLl.md\`
- \`identity/\`
- \`chooser/MODULE_PROGRESS.md\`
- \`collaboration/handoff/\`
- \`collaboration/jake/\`

## Current Module Gap Table

${modules.map((module) => `- \`${module.id}\` — \`${module.status}\` — ${module.current_gap}`).join("\n")}

## Candidate Moves Considered

${candidates.map((candidate, index) => `${index + 1}. \`${candidate.id}\` — score \`${candidate.score}\` — ${candidate.best_next_move}${candidate.duplicate_open ? " — duplicate suppressed penalty applied" : ""}`).join("\n")}

## Chosen Move

- Module Target: \`${winner.id}\`
- Task: ${winner.best_next_move}
- Lane: \`${winner.blocking_lane}\`
- Execution Mode: \`${winner.execution_mode}\`
- Packet Path: \`${winner.packet_path}\`

## Chosen Comparator Basis

\`next_best_move\` with module-progress-first weighting, then duplicate suppression, then blocker penalties.

## Required Packets Opened

${packetOpened ? `- \`${winner.packet_path}\`` : "- No new packet opened; existing open packet reused."}

## Blocked / Abstained Candidates

${candidates.slice(1, 4).map((candidate) => `- \`${candidate.id}\` — ${candidate.blocker_type === "none" ? "not blocked" : `blocked by ${candidate.blocker_type}`}`).join("\n")}

## Expected Completion Signal

${winner.completion_signal}
`;

await writeText(`chooser/runs/${runId}.md`, `${runBody}\n`);
await appendTcl("chooser/TCLch.md", "Hourly chooser run recorded", `Recorded ${runId}, selected ${winner.id}, and ${packetOpened ? "opened" : "reused"} the corresponding packet.`);
await appendTcl("chooser/runs/TCLchr.md", "Chooser run receipt added", `Added chooser receipt \`${runId}.md\` for winner \`${winner.id}\`.`);

if (previousChanged || packetOpened) {
  await appendTcl("ledgers/TCLl.md", "Sylvia hourly chooser advanced", `Hourly chooser selected ${winner.id} with execution mode ${winner.execution_mode} and ${packetOpened ? "opened a new packet" : "reused the current packet"}.`);
}

// ─── Module 01: World Model — persist unified scene snapshot ──────────────
// ─── Module 03: Affect — compute stress/mood from chooser data ───────────

const previousWorld = await readJson(`${GENERATED_STATE_DIR}/world.json`, {});

// ─── Module 06: Temporal Continuity — current narrative thread ────────────
const globalTcl = await readText("ledgers/TCLl.md").catch(() => "");
// Extract last 3 TCL entry headings (### lines) as the narrative thread
// Filter to actual dated entries (### 2026-...), skip format examples, take most recent 3
const tclHeadings = (globalTcl.match(/^### 202\d.+$/gm) || []).reverse();
const recentThread = tclHeadings.slice(0, 3).map(h => h.replace(/^### /, ""));

// Compute affect from observable signals (Module 03)
const duplicateCount = candidates.filter(c => c.duplicate_open).length;
const jakeBlockedCount = candidates.filter(c => c.blocker_type === "jake_input").length;
const topScore = candidates[0]?.score || 0;
const scoreSpread = topScore - (candidates[candidates.length - 1]?.score || 0);
const scaffoldedCount = modules.filter(m => m.status === "scaffolded").length;
const missingCount = modules.filter(m => m.status === "missing").length;

let mood = "clear";
if (missingCount > 2) mood = "strained";
else if (jakeBlockedCount >= 3 && duplicateCount >= 4) mood = "stuck";
else if (duplicateCount >= 5) mood = "looping";
else if (scoreSpread < 15) mood = "ambiguous";
else if (scaffoldedCount >= 4) mood = "early";
else if (jakeBlockedCount === 0 && duplicateCount <= 1) mood = "flowing";

const worldSnapshot = {
  cycle_id: runId,
  timestamp: iso,
  // Module 01: World Model
  world: {
    winner: { id: winner.id, score: winner.score, lane: winner.blocking_lane, mode: winner.execution_mode },
    module_summary: modules.map(m => ({ id: m.id, status: m.status })),
    candidates_top3: candidates.slice(0, 3).map(c => ({ id: c.id, score: c.score, duplicate: c.duplicate_open })),
    queue_pressure: { duplicates: duplicateCount, jake_blocked: jakeBlockedCount, scaffolded: scaffoldedCount },
    previous_winner: previousWorld.world?.winner?.id || null,
    winner_changed: (previousWorld.world?.winner?.id || null) !== winner.id,
  },
  // Module 03: Affect
  affect: {
    mood,
    stress_signals: { duplicateCount, jakeBlockedCount, scaffoldedCount, missingCount, scoreSpread },
  },
  // Module 02: Self Model — who am I in this situation?
  self: {
    identity: "Sylvia",
    role: "integrated decision intelligence for Jake's life and work",
    current_mode: winner.blocking_lane === "jake" ? "waiting on operator" : winner.execution_mode === "codex_safe_auto" ? "autonomous execution" : "collaborative",
    active_invariants: ["dynamic completeness over timeless completion", "no counterfeit progress", "escalate when Jake is genuinely needed"],
  },
  // Module 04: Attention — what's foregrounded right now?
  attention: {
    focus: winner.id,
    focus_score: winner.score,
    focus_task: winner.best_next_move,
    runner_up: candidates[1]?.id || null,
    runner_up_gap: winner.score - (candidates[1]?.score || 0),
    comparator: "next_best_move",
  },
  // Module 09: Action Selection + Narration — what's the move and why?
  action: {
    chosen: winner.id,
    lane: winner.blocking_lane,
    mode: winner.execution_mode,
    packet: winner.packet_path,
    opened: packetOpened,
    reused: packetReused,
    narration: `${winner.id} wins because ${
      winner.blocker_type === "jake_input"
        ? "it is blocked on Jake's input and no other move can honestly outrank an unresolved operator bottleneck"
        : winner.duplicate_open
          ? "despite duplicate suppression, it still scores highest under module gap closure"
          : `it has the highest combined score (${winner.score}) under next_best_move weighting`
    }. ${candidates[1] ? `Runner-up ${candidates[1].id} scored ${candidates[1].score} (gap: ${winner.score - candidates[1].score}).` : ""}`,
  },
  // Module 05: Predictive Processing — expect, then check
  prediction: {
    // What we expected last cycle (read from previous world.json)
    last_expectation: previousWorld.prediction?.next_expectation || null,
    // Did it come true?
    expectation_met: previousWorld.prediction?.next_expectation
      ? previousWorld.prediction.next_expectation === winner.id
      : null,
    // What we expect NEXT cycle
    next_expectation: winner.id,
    // Mismatch tracking
    consecutive_correct: previousWorld.prediction?.next_expectation === winner.id
      ? (previousWorld.prediction?.consecutive_correct || 0) + 1
      : 0,
    consecutive_wrong: previousWorld.prediction?.next_expectation && previousWorld.prediction.next_expectation !== winner.id
      ? (previousWorld.prediction?.consecutive_wrong || 0) + 1
      : 0,
    surprise: previousWorld.prediction?.next_expectation && previousWorld.prediction.next_expectation !== winner.id,
  },
  // Module 07: Metacognition — how confident are we?
  metacognition: {
    selection_confidence: scoreSpread > 30 ? "high" : scoreSpread > 15 ? "medium" : "low",
    confidence_reason: scoreSpread > 30
      ? "Clear winner — large score gap from runner-up"
      : scoreSpread > 15
        ? "Moderate confidence — reasonable gap but alternatives are viable"
        : "Low confidence — candidates are clustered, selection may be arbitrary",
    winner_is_blocked: winner.blocker_type !== "none",
    stale_winner: (previousWorld.continuity?.cycles_since_winner_change || 0) > 5,
  },
  // Module 06: Temporal Continuity
  continuity: {
    recent_thread: recentThread,
    cycles_since_winner_change: (previousWorld.continuity?.cycles_since_winner_change || 0) + (previousWorld.world?.winner?.id === winner.id ? 1 : 0),
    total_cycles: (previousWorld.continuity?.total_cycles || 0) + 1,
  },
  // Module 08: Social Cognition Inward — should I reconsider?
  reconsider: {
    should_reconsider: mood === "ambiguous" || (scoreSpread < 15 && jakeBlockedCount >= 2),
    reason: mood === "ambiguous"
      ? "Candidates are too close — the selection may be arbitrary"
      : scoreSpread < 15 && jakeBlockedCount >= 2
        ? "Multiple jake-blocked candidates with tight scoring — internal debate warranted"
        : "No reconsideration needed — selection is clear",
    inner_tension: candidates.length >= 2 && candidates[0].blocking_lane !== candidates[1].blocking_lane
      ? `Top two candidates disagree on lane: ${candidates[0].blocking_lane} vs ${candidates[1].blocking_lane}`
      : null,
  },
  // Module 10: Global Availability — this file IS the broadcast
  broadcast: {
    target: `${GENERATED_STATE_DIR}/world.json`,
    consumers: ["chooser", "dispatcher", "sweep", "any-agent-reading-world.json"],
    note: "world.json is the broadcast. Writing it makes all module outputs globally available.",
  },
  // Delta: what changed since last cycle
  delta: {
    winner_changed: (previousWorld.world?.winner?.id || null) !== winner.id,
    mood_changed: (previousWorld.affect?.mood || null) !== mood,
    new_modules_since_last: modules.filter(m => {
      const prev = (previousWorld.world?.module_summary || []).find(p => p.id === m.id);
      return prev && prev.status !== m.status;
    }).map(m => m.id),
  },
};

await writeJson(`${GENERATED_STATE_DIR}/world.json`, worldSnapshot);

console.log(JSON.stringify({
  run_id: runId,
  winner: winner.id,
  packet_path: winner.packet_path,
  packet_opened: packetOpened,
  packet_reused: packetReused,
  mood,
  winner_changed: worldSnapshot.delta.winner_changed,
}, null, 2));
