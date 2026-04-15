# MACRO LEDGER — Jake Personal Oracle Project

Top-level navigation index for the JakeNext workspace.

Read this first, then jump to the nearest subsystem.

---

## Oracle Status — 2026-04-14

| Component | Status | Notes |
|---|---|---|
| Global ledger spine | ✅ Live | `ledgers/FDL.md`, `ledgers/FCL.md`, `ledgers/TCL.md`, `ledgers/MACRO_LEDGER.md` |
| Local ledger discipline | ✅ Live | Every meaningful directory now has both `FCL.md` and `TCL.md` |
| Ratio lattice baseline | ✅ v1 | `ledgers/RLL.md` plus key local `RLL.md` files now rank the current corpus by comparator |
| Sylvia chooser loop | ✅ v1 | `chooser/` now turns module gaps into a current winner, queue packets, run receipts, and recurring automations |
| Sylvia identity layer | ✅ v1 | `identity/` defines personality, decision laws, relation boundaries, and module doctrine |
| North star goals | ✅ v1 | `northstar/` defines the three breakthrough pillars: Ratio Lattice, Perceptual Substrate, Hardware Inference |
| Jake blocker lane | ✅ v1 | `jake/` now handles operator-specific blockers without guesswork |
| Canon directory | ✅ Live | Foundation and deferred registry moved out of root into `canon/` |
| Event spine | ✅ v1 | Packet lifecycle and real event receipts working |
| Trigger grammar | ✅ v1 | Declarative file-event routing and safety rules |
| Handoff bus | ✅ v1 | Durable Codex / Claude Co-Work / shared queues |
| Skills architecture | ✅ v1 | Skills-first workflow packages with local ledgers |
| Static orchestrator UI | ✅ v1 | File-tree-centered frontend control surface |
| Dispatcher (core) | ✅ v1 | `scripts/dispatcher.mjs` + `skills/codex-dispatcher/` — queue detection, routing law, safe-auto execution, ledger traces |
| Orchestrator live actions | ✅ v1 | `scripts/orchestrator_server.mjs` + Act panel in UI — real-time queue state, action buttons, console output |
| Ingress adapters | ✅ v1 | Slack + ClickUp skills live and first passes run; GCal needs MCP tool refresh (upgrade broke session) |

---

## Quick Navigation

| Need | Go to |
|---|---|
| Agent boundaries and mandatory ledger discipline | `AGENTS.md` |
| Global repository rules | `CLAUDE.md` |
| Global topology map | `ledgers/FDL.md` |
| Global root inventory | `ledgers/FCL.md` |
| Global continuity log | `ledgers/TCL.md` |
| Global ratio lattice baseline | `ledgers/RLL.md` |
| Sylvia chooser loop | `chooser/` |
| Sylvia identity kernel | `identity/` |
| North star goals and breakthrough pillars | `northstar/` |
| Jake blocker lane | `jake/` |
| Canonical doctrine and deferred registry | `canon/` |
| Skills registry | `skills/FCL.md` |
| File-tree orchestrator UI | `orchestrator/index.html` |
| Trigger grammar | `triggers/TRIGGER_RULES.md` |
| Event receipts | `events/` |
| Handoff queues | `handoff/` |

---

## Key Documents

| Document | Location | Purpose |
|---|---|---|
| `AGENTS.md` | root | Agent boundaries, skills-first doctrine, trigger-safe work |
| `CLAUDE.md` | root | Global repository governance |
| `ledgers/FDL.md` | `ledgers/` | Global directory map |
| `ledgers/FCL.md` | `ledgers/` | Global root-level inventory |
| `ledgers/TCL.md` | `ledgers/` | Global continuity log |
| `ledgers/RLL.md` | `ledgers/` | Global comparative ranking ledger |
| `identity/SYLVIA.md` | `identity/` | Sylvia identity definition and invariants |
| `northstar/BREAKTHROUGH_GOALS.md` | `northstar/` | The three technology pillars — Ratio Lattice, Perceptual Substrate, Hardware Inference |
| `northstar/NORTH_STAR.md` | `northstar/` | End condition and capability milestones |
| `chooser/CHOOSER_POLICY.md` | `chooser/` | Decision law for hourly Sylvia next-step selection |
| `chooser/MODULE_PROGRESS.md` | `chooser/` | Current module gap table and best-next-move state |
| `chooser/NEXT_STEP.md` | `chooser/` | Current winning move, queue mode, and success condition |
| `jake/JAKE_INTERFACE.md` | `jake/` | Rules for Jake-needed escalation |
| `ledgers/MACRO_LEDGER.md` | `ledgers/` | This file — top-level navigation |
| `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md` | `canon/` | Canonical oracle doctrine |
| `canon/JAKE_DEFERRED_REGISTRY.md` | `canon/` | Deferred registry and correction memory |
| `canon/SYLVIA_SYSTEM_STATE.md` | `canon/` | **Single-document system orientation report** — read this at the start of a new session to get fully oriented without reading every ledger |

---

## Root Rule

Only two free-floating root documents are allowed:

- `AGENTS.md`
- `CLAUDE.md`

If any other meaningful document appears at root, the workspace is out of discipline.

---

## Workspace Structure

```text
JakeNext/
├── AGENTS.md
├── CLAUDE.md
├── ledgers/
├── chooser/
├── canon/
├── identity/
├── northstar/
├── .oraclestate/
├── jake/
├── source/
├── analysis/
├── DAILY_BRIEFINGS/
├── skills/
├── events/
├── triggers/
├── handoff/
├── orchestrator/
├── templates/
└── scripts/
```

---

## Current Design Law

Every meaningful action must update:

1. the relevant local `FCL.md`,
2. the relevant local `TCL.md`,
3. the global `ledgers/FDL.md` if topology changed,
4. the global `ledgers/TCL.md`,
5. the global `ledgers/RLL.md` when comparative ranking changes,
6. `chooser/` when the active next move or module gap state changes,
7. `ledgers/MACRO_LEDGER.md` when top-level navigation or status changes,
8. the relevant `jake/` ledgers when the operator lane is used or changed,
9. and `orchestrator/` when the visible operating model should change with the architecture.
