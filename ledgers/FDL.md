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

| Directory | Primary Ledger Files | Purpose | Status |
|---|---|---|---|
| `ledgers/` | `FCL.md`, `TCL.md`, `FDL.md`, `MACRO_LEDGER.md`, `RLL.md` | Global memory spine, navigation, and comparative ranking law | ✅ Live |
| `chooser/` | `FCL.md`, `TCL.md`, `RLL.md`, `CHOOSER_POLICY.md`, `MODULE_PROGRESS.md`, `NEXT_STEP.md`, `runs/` | Sylvia chooser loop, module gap state, next-step selection, and run receipts | ✅ Live |
| `canon/` | `FCL.md`, `TCL.md`, `RLL.md`, `JAKE_PERSONAL_ORACLE_FOUNDATION.md`, `JAKE_DEFERRED_REGISTRY.md` | Canonical oracle doctrine, deferred registry, and canon ranking | ✅ Live |
| `identity/` | `FCL.md`, `TCL.md`, `RLL.md`, `SYLVIA.md`, `NORTH_STAR.md`, `RELATION.md`, `ROADMAP.md`, `modules/` | Sylvia identity kernel, north-star doctrine, and identity ranking | ✅ Live |
| `.oraclestate/` | `FCL.md`, `TCL.md`, `tree_snapshot.json`, `event_log.jsonl` | Generated machine state | ✅ Live |
| `jake/` | `FCL.md`, `TCL.md`, `JAKE_INTERFACE.md`, `inbox/`, `active/`, `done/` | Jake-owned blocker lane and operator response surface | ✅ Live |
| `source/` | `FCL.md`, `TCL.md`, `RLL.md`, `JakeRL.txt` | Raw source material and source ranking baseline | ✅ Live |
| `analysis/` | `FCL.md`, `TCL.md`, `RLL.md`, `firsttry.txt` | Analysis artifacts and analysis ranking baseline | ✅ Live |
| `DAILY_BRIEFINGS/` | `FCL.md`, `TCL.md` | Daily sweep outputs | ✅ Live |
| `skills/` | `FCL.md`, `TCL.md`, `RLL.md`, skill subdirectories | Skills-first operating packages and skill ranking baseline | ✅ Live |
| `events/` | `FCL.md`, `TCL.md`, `inbox/`, `processed/`, `failed/` | Event spine | ✅ Live |
| `triggers/` | `FCL.md`, `TCL.md`, `TRIGGER_RULES.md` | Trigger grammar and safety rules | ✅ Live |
| `handoff/` | `FCL.md`, `TCL.md`, queue subdirectories | Agent collaboration bus | ✅ Live |
| `orchestrator/` | `FCL.md`, `TCL.md`, `RLL.md`, `index.html`, `styles.css`, `app.js` | Frontend control surface and UI ranking baseline | ✅ Live |
| `templates/` | `FCL.md`, `TCL.md` plus packet templates | Reusable packet shapes | ✅ Live |
| `scripts/` | `FCL.md`, `TCL.md`, script files, `lib/` | Automation and validation tendons | ✅ Live |
| `claude-code/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md`, 25 capability entries | Claude Code substrate capability library for Sylvia — hooks, memory, subagents, skills, teams | ✅ Live |

---

## Nested Operational Directories

