# FCL — Pieces Behavioral Memory
### JakeNext Oracle Project

> Contents ledger for the Pieces integration directory.
> Last updated: 2026-04-16

---

## Purpose

`pieces/` is the behavioral memory substrate for the oracle. It houses sweep outputs, promoted patterns, and governance docs for the Pieces MCP integration — a background service that tracks everything Jake does (clipboard, screenshots, audio, app context).

This is not just another ingress source. It is a persistent behavioral learning layer that captures *how Jake actually works*.

---

## Contents

| File | Purpose | Status |
|------|---------|--------|
| `FCL.md` | This file — contents ledger | Live |
| `TCL.md` | Continuity ledger | Live |
| `RLL.md` | Ranking of Pieces tools by signal value | Live |
| `NSL.md` | North star alignment | Live |
| `SWEEP_POLICY.md` | Governance: cadence, tool tiers, output format, retention | Live |

## Subdirectories

| Directory | Purpose | Status |
|-----------|---------|--------|
| `sweeps/` | Dated sweep output files from Pieces ingress | Live |
| `patterns/` | Promoted durable behavioral patterns (3+ sweep confirmations) | Live |

---

## Conventions

- Sweep files: `sweeps/sweep_YYYY-MM-DD_HH-MM.md`
- Pattern files: `patterns/pattern_{slug}.md`
- All sweep outputs are ephemeral (30-day retention)
- Pattern files are permanent
- Event packets from sweeps go to `signals/events/inbox/`, not here
