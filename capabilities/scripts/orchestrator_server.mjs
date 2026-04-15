#!/usr/bin/env node
/**
 * orchestrator_server.mjs — Sylvia Orchestrator HTTP Server v1
 *
 * Lightweight server that makes the orchestrator control surface interactive.
 *
 * Serves orchestrator/index.html, styles.css, and app.js as static files.
 * Exposes API endpoints the UI can call to trigger real oracle actions.
 *
 * Usage:
 *   node scripts/orchestrator_server.mjs            # default port 7000
 *   node scripts/orchestrator_server.mjs --port=8080
 *
 * API surface:
 *   GET  /api/status          — server health ping
 *   GET  /api/queue-state     — live packet counts in all three queues
 *   GET  /api/next-step       — current NEXT_STEP.md content
 *   GET  /api/module-progress — current MODULE_PROGRESS.md content
 *   POST /api/dispatch        — run dispatcher one-shot pass
 *   POST /api/chooser         — run hourly chooser
 *   POST /api/safe-worker     — run safe packet consumer
 *   POST /api/reflect         — run daily reflection
 */

import http   from "node:http";
import path   from "node:path";
import { readFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { workspacePath, readText } from "./lib/oracle_fs.mjs";

const execFileAsync = promisify(execFile);

// ─── Config ───────────────────────────────────────────────────────────────────

const PORT = (() => {
  const flag = process.argv.find(a => a.startsWith("--port="));
  return flag ? parseInt(flag.split("=")[1], 10) : 7000;
})();

const ORCHESTRATOR_DIR = workspacePath("orchestrator");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico":  "image/x-icon",
};

const LEDGER_FILES = new Set(["FCL.md", "TCL.md", "RLL.md"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sendJson(res, data, status = 200) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type":                "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Content-Length":              Buffer.byteLength(body),
  });
  res.end(body);
}

async function serveStatic(res, absPath) {
  const ext  = path.extname(absPath).toLowerCase();
  const mime = MIME[ext] || "text/plain; charset=utf-8";
  try {
    const content = await readFile(absPath);
    res.writeHead(200, { "Content-Type": mime });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
}

async function runScript(relPath) {
  const start = Date.now();
  try {
    const result = await execFileAsync(
      process.execPath,
      [relPath],
      { cwd: workspacePath(""), timeout: 30_000 },
    );
    let output = {};
    try { output = JSON.parse(result.stdout.trim()); } catch { output = { raw: result.stdout.trim() }; }
    return { ok: true, durationMs: Date.now() - start, output };
  } catch (err) {
    return { ok: false, durationMs: Date.now() - start, error: err.message };
  }
}

async function getQueueState() {
  const queues = [
    { name: "Codex inbox",        path: "handoff/codex/inbox",        lane: "codex"         },
    { name: "Claude Co-Work inbox", path: "handoff/claude-cowork/inbox", lane: "claude-cowork" },
    { name: "Jake inbox",          path: "jake/inbox",                  lane: "jake"          },
  ];
  const result = [];
  for (const q of queues) {
    let packets = [];
    try {
      packets = (await readdir(workspacePath(q.path)))
        .filter(f => f.endsWith(".md") && !LEDGER_FILES.has(f));
    } catch { /**/ }
    result.push({ ...q, count: packets.length, packets });
  }
  return result;
}

// ─── Request handler ──────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method   = req.method.toUpperCase();

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // ── Static files ─────────────────────────────────────────────────────────────
  if (method === "GET") {
    if (pathname === "/" || pathname === "/index.html") {
      return serveStatic(res, path.join(ORCHESTRATOR_DIR, "index.html"));
    }
    if (pathname === "/styles.css") {
      return serveStatic(res, path.join(ORCHESTRATOR_DIR, "styles.css"));
    }
    if (pathname === "/app.js") {
      return serveStatic(res, path.join(ORCHESTRATOR_DIR, "app.js"));
    }
  }

  // ── API ───────────────────────────────────────────────────────────────────────

  // Health ping
  if (method === "GET" && pathname === "/api/status") {
    return sendJson(res, {
      ok:        true,
      server:    "sylvia-orchestrator",
      version:   "1.0",
      timestamp: new Date().toISOString(),
      workspace: workspacePath(""),
    });
  }

  // Live queue state
  if (method === "GET" && pathname === "/api/queue-state") {
    return sendJson(res, await getQueueState());
  }

  // Current NEXT_STEP
  if (method === "GET" && pathname === "/api/next-step") {
    try {
      const content = await readText("chooser/NEXT_STEP.md");
      return sendJson(res, { ok: true, content });
    } catch {
      return sendJson(res, { ok: false, error: "Could not read NEXT_STEP.md" }, 500);
    }
  }

  // Module progress
  if (method === "GET" && pathname === "/api/module-progress") {
    try {
      const content = await readText("chooser/MODULE_PROGRESS.md");
      return sendJson(res, { ok: true, content });
    } catch {
      return sendJson(res, { ok: false, error: "Could not read MODULE_PROGRESS.md" }, 500);
    }
  }

  // Run dispatcher
  if (method === "POST" && pathname === "/api/dispatch") {
    console.log(`[api] POST /api/dispatch`);
    return sendJson(res, await runScript("scripts/dispatcher.mjs"));
  }

  // Run chooser
  if (method === "POST" && pathname === "/api/chooser") {
    console.log(`[api] POST /api/chooser`);
    return sendJson(res, await runScript("scripts/sylvia_hourly_chooser.mjs"));
  }

  // Run safe worker
  if (method === "POST" && pathname === "/api/safe-worker") {
    console.log(`[api] POST /api/safe-worker`);
    return sendJson(res, await runScript("scripts/consume_codex_safe_packets.mjs"));
  }

  // Run daily reflection
  if (method === "POST" && pathname === "/api/reflect") {
    console.log(`[api] POST /api/reflect`);
    return sendJson(res, await runScript("scripts/daily_sylvia_reflection.mjs"));
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`\n[Sylvia Orchestrator] ─────────────────────────────────`);
  console.log(`  UI:        http://localhost:${PORT}`);
  console.log(`  Workspace: ${workspacePath("")}`);
  console.log(`  Actions:   /api/dispatch, /api/chooser, /api/safe-worker, /api/reflect`);
  console.log(`────────────────────────────────────────────────────────\n`);
});
