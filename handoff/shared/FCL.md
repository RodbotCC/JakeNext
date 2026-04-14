# FCL — Handoff / Shared
### Jake Personal Oracle Project

> Shared coordination space for decisions, questions, and conflicts.
> Last updated: 2026-04-14

---

## Directories

| Directory | Purpose | Status |
|---|---|---|
| `decisions/` | Architecture or agent-boundary decisions that should become durable | ✅ Live |
| `questions/` | Questions for Jake or both agents | ✅ Live |
| `conflicts/` | Filesystem truth versus semantic canon or routing disagreements | ✅ Live |

---

## Rules

- Use shared space when routing is ambiguous.
- Shared decisions must be reflected in ledgers when accepted.
- Conflicts should not be silently resolved by whichever agent sees them first.

