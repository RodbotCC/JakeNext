# FCL — codex-dispatcher skill
### Jake Personal Oracle Project

> Dispatcher skill — detects queue packets and routes them to execution.
> Last updated: 2026-04-14

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `SKILL.md` | Dispatcher skill definition: what it does, routing law, modes, safety invariants, ledger discipline | ✅ v1 |
| `FCL.md` | This file — contents ledger for the codex-dispatcher skill directory | ✅ Live |
| `TCL.md` | Local continuity ledger for this skill | ✅ Live |

---

## Skill summary

The dispatcher is the Phase 3 core: it bridges packet arrival to execution. It supports one-shot and watch/daemon modes, enforces routing law, and leaves durable ledger traces for every action it takes.
