#!/usr/bin/env node
import { readText, scanTree, parseArgs } from "./lib/oracle_fs.mjs";

const args = parseArgs();
const scan = await scanTree();
const files = new Set(scan.files.map((file) => file.path));

const ledgers = ["ledgers/MACRO_LEDGER.md", "ledgers/FDL.md", "ledgers/FCLl.md", "ledgers/TCLl.md", "skills/oracle-ledger-update/SKILL.md", "analysis/firsttry.txt", "AGENTS.md", "CLAUDE.md"];

function exists(path) {
  return files.has(path);
}

function add(findings, severity, file, message, evidence, recommended_owner = "codex") {
  findings.push({ severity, file, message, evidence, recommended_owner });
}

const findings = [];

for (const ledger of ledgers) {
  if (!exists(ledger)) continue;
  const text = await readText(ledger);

  if (text.includes("/Users/jakeaaron/Documents/Storie/")) {
    add(findings, "warning", ledger, "Stale imported Claude Code shelf path reference remains.", "/Users/jakeaaron/Documents/Storie/", "codex");
  }

  if (text.includes("/Users/jakeaaron/Documents/Claude/JakeNext/")) {
    add(findings, "warning", ledger, "Stale workspace path reference remains.", "/Users/jakeaaron/Documents/Claude/JakeNext/", "codex");
  }

  if (ledger === "ledgers/FDL.md") {
    if (/^\| `JakeRL\.txt`/m.test(text)) {
      add(findings, "warning", ledger, "FDL still lists JakeRL.txt as a root file.", "`JakeRL.txt` root row", "codex");
    }
    if (/^\| `firsttry\.txt`/m.test(text)) {
      add(findings, "warning", ledger, "FDL still lists firsttry.txt as a root file.", "`firsttry.txt` root row", "codex");
    }
  }

  if (ledger === "analysis/firsttry.txt") {
    for (const missing of ["JAKE_RL_RATIO_LATTICE_INDEX.txt", "jake_rl_lattice_index_heatmap.png", "RATIO_LATTICE_FULL_BUNDLE.txt"]) {
      if (text.includes(missing) && !exists(missing) && !exists(`analysis/${missing}`) && !exists(`source/${missing}`)) {
        add(findings, "info", ledger, "Analysis references an artifact that is not present in this workspace.", missing, "claude-cowork");
      }
    }
  }
}

for (const file of scan.files) {
  if (file.path.includes("/")) continue;
  const allowedRoot = new Set(["AGENTS.md", "CLAUDE.md"]);
  if (!allowedRoot.has(file.path)) {
    add(findings, "info", file.path, "Root contains a file not listed in the allowed root governance/foundation set.", file.path, "codex");
  }
}

const directories = new Set();
for (const file of scan.files) {
  const parts = file.path.split("/");
  for (let i = 1; i < parts.length; i += 1) {
    const dir = parts.slice(0, i).join("/");
    directories.add(dir);
  }
}

for (const dir of directories) {
  if (dir.startsWith("events/inbox") || dir.startsWith("events/processed") || dir.startsWith("events/failed")) continue;
  if (dir.includes("/inbox") || dir.includes("/active") || dir.includes("/done")) continue;
  if (dir.includes("/decisions") || dir.includes("/questions") || dir.includes("/conflicts")) continue;
  // Ledger files are now barcoded (e.g. FCLca.md, TCLclhcoi.md)
  // Check if any FCL* or TCL* file exists in the directory
  const hasFcl = scan.files.some(f => f.path.startsWith(`${dir}/FCL`) && f.path.endsWith(".md"));
  const hasTcl = scan.files.some(f => f.path.startsWith(`${dir}/TCL`) && f.path.endsWith(".md"));
  if (!hasFcl) {
    add(findings, "warning", dir, "Directory is missing an FCL{barcode}.md file.", `${dir}/FCL?.md`, "codex");
  }
  if (!hasTcl) {
    add(findings, "warning", dir, "Directory is missing a TCL{barcode}.md file.", `${dir}/TCL?.md`, "codex");
  }
}

const output = {
  generated_at: scan.generated_at,
  file_count: scan.files.length,
  finding_count: findings.length,
  findings
};

console.log(JSON.stringify(output, null, 2));

if (args["fail-on-drift"] && findings.length > 0) {
  process.exitCode = 1;
}
