# FDL — Global File Directory Ledger
### Jake Personal Oracle Project

> Master map of the JakeNext workspace topology.
> Last updated: 2026-04-15

---

## Root Policy

Only `AGENTS.md` and `CLAUDE.md` may float at root.

All other meaningful artifacts must live inside directories with both:

- `FCL.md`
- `TCL.md`

---

## Root Files

| File | Purpose | Status |
|---|---|---|
| `AGENTS.md` | Agent boundary contract for Codex, Claude Co-Work, future namespaces, and skills-first rules | ✅ Live |
| `CLAUDE.md` | Global repository governance, truth hierarchy, and workspace rules | ✅ Live |

---

## Topology Map

### Core System Directories (9)

| Directory | Primary Ledger Files | Purpose | Status |
|---|---|---|---|
| `ledgers/` | `FCL.md`, `TCL.md`, `FDL.md`, `MACRO_LEDGER.md`, `RLL.md`, `NSL.md` | Global memory spine, navigation, comparative ranking, and north star alignment | ✅ Live |
| `chooser/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Sylvia decision loop, module gap state, next-step selection | ✅ Live |
| `canon/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Canonical oracle doctrine, deferred registry, ONAL philosophy | ✅ Live |
| `identity/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Sylvia identity kernel — personality, decision laws, relation boundaries, modules | ✅ Live |
| `northstar/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | North star goals, breakthrough pillars, roadmap, convergence targets | ✅ Live |
| `.oraclestate/` | `FCL.md`, `TCL.md` | Generated machine state snapshots | ✅ Live |
| `signals/` | `FCL.md`, `TCL.md` | **PARENT** - Signal processing layer (events, triggers, briefings) | ✅ Live |
| `collaboration/` | `FCL.md`, `TCL.md` | **PARENT** - Multi-agent coordination layer (handoff, jake) | ✅ Live |
| `capabilities/` | `FCL.md`, `TCL.md` | **PARENT** - Operational capabilities layer (skills, scripts, templates, orchestrator) | ✅ Live |

### Parent Directory Contents

