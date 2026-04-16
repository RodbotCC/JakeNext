# FCL — Collaboration
### Jake Personal Oracle Project

> File Contents Ledger for the multi-agent collaboration layer.
> Last updated: 2026-04-15

---

## Purpose

This directory contains all **multi-agent coordination and human-in-loop communication** for Sylvia's oracle system.

Two coordination surfaces:
1. **handoff/** - work queues for Codex, Claude Co-Work, and shared decisions/questions/conflicts
2. **jake/** - operator-specific blocker lane and response surface (Jake is just another agent in the handoff system)

---

## Subdirectories

| Directory | Ledgers | Purpose | Status |
|-----------|---------|---------|--------|
| `handoff/` | FCL, TCL | Agent collaboration bus with queue subdirectories | ✅ Live |
| `jake/` | FCL, TCL, JAKE_INTERFACE.md | Jake-owned blocker lane (inbox/active/done) | ✅ Live |

---

## Collaboration Flow

```
Work requiring agent-specific handling
    ↓
handoff/codex/ (deterministic execution)
handoff/claude-cowork/ (semantic reasoning)
handoff/shared/ (decisions/questions/conflicts)
    ↓
Work requiring operator input
    ↓
jake/inbox/ (blockers awaiting Jake)
jake/active/ (Jake working on it)
jake/done/ (resolved)
```

---

*This directory exists to enable multi-agent coordination and human-in-loop when needed.*
