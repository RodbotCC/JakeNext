#!/usr/bin/env node
import { buildEventPacket, readJson, scanTree, writeEvent, writeJson, parseArgs } from "./lib/oracle_fs.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const args = parseArgs();

const previous = await readJson(".oraclestate/tree_snapshot.json", { files: [] });
const current = await scanTree();

const previousByPath = new Map((previous.files || []).map((file) => [file.path, file]));
const currentByPath = new Map(current.files.map((file) => [file.path, file]));

function isGeneratedState(file) {
  return file.path === ".oraclestate/tree_snapshot.json" || file.path === ".oraclestate/event_log.jsonl";
}

const created = current.files.filter((file) => !isGeneratedState(file) && !previousByPath.has(file.path));
const edited = current.files.filter((file) => {
  if (isGeneratedState(file)) return false;
  const old = previousByPath.get(file.path);
  return old && old.sha256 !== file.sha256;
});
const removed = (previous.files || []).filter((file) => !isGeneratedState(file) && !currentByPath.has(file.path));

const driftRaw = await execFileAsync(process.execPath, ["capabilities/scripts/detect_ledger_drift.mjs"], { cwd: current.workspace });
const drift = JSON.parse(driftRaw.stdout);

const packet = buildEventPacket({
  event_type: "daily_substrate_sweep",
  source_path: ".",
  classification: "state",
  recommended_route: drift.finding_count > 0 ? "codex" : "shared/decisions",
  needs_ai_review: drift.finding_count > 0,
  ledger_updates: drift.finding_count > 0
    ? ["ledgers/FDL.md", "ledgers/FCLl.md", "ledgers/MACRO_LEDGER.md", "ledgers/TCLl.md"]
    : ["ledgers/TCLl.md"],
  notes: [
    `Files scanned: ${current.files.length}.`,
    `Created since previous snapshot: ${created.length}.`,
    `Edited since previous snapshot: ${edited.length}.`,
    `Removed since previous snapshot: ${removed.length}.`,
    `Ledger drift findings: ${drift.finding_count}.`
  ].join(" ")
});

packet.sweep = {
  created: created.map((file) => file.path),
  edited: edited.map((file) => file.path),
  removed: removed.map((file) => file.path),
  drift_findings: drift.findings
};

if (args["dry-run"]) {
  console.log(JSON.stringify(packet, null, 2));
} else {
  const file = await writeEvent(packet, "signals/events/inbox");
  await writeJson(".oraclestate/tree_snapshot.json", current);
  console.log(JSON.stringify({
    wrote_event: file,
    updated_snapshot: ".oraclestate/tree_snapshot.json",
    file_count: current.files.length,
    drift_findings: drift.finding_count
  }, null, 2));
}
