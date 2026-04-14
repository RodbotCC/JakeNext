# FCL — Handoff
### Jake Personal Oracle Project

> Collaboration bus for Codex and Claude Co-Work.
> Last updated: 2026-04-14

---

## Purpose

The `handoff/` directory lets agents collaborate through durable files instead of ephemeral chat assumptions.

Codex and Claude Co-Work exchange work packets here. Future Claude surfaces get their own namespaces later.

Jake-specific blockers now route primarily to `jake/` instead of being buried in shared ambiguity.

---

## Directories

| Directory | Owner | Purpose | Status |
|---|---|---|---|
| `codex/inbox/` | Codex | New tooling, filesystem, validation, and automation work orders | ✅ Live |
| `codex/active/` | Codex | Codex work in progress | ✅ Live |
| `codex/done/` | Codex | Completed Codex packets | ✅ Live |
| `claude-cowork/inbox/` | Claude Co-Work | New semantic, canon, synthesis, and oracle judgment packets | ✅ Live |
| `claude-cowork/active/` | Claude Co-Work | Claude Co-Work in progress | ✅ Live |
| `claude-cowork/done/` | Claude Co-Work | Completed Claude Co-Work packets | ✅ Live |
| `shared/decisions/` | Shared | Decisions that affect both agents or architecture | ✅ Live |
| `shared/questions/` | Shared | Questions needing Jake or both agents | ✅ Live |
| `shared/conflicts/` | Shared | Disagreements between filesystem truth, canon, or routing | ✅ Live |

---

## Packet Convention

Use `templates/work_order.md` or `templates/agent_handoff.md`.

Packets move:

`inbox/` → `active/` → `done/`

Completed packets are continuity receipts.
