#!/usr/bin/env node
import { readdir, stat } from "node:fs/promises";
import { parseArgs, readText, workspacePath, writeText } from "./lib/oracle_fs.mjs";

const args = parseArgs();

async function exists(relativePath) {
  try {
    await stat(workspacePath(relativePath));
    return true;
  } catch {
    return false;
  }
}

async function fileHas(relativePath, pattern) {
  try {
    const text = await readText(relativePath);
    return pattern.test(text);
  } catch {
    return false;
  }
}

async function dirHas(relativeDir, matcher) {
  try {
    const entries = await readdir(workspacePath(relativeDir));
    return entries.some((entry) => matcher.test(entry));
  } catch {
    return false;
  }
}

const today = new Date().toISOString().slice(0, 10);
const hasAndreSignal = await dirHas("collaboration/jake/inbox", /andre/i);
const hasRodrigoSignal = await dirHas("collaboration/jake/inbox", /rodrigo/i);
const hasAutomationsSignal = await dirHas("collaboration/handoff/claude-cowork/inbox", /automations/i);
const hasKpiSignal = await dirHas("collaboration/handoff/claude-cowork/inbox", /kpis?/i);
const hasPaymentsSignal = await dirHas("collaboration/jake/inbox", /payments/i);
const hasAndreAlignmentCluster = hasAndreSignal && (hasAutomationsSignal || hasKpiSignal);
const hasInterpretedCluster = await fileHas(
  "signals/briefings/sweep_2026-04-14_demo.md",
  /André\/Rodrigo\/Automations convergence|Rodrigo "watch this" event packet .* stale|Send André response \+ propose alignment sync/is
);
const hasRodrigoClosed = await fileHas(
  "canon/JAKE_DEFERRED_REGISTRY.md",
  /\[x\]\s+\*\*Rodrigo DM — ClickUp task "Jake please watch this"\*\*\s+`closed:\s*2026-04-14`/i
);
const hasExternalSignalCluster = hasAndreAlignmentCluster && (hasRodrigoSignal || hasPaymentsSignal || hasAutomationsSignal);

