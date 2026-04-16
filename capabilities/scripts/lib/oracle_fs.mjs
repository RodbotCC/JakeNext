import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile, appendFile, copyFile } from "node:fs/promises";
import path from "node:path";

export const WORKSPACE = path.resolve(new URL("../../..", import.meta.url).pathname);

export const IGNORE_NAMES = new Set([
  ".DS_Store",
  ".git",
  "node_modules"
]);

export const GENERATED_STATE_DIR = ".oraclestate";

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value) {
  return String(value || "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "event";
}

export function eventId(eventType, sourcePath = "") {
  const stamp = nowIso().replace(/[-:.]/g, "").replace("T", "T").replace("Z", "Z");
  const seed = `${eventType}:${sourcePath}:${stamp}`;
  const digest = createHash("sha1").update(seed).digest("hex").slice(0, 8);
  return `evt_${stamp}_${slugify(eventType)}_${digest}`;
}

export function workspacePath(relativePath = "") {
  return path.join(WORKSPACE, relativePath);
}

export function toRel(absPath) {
  return path.relative(WORKSPACE, absPath).split(path.sep).join("/");
}

export async function ensureDir(relativePath) {
  await mkdir(workspacePath(relativePath), { recursive: true });
}

export async function readText(relativePath) {
  return readFile(workspacePath(relativePath), "utf8");
}

export async function writeText(relativePath, content) {
  await ensureDir(path.dirname(relativePath));
  await writeFile(workspacePath(relativePath), content, "utf8");
}

export async function appendText(relativePath, content) {
  await ensureDir(path.dirname(relativePath));
  await appendFile(workspacePath(relativePath), content, "utf8");
}

export async function readJson(relativePath, fallback = null) {
  try {
    return JSON.parse(await readText(relativePath));
  } catch {
    return fallback;
  }
}

export async function writeJson(relativePath, data) {
  await writeText(relativePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function hashFile(absPath) {
  const content = await readFile(absPath);
  return createHash("sha256").update(content).digest("hex");
}

async function walk(absDir, root = absDir, files = []) {
  const entries = await readdir(absDir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_NAMES.has(entry.name)) continue;
    const abs = path.join(absDir, entry.name);
    const rel = path.relative(root, abs).split(path.sep).join("/");
    if (entry.isDirectory()) {
      await walk(abs, root, files);
      continue;
    }
    if (!entry.isFile()) continue;
    const info = await stat(abs);
    files.push({
      path: rel,
      size: info.size,
      mtimeMs: Math.round(info.mtimeMs),
      sha256: await hashFile(abs)
    });
  }
  return files;
}

export async function scanTree() {
  const files = await walk(WORKSPACE);
  files.sort((a, b) => a.path.localeCompare(b.path));
  return {
    workspace: WORKSPACE,
    generated_at: nowIso(),
    files
  };
}

export function classifyPath(sourcePath = "") {
  if (sourcePath.startsWith("pieces/")) return "pieces_behavioral";
  if (sourcePath.startsWith("knowledge/source/")) return "raw_source";
  if (sourcePath.startsWith("knowledge/analysis/")) return "analysis";
  if (sourcePath.startsWith("capabilities/scripts/")) return "tooling";
  if (sourcePath.startsWith("signals/events/")) return "event";
  if (sourcePath.startsWith("signals/triggers/")) return "trigger";
  if (sourcePath.startsWith("capabilities/templates/")) return "template";
  if (sourcePath.startsWith("collaboration/handoff/")) return "handoff";
  if (sourcePath.startsWith(".oraclestate/")) return "state";
  if (sourcePath === "canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md") return "canon";
  if (sourcePath === "canon/JAKE_DEFERRED_REGISTRY.md") return "registry";
  if (sourcePath.startsWith("ledgers/")) return "ledger";
  if (sourcePath === "AGENTS.md" || sourcePath === "CLAUDE.md") return "agent_contract";
  return "unknown";
}

export function routeForPath(sourcePath = "", eventType = "file_edited") {
  const classification = classifyPath(sourcePath);
  if (eventType === "correction") return "claude-cowork";
  if (eventType === "density") return "claude-cowork";
  if (sourcePath.startsWith("collaboration/handoff/shared/")) return "shared/conflicts";
  if (classification === "pieces_behavioral") return "claude-cowork";
  if (classification === "raw_source" || classification === "analysis" || classification === "canon" || classification === "registry") {
    return "claude-cowork";
  }
  if (classification === "unknown" && eventType === "ledger_drift") return "codex";
  return "codex";
}

/**
 * Compute the barcode suffix for a directory path.
 * Rules: top-level dirs starting with 'c' use 2 letters (ca, cp, ch, cl).
 * Subdirs use first letter, except: scripts→sc, skills→sk, codex→co,
 * claude-cowork→cc.
 */
export function ledgerBarcode(dirPath) {
  const segments = dirPath.replace(/\/+$/, "").split("/").filter(Boolean);
  if (segments.length === 0) return "";

  const TWO_LETTER_TOPS = { canon: "ca", capabilities: "cp", chooser: "ch", collaboration: "cl", clips: "ci" };
  const SUB_OVERRIDES = { scripts: "sc", skills: "sk", codex: "co", "claude-cowork": "cc" };

  let code = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (i === 0 && TWO_LETTER_TOPS[seg]) {
      code += TWO_LETTER_TOPS[seg];
    } else if (SUB_OVERRIDES[seg]) {
      code += SUB_OVERRIDES[seg];
    } else {
      code += seg[0];
    }
  }
  return code;
}

export function ledgerUpdatesForPath(sourcePath = "", eventType = "file_edited") {
  const updates = ["ledgers/TCLl.md"];
  const top = sourcePath.split("/")[0];
  if (eventType === "file_created" || eventType === "file_moved") {
    if (sourcePath.includes("/")) {
      const topBarcode = ledgerBarcode(top);
      updates.push(`${top}/FCL${topBarcode}.md`);
      updates.push(`${top}/TCL${topBarcode}.md`);
    } else {
      updates.push("ledgers/FCLl.md");
    }
    updates.push("ledgers/FDL.md");
  }
  if (["ledger_drift", "correction", "density"].includes(eventType) && sourcePath.includes("/")) {
    const topBarcode = ledgerBarcode(top);
    updates.push(`${top}/TCL${topBarcode}.md`);
  }
  return [...new Set(updates)];
}

export function buildEventPacket({
  event_type,
  source_path,
  notes = "",
  classification,
  recommended_route,
  needs_ai_review,
  ledger_updates
}) {
  const finalClassification = classification || classifyPath(source_path);
  const finalRoute = recommended_route || routeForPath(source_path, event_type);
  const reviewDefault = ["raw_source", "analysis", "canon", "registry"].includes(finalClassification) || finalRoute.startsWith("shared");
  return {
    event_id: eventId(event_type, source_path),
    event_type,
    timestamp: nowIso(),
    source_path,
    classification: finalClassification,
    recommended_route: finalRoute,
    needs_ai_review: typeof needs_ai_review === "boolean" ? needs_ai_review : reviewDefault,
    ledger_updates: ledger_updates || ledgerUpdatesForPath(source_path, event_type),
    notes,
    status: "new"
  };
}

export async function writeEvent(packet, dir = "signals/events/inbox") {
  const file = `${dir}/${packet.event_id}.json`;
  await writeJson(file, packet);
  await appendEventLog(packet, file);
  return file;
}

export async function appendEventLog(packet, packetPath = "") {
  await appendText(`${GENERATED_STATE_DIR}/event_log.jsonl`, `${JSON.stringify({
    timestamp: nowIso(),
    event_id: packet.event_id,
    event_type: packet.event_type,
    source_path: packet.source_path,
    route: packet.recommended_route,
    packet_path: packetPath
  })}\n`);
}

export async function copyRelativeFile(fromRel, toRelPath) {
  await ensureDir(path.dirname(toRelPath));
  await copyFile(workspacePath(fromRel), workspacePath(toRelPath));
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) {
      args._.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}
