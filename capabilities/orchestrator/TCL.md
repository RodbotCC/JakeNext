# TCL — Orchestrator UI
### Jake Personal Oracle Project

> Local continuity ledger for the `orchestrator/` directory.
> Last updated: 2026-04-14

---

## Log

### 2026-04-14 ~01:28 EDT — Orchestrator TCL initialized

**Action**: Added a local temporal ledger for frontend control-surface evolution.

### 2026-04-14 ~01:42 EDT — Orchestrator declared part of closing discipline

**Action**: Updated the repo doctrine so orchestrator files should be refreshed whenever the visible operating model changes, making UI truthfulness part of normal end-of-task follow-through.

### 2026-04-14 ~01:42 EDT — Control-surface copy and model updated

**Action**: Updated the orchestrator shell and data model so the UI now explicitly describes itself as part of ongoing substrate maintenance rather than a static one-time dashboard.

### 2026-04-14 ~02:12 EDT — Ratio Lattice UI surface added

**Action**: Added the first Ratio Lattice view to the orchestrator and recorded the top comparator winners so the frontend can explain baseline ranking law instead of only filesystem structure.

### 2026-04-14 ~03:05 EDT — Sylvia and Jake lane surfaced in the UI

**Action**: Updated the control surface to expose Sylvia as the named identity layer, show the ten-module north-star map, show the Jake lane, and explain the new `sylvia_emergence` comparator.

### 2026-04-14 ~04:20 EDT — Chooser loop surfaced in the UI

**Action**: Updated the orchestrator so it now shows the chooser subsystem, module progress, the current next step, execution mode, blocker states, and the new chooser comparators.

### 2026-04-14 ~12:38 EDT — First live chooser state reflected in the UI model

**Action**: Updated the orchestrator data model so it references the first real chooser receipt, the first real winning move, and the completed safe-worker packet state.

### 2026-04-14 — Phase 3: Orchestrator wired for live actions

**Action**: Upgraded the orchestrator from read-only to interactive. Added:
- `scripts/orchestrator_server.mjs` — lightweight HTTP server serving the UI and API endpoints
- New "Act" nav button (`dispatch` view) in `index.html`
- Action panel styles in `styles.css` (live-bar, action-grid, queue-count-grid, console-output, winner-card)
- Full dispatch view in `app.js` — live queue state, current winner, action buttons, console output
- Server endpoints: GET /api/status, /api/queue-state, /api/next-step, /api/module-progress; POST /api/dispatch, /api/chooser, /api/safe-worker, /api/reflect

**Behavior**: With server running (`node scripts/orchestrator_server.mjs`), the Act panel shows live queue counts, the current winning move, and lets Jake or Codex trigger any oracle action and see the result inline. Without the server, all static views remain fully functional.

**Outcome**: The orchestrator is now a real control surface, not a dashboard.