const modules = [
  {
    id: "01_world_model",
    title: "World Model",
    status: await exists("signals/events/FCLse.md") && await exists("capabilities/scripts/daily_substrate_sweep.mjs") ? "partial" : "scaffolded",
    current_gap: "Scene binding still lives across ledgers and events instead of a chooser-facing world-state object.",
    best_next_move: "Define a chooser-facing scene summary in hourly run receipts.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["signals/events/", "capabilities/scripts/daily_substrate_sweep.mjs", "capabilities/orchestrator/"],
    completion_signal: "Hourly chooser runs include a bounded scene summary section.",
    priority: 74
  },
  {
    id: "02_self_model",
    title: "Self Model",
    status: await exists("identity/SYLVIA.md") ? (await fileHas("collaboration/jake/inbox/req_20260414T070500Z_self-model-grounding.md", /Status:\s*`inbox`/i) ? "scaffolded" : "partial") : "missing",
    current_gap: "Sylvia has identity doctrine, but the self-model still lacks Jake-grounded relational truth.",
    best_next_move: "Get Jake's grounding response and integrate it into identity doctrine.",
    blocking_lane: "jake",
    execution_mode: "manual_jake",
    blocker_type: "jake_input",
    linked_artifacts: ["identity/", "collaboration/jake/inbox/req_20260414T070500Z_self-model-grounding.md"],
    completion_signal: "A grounded Jake response exists and identity/self-model doctrine is updated from it.",
    priority: 78
  },
  {
    id: "03_interoception_affect",
    title: "Interoception + Affect",
    status: "scaffolded",
    current_gap: "No explicit state vocabulary or felt-tone model exists yet.",
    best_next_move: "Define a first bounded affect vocabulary for chooser and sweep outputs.",
    blocking_lane: "claude-cowork",
    execution_mode: "claude_semantic",
    blocker_type: "semantic_gap",
    linked_artifacts: ["identity/modules/03_interoception_affect.md"],
    completion_signal: "A named affect/state vocabulary is written into doctrine and reflected in chooser or sweep outputs.",
    priority: 52
  },
  {
    id: "04_attention_selection",
    title: "Attention as Selection",
    status: await exists("chooser/NEXT_STEP.md") ? "partial" : "missing",
    current_gap: "`chooser/NEXT_STEP.md` is now a real active-focus object, but the system still over-rewards maintenance moves that close cleanly while a higher-impact blocker stays open.",
    best_next_move: "Keep chooser/NEXT_STEP authoritative and tied to queue truth, without letting repeat maintenance wins outrank the unresolved owner decision.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["ledgers/RLLl.md", "chooser/NEXT_STEP.md", "collaboration/handoff/codex/done/"],
    completion_signal: "The same winning move is legible in chooser state and in the corresponding queue packet state.",
    priority: 87
  },
  {
    id: "05_predictive_processing",
    title: "Predictive Processing",
    status: await exists("capabilities/scripts/detect_ledger_drift.mjs") ? "partial" : "scaffolded",
    current_gap: "Drift and mismatch exist, but the reflection output still is not feeding explicit chooser-law consequences when loops persist.",
    best_next_move: "Use daily reflection to turn repeated chooser results into explicit mismatch signal.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["capabilities/scripts/detect_ledger_drift.mjs", "capabilities/scripts/daily_sylvia_reflection.mjs"],
    completion_signal: "Daily reflection receipts explicitly name repeated mismatch or stale-winner patterns.",
    priority: 90
  },
  {
    id: "06_temporal_continuity",
    title: "Temporal Continuity",
    status: await exists("chooser/runs/TCLchr.md") ? "partial" : "scaffolded",
    current_gap: "Continuity is strong globally, but chooser-state continuity is brand new.",
    best_next_move: "Make chooser runs and NEXT_STEP part of the continuity spine.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["ledgers/TCLl.md", "chooser/runs/", "chooser/NEXT_STEP.md"],
    completion_signal: "Chooser run history and NEXT_STEP changes are visibly reflected in chooser and global continuity logs.",
    priority: 72
  },
  {
    id: "07_metacognition",
    title: "Metacognition",
    status: await exists("capabilities/templates/work_order.md") ? "partial" : "scaffolded",
    current_gap: "Confidence and blocker truth exist in doctrine, but not yet consistently across packets.",
    best_next_move: "Standardize confidence and blocker metadata in chooser-created packets.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["capabilities/templates/work_order.md", "capabilities/templates/jake_request.md"],
    completion_signal: "Chooser-created packets carry explicit blocker and completion metadata consistently.",
    priority: 64
  },
  {
    id: "08_social_cognition_inward",
    title: "Social Cognition Inward",
    status: await exists("collaboration/handoff/shared/decisions/auto_20260415T000138Z_alternating-winner-loop-review.md") ? "partial" : "scaffolded",
    current_gap: "Reflection has now surfaced the alternating `04` / `09` loop, but the system still lacks a ratified rule for when inward disagreement becomes an architecture-level mismatch.",
    best_next_move: "Resolve the alternating-winner shared decision into one explicit escalation rule for chooser reflection.",
    blocking_lane: "shared",
    execution_mode: "queue_only",
    blocker_type: "architecture_decision",
    linked_artifacts: ["collaboration/handoff/shared/decisions/", "chooser/runs/reflection_20260415T000138Z.md"],
    completion_signal: "A shared decision or routing update exists that explains how the chooser should treat alternating stale loops like the current `04` / `09` pattern.",
    priority: 104
  },
  {
    id: "09_action_selection_storytelling",
    title: "Action Selection + Storytelling",
    status: hasExternalSignalCluster ? "partial" : await exists("capabilities/scripts/consume_codex_safe_packets.mjs") ? "scaffolded" : "missing",
    current_gap: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "The André alignment cluster is already semantically legible, but the live work is still fragmented across DM, ClickUp, and Jake packets instead of one operator-owned push with a named owner decision."
        : "The first real external-signal cluster is now live across Jake and Claude lanes, but it is still fragmented across separate packets instead of one bounded active workstream."
      : "A chooser now exists, but the action bridge still needs to prove that a winning move can become safe autonomous work.",
    best_next_move: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "Use André DM + Automations-for-Close as one active alignment push: reply to André, set a 15-minute sync, and decide who owns Close automations/KPIs versus who just needs visibility."
        : "Create one bounded active workstream around the André / Rodrigo / Automations-for-Close cluster, decide whether the real bottleneck is Jake judgment, Codex substrate work, or Claude interpretation, and leave one active packet instead of fragmented events."
      : "Run the first safe substrate cycle from a chooser-created codex_safe_auto packet.",
    blocking_lane: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "jake"
        : "claude-cowork"
      : "codex",
    execution_mode: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "manual_jake"
        : "claude_semantic"
      : "codex_safe_auto",
    blocker_type: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "jake_input"
        : "semantic_gap"
      : "none",
    linked_artifacts: ["chooser/", "capabilities/scripts/consume_codex_safe_packets.mjs"],
    completion_signal: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? "Jake sends the André reply or equivalent alignment outreach, and one live packet becomes the named owner surface for the Close automations / KPI cluster."
        : "A single bounded packet or decision artifact exists that unifies André, Rodrigo, and Automations-for-Close into one active workstream with a named bottleneck."
      : "A chooser-created codex_safe_auto packet moves through Codex queue states and leaves a receipt.",
    priority: hasExternalSignalCluster
      ? hasInterpretedCluster
        ? hasRodrigoClosed ? 136 : 132
        : 130
      : 92
  },
  {
    id: "10_global_availability",
    title: "Global Availability",
    status: await exists("capabilities/orchestrator/app.js") ? "partial" : "scaffolded",
    current_gap: "Ledgers, queues, and UI exist, but chooser state is not yet fully broadcast across all visible surfaces.",
    best_next_move: "Surface the current winner, module progress, and blocker state in the orchestrator.",
    blocking_lane: "codex",
    execution_mode: "codex_safe_auto",
    blocker_type: "none",
    linked_artifacts: ["capabilities/orchestrator/", "chooser/"],
    completion_signal: "The orchestrator explicitly exposes module progress, the current winner, and blocker state.",
    priority: 70
  }
];

