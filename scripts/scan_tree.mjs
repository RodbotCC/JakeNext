#!/usr/bin/env node
import { scanTree, writeJson, parseArgs } from "./lib/oracle_fs.mjs";

const args = parseArgs();
const snapshot = await scanTree();

if (!args["dry-run"]) {
  await writeJson(".oraclestate/tree_snapshot.json", snapshot);
}

console.log(JSON.stringify({
  workspace: snapshot.workspace,
  generated_at: snapshot.generated_at,
  file_count: snapshot.files.length,
  wrote_snapshot: !args["dry-run"],
  ignored: [".DS_Store", ".git", "node_modules"]
}, null, 2));