| Directory | Ledgers | Purpose | Status |
|---|---|---|---|
| `events/inbox/` | `FCL.md`, `TCL.md` | New event packets awaiting routing | ✅ Live |
| `events/processed/` | `FCL.md`, `TCL.md` | Routed event receipts | ✅ Live |
| `events/failed/` | `FCL.md`, `TCL.md` | Failed event recovery | ✅ Live |
| `handoff/codex/` | `FCL.md`, `TCL.md` | Codex queue root | ✅ Live |
| `handoff/codex/inbox/` | `FCL.md`, `TCL.md` | New Codex work orders | ✅ Live |
| `handoff/codex/active/` | `FCL.md`, `TCL.md` | Codex active work | ✅ Live |
| `handoff/codex/done/` | `FCL.md`, `TCL.md` | Completed Codex work | ✅ Live |
| `handoff/claude-cowork/` | `FCL.md`, `TCL.md` | Claude Co-Work queue root | ✅ Live |
| `handoff/claude-cowork/inbox/` | `FCL.md`, `TCL.md` | New semantic work orders | ✅ Live |
| `handoff/claude-cowork/active/` | `FCL.md`, `TCL.md` | Claude Co-Work active work | ✅ Live |
| `handoff/claude-cowork/done/` | `FCL.md`, `TCL.md` | Completed semantic work | ✅ Live |
| `handoff/shared/` | `FCL.md`, `TCL.md` | Shared coordination root | ✅ Live |
| `handoff/shared/decisions/` | `FCL.md`, `TCL.md` | Shared decisions | ✅ Live |
| `handoff/shared/questions/` | `FCL.md`, `TCL.md` | Shared questions | ✅ Live |
| `handoff/shared/conflicts/` | `FCL.md`, `TCL.md` | Shared conflicts | ✅ Live |
| `identity/modules/` | `FCL.md`, `TCL.md` | Sylvia module doctrine package | ✅ Live |
| `chooser/runs/` | `FCL.md`, `TCL.md` | Append-only chooser and reflection receipts | ✅ Live |
| `jake/inbox/` | `FCL.md`, `TCL.md` | New Jake-needed requests | ✅ Live |
| `jake/active/` | `FCL.md`, `TCL.md` | Jake requests in progress | ✅ Live |
| `jake/done/` | `FCL.md`, `TCL.md` | Completed Jake requests | ✅ Live |
| `scripts/lib/` | `FCL.md`, `TCL.md` | Shared script helpers | ✅ Live |
| `skills/oracle-ledger-update/` | `FCL.md`, `TCL.md`, `SKILL.md` | Ledger maintenance skill | ✅ Live |
| `skills/codex-file-tree-orchestrator/` | `FCL.md`, `TCL.md`, `SKILL.md` | File tree orchestration skill | ✅ Live |
| `skills/codex-ledger-drift-repair/` | `FCL.md`, `TCL.md`, `SKILL.md` | Mechanical drift repair skill | ✅ Live |
| `skills/codex-event-packet-ops/` | `FCL.md`, `TCL.md`, `SKILL.md` | Event packet operations skill | ✅ Live |
| `skills/claude-cowork-semantic-triage/` | `FCL.md`, `TCL.md`, `SKILL.md` | Semantic triage skill | ✅ Live |
| `skills/claude-cowork-canon-evolution/` | `FCL.md`, `TCL.md`, `SKILL.md` | Canon evolution skill | ✅ Live |
| `skills/shared-skill-audit/` | `FCL.md`, `TCL.md`, `SKILL.md` | Skill audit skill | ✅ Live |
| `skills/shared-jake-roadblock-escalation/` | `FCL.md`, `TCL.md`, `SKILL.md` | Shared skill for routing Jake-specific blockers | ✅ Live |
| `skills/codex-sylvia-chooser/` | `FCL.md`, `TCL.md`, `SKILL.md` | Codex chooser skill for hourly Sylvia next-step selection | ✅ Live |
| `skills/codex-safe-worker/` | `FCL.md`, `TCL.md`, `SKILL.md` | Codex skill for safe autonomous local execution of approved packets | ✅ Live |
| `skills/shared-module-gap-audit/` | `FCL.md`, `TCL.md`, `SKILL.md` | Shared audit skill for module gap coverage and completion signals | ✅ Live |
| `skills/codex-dispatcher/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 dispatcher skill — queue detection, routing law, safe execution, ledger discipline | ✅ v1 |
| `skills/claude-cowork-slack-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — Slack signals → event packets (unanswered DMs, mentions, action opportunities) | ✅ v1 |
| `skills/claude-cowork-gcal-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — GCal events → event packets (commitments, deadlines, scheduling gaps) | ✅ v1 |
| `skills/claude-cowork-clickup-ingress/` | `FCL.md`, `TCL.md`, `SKILL.md` | Phase 3 ingress — ClickUp tasks → event packets (stalled, overdue, blocking, new) | ✅ v1 |

---

## Ledger Rules

| Layer | File Pattern | Scope |
|---|---|---|
| Global topology | `ledgers/FDL.md` | Whole workspace structure |
| Global navigation | `ledgers/MACRO_LEDGER.md` | Whole workspace status and entry points |
| Global continuity | `ledgers/TCL.md` | Cross-workspace event history |
| Global comparative ranking | `ledgers/RLL.md` | Whole workspace scoring basis and ranked corpus |
| Identity kernel | `identity/` | Sylvia doctrine, relation law, and roadmap |
| Local contents | `{dir}/FCL.md` | One directory’s inventory and purpose |
| Local continuity | `{dir}/TCL.md` | One directory’s history and changes |
| Local comparative ranking | `{dir}/RLL.md` | One directory’s relative priorities and winners |
