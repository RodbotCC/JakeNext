#!/usr/bin/env node
import { readdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { appendText, readText, writeText, workspacePath } from "./lib/oracle_fs.mjs";

const execFileAsync = promisify(execFile);
const now = new Date();
const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

function sectionValue(markdown, heading) {
  const pattern = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  return match ? match[1].trim() : "";
}

async function appendTcl(relativePath, heading, action) {
  await appendText(relativePath, `\n### ${now.toISOString().slice(0, 10)} ~${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} EDT — ${heading}\n\n**Action**: ${action}\n`);
}

await execFileAsync(process.execPath, ["scripts/update_module_progress.mjs"], { cwd: workspacePath("") });

const runDir = workspacePath("chooser/runs");
const files = (await readdir(runDir)).filter((file) => /^run_.*\.md$/.test(file)).sort();
const latest = files.slice(-3);
const parsed = [];

for (const file of latest) {
  const text = await readText(`chooser/runs/${file}`);
  const chosen = sectionValue(text, "Chosen Move");
  const moduleMatch = chosen.match(/Module Target:\s*`([^`]+)`/);
  const taskMatch = chosen.match(/Task:\s*(.+)/);
  parsed.push({
    file,
    module: moduleMatch ? moduleMatch[1] : "unknown",
    task: taskMatch ? taskMatch[1].trim() : "unknown"
  });
}

let repeated = false;
if (parsed.length >= 3) {
  repeated = parsed.every((entry) => entry.module === parsed[0].module && entry.task === parsed[0].task);
}

if (repeated) {
  const decisionPath = "handoff/shared/decisions/auto_duplicate_winner_review.md";
  const body = `# Work Order

Owner: \`shared\`
Status: \`inbox\`
Created: \`${now.toISOString()}\`

## Source Artifact

\`chooser/runs/\`

## Reason

The last three chooser runs selected the same winner without closing it, which suggests a stale loop or an unmodeled blocker.

## Desired Output

Review whether the chooser law, module progress scoring, or routing rules should change to avoid infinite repetition.

## Constraints

- Do not erase the existing winner unless a better move is explicit.
- Keep the receipt as an architecture-improvement proposal, not a silent override.

## Completion Signal

A shared decision or conflict packet exists explaining whether the repeated winner is correct, blocked, or mis-ranked.
`;
  await writeText(decisionPath, `${body}\n`);
}

const reflection = `# Daily Sylvia Reflection

Run ID: \`reflection_${stamp}\`
Created: \`${now.toISOString()}\`

## Latest Runs Reviewed

${parsed.map((entry) => `- \`${entry.file}\` — \`${entry.module}\` — ${entry.task}`).join("\n") || "- No chooser runs found."}

## Repetition Check

- Repeated winner detected: \`${repeated ? "yes" : "no"}\`

## Improvement Proposal

${repeated
  ? "- Shared decision packet opened to review a repeated winner loop."
  : "- No repeated stale-winner pattern strong enough to escalate today."}
`;

await writeText(`chooser/runs/reflection_${stamp}.md`, `${reflection}\n`);
await appendTcl("chooser/TCL.md", "Daily Sylvia reflection recorded", `Reviewed recent chooser runs and ${repeated ? "opened" : "did not need"} a repeated-winner improvement proposal.`);
await appendTcl("chooser/runs/TCL.md", "Reflection receipt added", `Added daily reflection receipt \`reflection_${stamp}.md\`.`);
await appendTcl("ledgers/TCL.md", "Sylvia daily reflection recorded", `Daily reflection reviewed recent chooser runs and ${repeated ? "opened a shared improvement proposal" : "found no repeated stale-winner escalation"} .`);

console.log(JSON.stringify({
  reviewed_runs: parsed.length,
  repeated_winner: repeated
}, null, 2));
