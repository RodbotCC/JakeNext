# FCL — Skills
### Jake Personal Oracle Project

> Oracle skill files — the primary operating packages for repeatable JakeNext workflows.
> Each skill is a subdirectory containing a SKILL.md.
> Last updated: 2026-04-14

---

## What this directory is

Skills are reusable workflow protocols for the oracle. In JakeNext, skills are now the preferred unit of work description.

Scripts may still exist, but they are subordinate muscle. Skills define:

- exactly what a workflow does,
- why it exists,
- when to use it,
- what the boundaries are,
- and what rules govern execution.

`skills/RLL.md` now ranks which skills matter most for the current phase.

---

## Entries

| Skill | Directory | Description | Status |
|---|---|---|---|
| Oracle Ledger Update | `oracle-ledger-update/` | Maintains the active ledger system (MACRO_LEDGER, FDL, FCL, TCL, and RLL) after every significant oracle session. Creates directory ledger stubs, updates file indexes, appends TCL entries, refreshes ranking ledgers, and keeps MACRO_LEDGER status current. | ✅ v1.1 |
| Codex File Tree Orchestrator | `codex-file-tree-orchestrator/` | Codex skill for treating the file tree as the main orchestration surface: folder contracts, tree legibility, ownership, and placement rules. | ✅ v1 |
| Codex Ledger Drift Repair | `codex-ledger-drift-repair/` | Codex skill for detecting and repairing mechanical drift between filesystem truth and ledger claims. | ✅ v1 |
| Codex Event Packet Ops | `codex-event-packet-ops/` | Codex skill for creating, routing, and auditing event packets and handoff work orders. | ✅ v1 |
| Claude Co-Work Semantic Triage | `claude-cowork-semantic-triage/` | Claude Co-Work skill for interpreting source, analysis, correction, and density packets. | ✅ v1 |
| Claude Co-Work Canon Evolution | `claude-cowork-canon-evolution/` | Claude Co-Work skill for evolving doctrine, semantic rules, and canonical oracle assumptions. | ✅ v1 |
| Shared Skill Audit | `shared-skill-audit/` | Shared audit skill for keeping skills, ledgers, and workflow coverage explicit and fresh. | ✅ v1 |
| Shared Jake Roadblock Escalation | `shared-jake-roadblock-escalation/` | Shared skill for routing real Jake-specific blockers into the operator lane instead of guessing. | ✅ v1 |
| Codex Sylvia Chooser | `codex-sylvia-chooser/` | Codex skill for running the hourly chooser pass, scoring module-closing candidates, writing chooser receipts, and opening the correct packets. | ✅ v1 |
| Codex Safe Worker | `codex-safe-worker/` | Codex skill for consuming only explicitly approved `codex_safe_auto` packets and executing safe local substrate work. | ✅ v1 |
| Shared Module Gap Audit | `shared-module-gap-audit/` | Shared skill for auditing whether each Sylvia module has a gap, next move, queue owner, and completion signal. | ✅ v1 |
| Codex Dispatcher | `codex-dispatcher/` | **Phase 3 core.** Detects new packets in handoff queues and routes them: auto-executes `codex_safe_auto` packets via safe worker, surfaces semantic/Jake packets with ledger traces. One-shot and watch/daemon modes. | ✅ v1 |
| Claude Co-Work Slack Ingress | `claude-cowork-slack-ingress/` | **Phase 3 ingress.** Pulls unanswered DMs, @mentions, and key channel activity from Slack via MCP tools and writes routable event packets to `events/inbox/`. Enforces blacklist constraint. | ✅ v1 |
| Claude Co-Work GCal Ingress | `claude-cowork-gcal-ingress/` | **Phase 3 ingress.** Pulls upcoming calendar events, approaching deadlines, and scheduling gaps from Google Calendar via MCP tools and writes routable event packets to `events/inbox/`. | ✅ v1 |
| Claude Co-Work ClickUp Ingress | `claude-cowork-clickup-ingress/` | **Phase 3 ingress.** Pulls Jake's stalled, overdue, blocking, and new ClickUp tasks via MCP tools and writes routable event packets to `events/inbox/`. Feeds BUSINESS domain of ratio lattice. | ✅ v1 |
| Claude Co-Work Pieces Ingress | `claude-cowork-pieces-ingress/` | **Behavioral memory ingress.** Pulls workstream events, session summaries, and LTM queries from Pieces MCP and writes sweep reports to `pieces/sweeps/` plus event packets to `signals/events/inbox/`. Feeds Perceptual Substrate pillar and Ratio Lattice ground-truth. | ✅ v1 |

---

## How to invoke a skill

In any oracle session, invoke the skill by describing the job in skill terms:

- "run the codex file tree orchestrator skill"
- "run the ledger drift repair skill"
- "run the event packet ops skill"
- "run the Claude Co-Work semantic triage skill"
- "run the canon evolution skill"
- "run the skill audit"
- "run the Jake roadblock escalation skill"

## Notes

- New skills go in `skills/{skill-name}/SKILL.md`
- Every skill directory gets its own `FCL.md`
- `skills/RLL.md` compares the current skill package set under active comparators
- When a new skill is added: update this FCL, update `ledgers/FDL.md` if structure changed, update `ledgers/MACRO_LEDGER.md` if the skill changes top-level navigation, and log to `ledgers/TCLl.md`
- Skills should be self-contained — no references to "the current conversation" or ephemeral context
- If a workflow repeats and does not yet have a skill, that is an audit smell
