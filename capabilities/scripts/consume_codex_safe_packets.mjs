#!/usr/bin/env node
import { access, rename, readdir } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { appendText, readText, writeText, workspacePath } from "./lib/oracle_fs.mjs";

const execFileAsync = promisify(execFile);
const CODEX_QUEUE = "collaboration/handoff/codex";
const SCRIPT_DIR = "capabilities/scripts";

function sectionValue(markdown, heading) {
  const pattern = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  return match ? match[1].trim() : "";
}

function replaceStatus(markdown, status) {
  return markdown.replace(/^Status:\s*`[^`]+`/m, `Status: \`${status}\``);
}

function describePurpose(markdown, fallback) {
  const desiredOutput = sectionValue(markdown, "Desired Output").split("\n")[0].trim();
  return desiredOutput || fallback;
}

async function appendTcl(relativePath, heading, action) {
  const now = new Date();
  await appendText(relativePath, `\n### ${now.toISOString().slice(0, 10)} ~${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} EDT — ${heading}\n\n**Action**: ${action}\n`);
}

async function movePacket(fromRel, toRel) {
  await rename(workspacePath(fromRel), workspacePath(toRel));
}

async function pathExists(relativePath) {
  try {
    await access(workspacePath(relativePath));
    return true;
  } catch {
    return false;
  }
}

