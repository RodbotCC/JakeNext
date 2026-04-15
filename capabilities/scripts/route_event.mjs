#!/usr/bin/env node
import path from "node:path";
import { rename } from "node:fs/promises";
import { readJson, writeText, parseArgs, workspacePath, appendEventLog, ensureDir } from "./lib/oracle_fs.mjs";

const args = parseArgs();
const packetPath = args.path || args._[0];

if (!packetPath) {
  console.error("Usage: node scripts/route_event.mjs events/inbox/evt.json [--dry-run]");
  process.exit(1);
}

const packet = await readJson(packetPath, null);
if (!packet) {
  console.error(`Could not read event packet: ${packetPath}`);
  process.exit(1);
}

function destinationFor(route) {
  if (route === "jake") return "jake/inbox";
  if (route === "claude-cowork") return "handoff/claude-cowork/inbox";
  if (route === "codex") return "handoff/codex/inbox";
  if (route === "shared/questions") return "handoff/shared/questions";
  if (route === "shared/decisions") return "handoff/shared/decisions";
  return "handoff/shared/conflicts";
}

function packetMetadata(packet) {
  const executionMode = packet.execution_mode
    || (packet.recommended_route === "jake" ? "manual_jake"
      : packet.recommended_route === "claude-cowork" ? "claude_semantic"
      : "queue_only");
  const blockerType = packet.blocker_type
    || (packet.recommended_route === "jake" ? "operator_truth"
      : packet.recommended_route === "claude-cowork" ? "semantic_review"
      : "none");
  const moduleTarget = packet.module_target || "external_signal_activation";
  const chooserSource = packet.chooser_source || "ingress/manual";
  const completionSignal = packet.completion_signal
    || packet.action_hint
    || "The receiving lane produces a bounded decision, response, or follow-up packet.";

  return {
    executionMode,
    blockerType,
    moduleTarget,
    chooserSource,
    completionSignal
  };
}

function workOrder(packet, finalPacketPath) {
  const meta = packetMetadata(packet);
  return `# Work Order

Owner: \`${packet.recommended_route}\`
Status: \`inbox\`
Created: \`${packet.timestamp}\`
Module Target: \`${meta.moduleTarget}\`
Execution Mode: \`${meta.executionMode}\`
Chooser Source: \`${meta.chooserSource}\`
Blocker Type: \`${meta.blockerType}\`
Completion Signal: \`${meta.completionSignal}\`

## Source Artifact

\`${packet.source_path}\`

## Reason

Event \`${packet.event_type}\` was detected for \`${packet.source_path}\`.

## Desired Output

Review the event packet and perform the appropriate ${packet.recommended_route === "codex" ? "mechanical, filesystem, tooling, or ledger" : "semantic, canon, synthesis, or oracle judgment"} work.

## Constraints

- Do not silently rewrite semantic canon.
- Update ledgers if structure, inventory, or continuity changes.
- Preserve raw source material unless Jake explicitly asks for cleanup.

## Ledger Updates Required

${(packet.ledger_updates || []).map((item) => `- \`${item}\``).join("\n") || "- None declared"}

## Event Packet

\`${finalPacketPath}\`

## Notes

${packet.notes || "No notes provided."}
`;
}

function jakeRequest(packet, finalPacketPath) {
  const meta = packetMetadata(packet);
  return `# Jake Request

Requester: \`codex\`
Status: \`inbox\`
Created: \`${packet.timestamp}\`
Module Target: \`${meta.moduleTarget}\`
Execution Mode: \`${meta.executionMode}\`
Chooser Source: \`${meta.chooserSource}\`
Blocker Type: \`${meta.blockerType}\`
Completion Signal: \`${meta.completionSignal}\`

## Blocker

Event \`${packet.event_type}\` was detected for \`${packet.source_path}\` and the next honest move depends on Jake-owned judgment or action.

## Why Jake Is Needed

${packet.notes || "This external signal requires Jake-specific truth, relationship handling, or manual review."}

## Exact Ask

${packet.action_hint || "Review the linked source and decide the real next move."}

## Acceptable Answer Format

- short bullets,
- dictated notes,
- or a rough paragraph.

## Downstream Files / Ledgers To Update

${(packet.ledger_updates || []).map((item) => `- \`${item}\``).join("\n") || "- `ledgers/TCL.md`"}

## Event Packet

\`${finalPacketPath}\`

## Notes

${packet.notes || "No notes provided."}
`;
}

const destDir = destinationFor(packet.recommended_route);
const base = path.basename(packetPath, ".json");
const orderPath = `${destDir}/${base}.md`;
const processedPath = `events/processed/${path.basename(packetPath)}`;

if (args["dry-run"]) {
  console.log(JSON.stringify({
    packet: packetPath,
    route: packet.recommended_route,
    destination: orderPath,
    processed_path: processedPath
  }, null, 2));
} else {
  const content = packet.recommended_route === "jake"
    ? jakeRequest(packet, processedPath)
    : workOrder(packet, processedPath);
  await writeText(orderPath, content);
  await ensureDir("events/processed");
  await rename(workspacePath(packetPath), workspacePath(processedPath));
  packet.status = "routed";
  await appendEventLog(packet, orderPath);
  console.log(JSON.stringify({
    routed: packetPath,
    work_order: orderPath,
    processed_packet: workspacePath(processedPath)
  }, null, 2));
}