modules.sort((a, b) => b.priority - a.priority);

const table = modules.map((module) => `| \`${module.id}\` | \`${module.status}\` | ${module.current_gap} | ${module.best_next_move} | \`${module.blocking_lane}\` | \`${today}\` | ${module.linked_artifacts.map((item) => `\`${item}\``).join(", ")} |`).join("\n");
const priorityList = modules.map((module, index) => `${index + 1}. \`${module.id}\` — ${module.best_next_move}`).join("\n");

const content = `# Module Progress
### Sylvia Bootstrap Loop v1

> This file tracks how close the system is to each Sylvia module becoming real.
> Last updated: ${today}

---

## Status Table

| Module | Status | Current Gap | Best Next Move | Blocking Lane | Last Meaningful Update | Linked Artifacts |
|---|---|---|---|---|---|---|
${table}

---

## Current Working Priority

${priorityList}
`;

if (!args["dry-run"]) {
  await writeText("chooser/MODULE_PROGRESS.md", content);
}

if (args.json || args["json"]) {
  console.log(JSON.stringify({
    generated_at: new Date().toISOString(),
    modules
  }, null, 2));
} else if (args["dry-run"]) {
  console.log(content);
} else {
  console.log(JSON.stringify({
    wrote: "chooser/MODULE_PROGRESS.md",
    module_count: modules.length,
    highest_priority: modules[0]?.id || null
  }, null, 2));
}
