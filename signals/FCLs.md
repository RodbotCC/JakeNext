# FCL — Signals
### Jake Personal Oracle Project

> File Contents Ledger for the signals processing layer.
> Last updated: 2026-04-15

---

## Purpose

This directory contains all **signal ingress, processing, and output** for Sylvia's oracle system.

Signals flow through three stages:
1. **events/** - raw event packets from external sources (Slack, GCal, ClickUp) awaiting routing
2. **triggers/** - event routing rules and trigger grammar
3. **briefings/** - periodic synthesized outputs (daily sweeps)

---

## Subdirectories

| Directory | Ledgers | Purpose | Status |
|-----------|---------|---------|--------|
| `events/` | FCL, TCL | Event packet lifecycle (inbox → processed/failed) | ✅ Live |
| `triggers/` | FCL, TCL | Trigger grammar and safety rules | ✅ Live |
| `briefings/` | FCL, TCL | Daily sweep outputs (formerly DAILY_BRIEFINGS/) | ✅ Live |

---

## Signal Flow

```
External sources (Slack, GCal, ClickUp)
    ↓
events/inbox/ (raw packets)
    ↓
triggers/ (routing rules)
    ↓
events/processed/ (routed work)
    ↓
briefings/ (periodic synthesis)
```

---

*This directory exists to make Sylvia externally aware through structured signal processing.*
