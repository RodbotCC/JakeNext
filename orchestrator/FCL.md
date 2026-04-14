# FCL — Orchestrator UI
### Jake Personal Oracle Project

> Static frontend for the JakeNext file-tree orchestrator.
> Last updated: 2026-04-14

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `index.html` | Main static application shell for the file-tree orchestrator dashboard | ✅ Live |
| `styles.css` | Styling for the orchestrator dashboard, adapted to JakeNext's substrate | ✅ Live |
| `app.js` | Interactive logic and in-memory model for Sylvia, the chooser loop, module progress, triggers, agents, events, and handoff views | ✅ Live |
| `FCL.md` | This file — directory contents ledger | ✅ Live |
| `TCL.md` | Local continuity ledger for orchestrator evolution | ✅ Live |
| `RLL.md` | Local Ratio Lattice Ledger for orchestrator file importance | ✅ Live |

---

## Supporting scripts

| Script | Purpose |
|---|---|
| `scripts/orchestrator_server.mjs` | Lightweight HTTP server that serves the UI and exposes API endpoints for live oracle actions |

---

## Notes

- The UI is now interactive: an "Act" panel connects to `orchestrator_server.mjs` to trigger dispatcher, chooser, safe worker, and reflection runs in real time.
- Static views (Tree, Sylvia, Chooser, Lattice, Triggers, Events, Queues, Agents, Scripts) continue working without the server.
- The Act panel shows live queue state, the current winner, and a console with last-action output.
- Start the server with: `node scripts/orchestrator_server.mjs`
- When architecture, routing, ownership, or subsystem status changes, this UI should be updated alongside the ledgers so the control surface stays truthful.
