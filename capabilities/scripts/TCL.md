# TCL — Scripts
### Jake Personal Oracle Project

> Local continuity ledger for the `scripts/` directory.
> Last updated: 2026-04-14

---

## Log

### 2026-04-14 ~01:28 EDT — Scripts TCL initialized

**Action**: Added a local temporal ledger for automation script evolution.

### 2026-04-14 ~01:46 EDT — Daily sweep ledger targets corrected

**Action**: Updated `daily_substrate_sweep.mjs` so generated packets reference `ledgers/FDL.md`, `ledgers/FCL.md`, `ledgers/MACRO_LEDGER.md`, and `ledgers/TCL.md` instead of the old root-level paths.

### 2026-04-14 ~04:20 EDT — Chooser loop script set added

**Action**: Added `update_module_progress.mjs`, `sylvia_hourly_chooser.mjs`, `consume_codex_safe_packets.mjs`, and `daily_sylvia_reflection.mjs` to give Sylvia a first real choose → queue → execute-safe → reflect loop.

### 2026-04-14 — Phase 3: orchestrator_server.mjs added

**Action**: Created `scripts/orchestrator_server.mjs` — a lightweight Node.js HTTP server (no external deps) that serves the orchestrator UI and exposes API endpoints for live oracle actions. Endpoints: GET /api/status, /api/queue-state, /api/next-step, /api/module-progress; POST /api/dispatch, /api/chooser, /api/safe-worker, /api/reflect. Runs on port 7000 by default, configurable via `--port=`. Combined with the updated orchestrator UI, this makes the control surface interactive.

### 2026-04-14 — Phase 3: dispatcher.mjs added

**Action**: Created `scripts/dispatcher.mjs` — the Sylvia dispatcher. Detects new packets in `handoff/codex/inbox/`, `handoff/claude-cowork/inbox/`, and `jake/inbox/`. Auto-executes `codex_safe_auto` packets immediately via the safe worker. Surfaces `claude_semantic` and `manual_jake` packets with ledger traces without faking execution. Supports one-shot and `--watch` daemon modes. Persists seen-packet state in `.oraclestate/dispatcher_state.json` to prevent double-dispatch. Writes JSON receipts to `events/processed/`.

**Outcome**: Scripts layer now has a dispatcher. Phase 3 core is live. The substrate is reactive rather than purely poll-scheduled.

### 2026-04-14 ~12:38 EDT — Safe worker now keeps NEXT_STEP truthful

**Action**: Updated `consume_codex_safe_packets.mjs` so when a safe packet completes, `chooser/NEXT_STEP.md` can reflect the done queue state instead of freezing at the original inbox path.
