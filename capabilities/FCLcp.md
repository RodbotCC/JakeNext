# FCL — Capabilities
### Jake Personal Oracle Project

> File Contents Ledger for the operational capabilities layer.
> Last updated: 2026-04-15

---

## Purpose

This directory contains all **executable capabilities** that Sylvia can use to act in the world.

Four capability types:
1. **skills/** - packaged autonomous capabilities (SKILL.md format)
2. **scripts/** - automation and validation tendons
3. **templates/** - reusable packet shapes
4. **orchestrator/** - UI control surface (static frontend)

---

## Subdirectories

| Directory | Ledgers | Purpose | Status |
|-----------|---------|---------|--------|
| `skills/` | FCL, TCL, RLL | Skills-first operating packages | ✅ Live (15 skills) |
| `scripts/` | FCL, TCL | Automation and validation tendons | ✅ Live |
| `templates/` | FCL, TCL | Reusable packet templates | ✅ Live |
| `orchestrator/` | FCL, TCL, RLL | Frontend control surface and UI ranking baseline | ✅ Live |

---

## Capability Flow

```
Decision selected (from chooser/)
    ↓
Requires capability (skill, script, or template)
    ↓
Execute via appropriate capability
    ↓
Update orchestrator UI
    ↓
Log to ledgers
```

---

*This directory exists to give Sylvia executable capabilities beyond pure reasoning.*