async function resolveDonePath(base, markdown) {
  const preferred = `${CODEX_QUEUE}/done/${base}`;
  if (!(await pathExists(preferred))) return preferred;

  const chooserSource = sectionValue(markdown, "Chooser Source").replace(/`/g, "");
  const runStem = chooserSource ? path.basename(chooserSource, ".md") : "";
  if (runStem) {
    const candidate = `${CODEX_QUEUE}/done/${path.basename(base, ".md")}_${runStem}.md`;
    if (!(await pathExists(candidate))) return candidate;
  }

  return `${CODEX_QUEUE}/done/${path.basename(base, ".md")}_${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
}

async function writePacketStatus(relativePath, status) {
  const current = await readText(relativePath);
  await writeText(relativePath, replaceStatus(current, status));
}

function upsertFclEntry(markdown, file, purpose, statusText) {
  const row = `| \`${file}\` | ${purpose} | ${statusText} |`;
  const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rowPattern = new RegExp("^\\| `" + escapedFile + "` \\|.*$", "m");
  if (rowPattern.test(markdown)) {
    return markdown.replace(rowPattern, row);
  }
  const marker = "## Entries\n\n| File | Purpose | Status |\n|---|---|---|";
  if (!markdown.includes(marker)) return markdown;
  return markdown.replace(marker, `${marker}\n${row}`);
}

async function removeFclEntry(relativePath, file) {
  const current = await readText(relativePath);
  const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rowPattern = new RegExp("^\\| `" + escapedFile + "` \\|.*\\n?", "m");
  const updated = current.replace(rowPattern, "");
  if (updated !== current) {
    await writeText(relativePath, updated);
  }
}

async function addOrUpdateFclEntry(relativePath, file, purpose, statusText) {
  const current = await readText(relativePath);
  const updated = upsertFclEntry(current, file, purpose, statusText);
  if (updated !== current) {
    await writeText(relativePath, updated);
  }
}

async function updateNextStepQueueState(fromRel, toRel, base) {
  const nextStepPath = "chooser/NEXT_STEP.md";
  const current = await readText(nextStepPath, null);
  if (!current || !current.includes(base)) return;

  let updated = current;
  const inboxRel = `${CODEX_QUEUE}/inbox/${base}`;
  const activeRel = `${CODEX_QUEUE}/active/${base}`;
  updated = updated.replace(inboxRel, toRel);
  updated = updated.replace(activeRel, toRel);
  if (updated.includes("- Packet Status:")) {
    updated = updated.replace(/- Packet Status: `[^`]+`/, "- Packet Status: `done`");
  } else {
    updated = updated.replace("## Success Signal", "- Packet Status: `done`\n\n## Success Signal");
  }
  await writeText(nextStepPath, updated);
}

async function runSafeAction(action) {
  if (action === "safe_substrate_cycle") {
    await execFileAsync(process.execPath, [`${SCRIPT_DIR}/update_module_progress.mjs`], { cwd: workspacePath("") });
    await execFileAsync(process.execPath, [`${SCRIPT_DIR}/daily_substrate_sweep.mjs`], { cwd: workspacePath("") });
    return [`${SCRIPT_DIR}/update_module_progress.mjs`, `${SCRIPT_DIR}/daily_substrate_sweep.mjs`];
  }
  if (action === "daily_reflection") {
    await execFileAsync(process.execPath, [`${SCRIPT_DIR}/daily_sylvia_reflection.mjs`], { cwd: workspacePath("") });
    return [`${SCRIPT_DIR}/daily_sylvia_reflection.mjs`];
  }
  if (action === "refresh_module_progress") {
    await execFileAsync(process.execPath, [`${SCRIPT_DIR}/update_module_progress.mjs`], { cwd: workspacePath("") });
    return [`${SCRIPT_DIR}/update_module_progress.mjs`];
  }
  if (action === "refresh_chooser_state") {
    await execFileAsync(process.execPath, [`${SCRIPT_DIR}/update_module_progress.mjs`], { cwd: workspacePath("") });
    return [`${SCRIPT_DIR}/update_module_progress.mjs`];
  }
  return [];
}

const inboxDir = workspacePath(`${CODEX_QUEUE}/inbox`);
const files = (await readdir(inboxDir)).filter((file) => file.endsWith(".md")).sort();
const eligible = [];

for (const file of files) {
  const rel = `${CODEX_QUEUE}/inbox/${file}`;
  const text = await readText(rel);
  const mode = sectionValue(text, "Execution Mode").replace(/`/g, "");
  if (mode === "codex_safe_auto") {
    eligible.push({ file, rel, text });
  }
}

if (eligible.length === 0) {
  console.log(JSON.stringify({ consumed: 0, skipped: files.length }, null, 2));
  process.exit(0);
}

const packet = eligible[0];
const base = path.basename(packet.file);
const activeRel = `${CODEX_QUEUE}/active/${base}`;
const doneRel = await resolveDonePath(base, packet.text);
const doneBase = path.basename(doneRel);
const purpose = describePurpose(packet.text, "Codex safe autonomous work order");

await movePacket(packet.rel, activeRel);
await writePacketStatus(activeRel, "active");
await removeFclEntry(`${CODEX_QUEUE}/inbox/FCLclhcoi.md`, base);
await addOrUpdateFclEntry(`${CODEX_QUEUE}/active/FCLclhcoa.md`, base, purpose, "🟡 Active");
await appendTcl(`${CODEX_QUEUE}/active/TCLclhcoa.md`, "Codex safe packet activated", `Moved \`${base}\` into active for safe autonomous execution.`);

const action = sectionValue(packet.text, "Safe Action").replace(/`/g, "");
const moduleTarget = sectionValue(packet.text, "Module Target").replace(/`/g, "");
const executed = await runSafeAction(action);

await appendText(activeRel, `\n\n## Worker Receipt\n\n- Safe Action Executed: \`${action}\`\n- Completed At: \`${new Date().toISOString()}\`\n`);
await movePacket(activeRel, doneRel);
await writePacketStatus(doneRel, "done");
await removeFclEntry(`${CODEX_QUEUE}/active/FCLclhcoa.md`, base);
await addOrUpdateFclEntry(`${CODEX_QUEUE}/done/FCLclhcod.md`, doneBase, purpose, "✅ Live");
await updateNextStepQueueState(activeRel, doneRel, base);
await appendTcl(`${CODEX_QUEUE}/done/TCLclhcod.md`, "Codex safe packet completed", `Completed safe autonomous packet \`${doneBase}\` for module \`${moduleTarget}\`.`);
await appendTcl("ledgers/TCLl.md", "Codex safe worker executed packet", `Executed safe action \`${action}\` from \`${base}\` and archived receipt \`${doneBase}\` in Codex done.`);

console.log(JSON.stringify({
  consumed: 1,
  file: base,
  action,
  module: moduleTarget,
  commands: executed
}, null, 2));