**signals/** - Signal processing layer
- `signals/events/` - Event packet lifecycle (inbox, processed, failed)
- `signals/triggers/` - Event routing rules and trigger grammar
- `signals/briefings/` - Daily sweep outputs (formerly DAILY_BRIEFINGS/)

**collaboration/** - Multi-agent coordination layer
- `collaboration/handoff/` - Agent collaboration bus (codex, claude-cowork, shared queues)
- `collaboration/jake/` - Jake-owned blocker lane (inbox, active, done)

**capabilities/** - Operational capabilities layer
- `capabilities/skills/` - Skills-first operating packages (15 skills)
- `capabilities/scripts/` - Automation and validation tendons
- `capabilities/templates/` - Reusable packet templates
- `capabilities/orchestrator/` - Frontend control surface (UI)

### Breakthrough Research Directories

| Directory | Primary Ledger Files | Purpose | Status |
|---|---|---|---|
| `breakthrough/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Theoretical frameworks — confident but not yet bedrock for Sylvia (ONAL, delta physics, thermodynamic annealing) | ✅ Live |

### Integration Directories

| Directory | Primary Ledger Files | Purpose | Status |
|---|---|---|---|
| `pieces/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Pieces behavioral memory integration — sweep outputs, pattern synthesis, oracle training signal | ✅ Live |
| `pieces/sweeps/` | `FCL.md`, `TCL.md` | Dated sweep output files from Pieces ingress | ✅ Live |
| `pieces/patterns/` | `FCL.md`, `TCL.md` | Promoted durable behavioral patterns (3+ sweep confirmations) | ✅ Live |

### Product Directories

| Directory | Primary Ledger Files | Purpose | Status |
|---|---|---|---|
| `Framed/` | `FCL.md`, `TCL.md` | Visual operating-manual system — React/Vite app for executable frames, block relationships, command bridge, agent orchestration glue layer | ✅ Live |

### Temporary / Reference Directories

| Directory | Purpose | Status |
|---|---|---|
| `knowledge/` | **TEMPORARY PARENT** - Raw materials (source/) and outputs (analysis/) - likely to be deprecated | ⚠️ Review needed |
| `claude-code NO NEED FOR LEDGER SUPPORT/` | **REFERENCE ONLY** - Claude Code capability index (175 files) - will be deprecated/deleted once capabilities are wired | 📚 Temporary |
| `claude-memory` | **SYMLINK / READ-ONLY** — Points to Claude Code auto-memory (`~/.claude/projects/.../memory/`); orientation context, not ground truth; maintained by Claude Code harness | 🔗 Read-only |

---

## Nested Operational Directories

### signals/ subdirectories
| Directory | Ledgers | Purpose | Status |
|---|---|---|---|
| `signals/events/inbox/` | `FCL.md`, `TCL.md` | New event packets awaiting routing | ✅ Live |
| `signals/events/processed/` | `FCL.md`, `TCL.md` | Routed event receipts | ✅ Live |
| `signals/events/failed/` | `FCL.md`, `TCL.md` | Failed event recovery | ✅ Live |

### collaboration/ subdirectories
| Directory | Ledgers | Purpose | Status |
|---|---|---|---|
| `collaboration/handoff/codex/` | `FCL.md`, `TCL.md` | Codex queue root | ✅ Live |
| `collaboration/handoff/codex/inbox/` | `FCL.md`, `TCL.md` | New Codex work orders | ✅ Live |
| `collaboration/handoff/codex/active/` | `FCL.md`, `TCL.md` | Codex active work | ✅ Live |
| `collaboration/handoff/codex/done/` | `FCL.md`, `TCL.md` | Completed Codex work | ✅ Live |
| `collaboration/handoff/claude-cowork/` | `FCL.md`, `TCL.md` | Claude Co-Work queue root | ✅ Live |
| `collaboration/handoff/claude-cowork/inbox/` | `FCL.md`, `TCL.md` | New semantic work orders | ✅ Live |
| `collaboration/handoff/claude-cowork/active/` | `FCL.md`, `TCL.md` | Claude Co-Work active work | ✅ Live |
| `collaboration/handoff/claude-cowork/done/` | `FCL.md`, `TCL.md` | Completed semantic work | ✅ Live |
| `collaboration/handoff/shared/` | `FCL.md`, `TCL.md` | Shared coordination root | ✅ Live |
| `collaboration/handoff/shared/decisions/` | `FCL.md`, `TCL.md` | Shared decisions | ✅ Live |
| `collaboration/handoff/shared/questions/` | `FCL.md`, `TCL.md` | Shared questions | ✅ Live |
| `collaboration/handoff/shared/conflicts/` | `FCL.md`, `TCL.md` | Shared conflicts | ✅ Live |
| `collaboration/jake/inbox/` | `FCL.md`, `TCL.md` | New Jake-needed requests | ✅ Live |
| `collaboration/jake/active/` | `FCL.md`, `TCL.md` | Jake requests in progress | ✅ Live |
| `collaboration/jake/done/` | `FCL.md`, `TCL.md` | Completed Jake requests | ✅ Live |

### capabilities/ subdirectories
| Directory | Ledgers | Purpose | Status |
|---|---|---|---|
| `capabilities/scripts/lib/` | `FCL.md`, `TCL.md` | Shared script helpers | ✅ Live |
| `capabilities/skills/oracle-ledger-update/` | `FCL.md`, `TCL.md`, `SKILL.md` | Ledger maintenance skill | ✅ Live |
| `capabilities/skills/codex-file-tree-orchestrator/` | `FCL.md`, `TCL.md`, `SKILL.md` | File tree orchestration skill | ✅ Live |
| `capabilities/skills/codex-ledger-drift-repair/` | `FCL.md`, `TCL.md`, `SKILL.md` | Mechanical drift repair skill | ✅ Live |
| `capabilities/skills/codex-event-packet-ops/` | `FCL.md`, `TCL.md`, `SKILL.md` | Event packet operations skill | ✅ Live |
| `capabilities/skills/claude-cowork-semantic-triage/` | `FCL.md`, `TCL.md`, `SKILL.md` | Semantic triage skill | ✅ Live |
| `capabilities/skills/claude-cowork-canon-evolution/` | `FCL.md`, `TCL.md`, `SKILL.md` | Canon evolution skill | ✅ Live |
| `capabilities/skills/shared-skill-audit/` | `FCL.md`, `TCL.md`, `SKILL.md` | Skill audit skill | ✅ Live |
| `capabilities/skills/shared-jake-roadblock-escalation/` | `FCL.md`, `TCL.md`, `SKILL.md` | Shared skill for routing Jake-specific blockers | ✅ Live |
| `capabilities/skills/codex-sylvia-chooser/` | `FCL.md`, `TCL.md`, `SKILL.md` | Codex chooser skill for hourly Sylvia next-step selection | ✅ Live |
| `capabilities/skills/codex-safe-worker/` | `FCL.md`, `TCL.md`, `SKILL.md` | Codex skill for safe autonomous local execution of approved packets | ✅ Live |
| `capabilities/skills/shared-module-gap-audit/` | `FCL.md`, `TCL.md`, `SKILL.md` | Shared audit skill for module gap coverage and completion signals | ✅ Live |
| `capabilities/skills/codex-dispatcher/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 dispatcher skill — queue detection, routing law, safe execution, ledger discipline | ✅ v1 |
| `capabilities/skills/claude-cowork-slack-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — Slack signals → event packets (unanswered DMs, mentions, action opportunities) | ✅ v1 |
| `capabilities/skills/claude-cowork-gcal-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — GCal events → event packets (commitments, deadlines, scheduling gaps) | ✅ v1 |
| `capabilities/skills/claude-cowork-clickup-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — ClickUp tasks → event packets (stalled, overdue, blocking, new) | ✅ v1 |
| `capabilities/skills/claude-cowork-pieces-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Behavioral memory ingress — Pieces MCP → sweep reports + event packets (work patterns, clipboard, screenshots, audio) | ✅ v1 |

### Other nested directories
| Directory | Ledgers | Purpose | Status |
|---|---|---|---|
| `identity/modules/` | `FCL.md`, `TCL.md` | Sylvia module doctrine package | ✅ Live |
| `chooser/runs/` | `FCL.md`, `TCL.md` | Append-only chooser and reflection receipts | ✅ Live |

---

## Ledger Rules

| Layer | File Pattern | Scope |
|---|---|---|
| Global topology | `ledgers/FDL.md` | Whole workspace structure |
| Global navigation | `ledgers/MACRO_LEDGER.md` | Whole workspace status and entry points |
| Global continuity | `ledgers/TCLl.md` | Cross-workspace event history |
| Global comparative ranking | `ledgers/RLLl.md` | Whole workspace scoring basis and ranked corpus |
| **Global north star alignment** | **`ledgers/NSLl.md`** | **Whole workspace alignment with Sylvia's becoming** |
| Identity kernel | `identity/` | Sylvia doctrine, relation law, and roadmap |
| Local contents | `{dir}/FCL.md` | One directory's inventory and purpose |
| Local continuity | `{dir}/TCL.md` | One directory's history and changes |
| Local comparative ranking | `{dir}/RLL.md` | One directory's relative priorities and winners |
| **Local north star alignment** | **`{dir}/NSL.md`** | **One directory's purpose relative to north star** |
