# FCL — Global Root Ledger
### Jake Personal Oracle Project

> Global contents ledger for the workspace root and top-level directory surfaces.
> Last updated: 2026-04-16

---

## Root Files

| File | Purpose | Status |
|---|---|---|
| `AGENTS.md` | Agent boundary contract and Codex/Claude Co-Work operating split | ✅ Live |
| `CLAUDE.md` | Repository governance and global workspace rules | ✅ Live |

---

## Top-Level Directories

### Core System (9 directories)

| Directory | Primary Ledgers | Purpose | Status |
|---|---|---|---|
| `ledgers/` | `FDL.md`, `FCL.md`, `TCL.md`, `MACRO_LEDGER.md`, `RLL.md`, `NSL.md`, `MACRO_RLL.md` | Global memory spine, navigation control, ratio lattice baseline, north star ledger, and macro lattice spec | ✅ Live |
| `chooser/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Sylvia chooser subsystem, module progress, next-step winner, and run receipts | ✅ Live |
| `canon/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Canonical doctrine, deferred registry, system state report | ✅ Live |
| `identity/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Sylvia identity kernel — personality, decision laws, affective substrate, relation boundaries | ✅ Live |
| `northstar/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | North star goals, breakthrough pillars, roadmap, convergence targets | ✅ Live |
| `.oraclestate/` | `FCL.md`, `TCL.md` | Generated machine state and event logs | ✅ Live |
| `signals/` | `FCL.md`, `TCL.md` | **PARENT** — Signal processing (events, triggers, briefings) | ✅ Live |
| `collaboration/` | `FCL.md`, `TCL.md` | **PARENT** — Multi-agent coordination (handoff, jake) | ✅ Live |
| `capabilities/` | `FCL.md`, `TCL.md` | **PARENT** — Operational capabilities (skills, scripts, templates, orchestrator) | ✅ Live |

### Integration (1 directory)

| Directory | Primary Ledgers | Purpose | Status |
|---|---|---|---|
| `pieces/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Pieces behavioral memory integration — sweep outputs, pattern promotion, oracle training signal | ✅ Live |

### Breakthrough Research (1 directory)

| Directory | Primary Ledgers | Purpose | Status |
|---|---|---|---|
| `breakthrough/` | `FCL.md`, `TCL.md`, `RLL.md`, `NSL.md` | Theoretical frameworks (ONAL, delta physics) — confident but not yet bedrock | ✅ Live |

### Product (1 directory)

| Directory | Primary Ledgers | Purpose | Status |
|---|---|---|---|
| `Framed/` | `FCL.md`, `TCL.md` | Visual operating-manual system — React/Vite app | ✅ Live |

### Reference / Temporary

| Directory | Purpose | Status |
|---|---|---|
| `knowledge/` | **TEMPORARY** — Raw materials (source/) and outputs (analysis/); pending deprecation | ⚠️ Review needed |
| `claude-code NO NEED FOR LEDGER SUPPORT/` | **REFERENCE ONLY** — Claude Code capability index; pending deletion | 📚 Temporary |
| `claude-memory/` | **SYMLINK / READ-ONLY** — Points to Claude Code auto-memory; orientation only | 🔗 Read-only |

---

## Global Rule

The workspace root should contain only:

- `AGENTS.md`
- `CLAUDE.md`

Everything else belongs inside a directory with both:

- `FCL.md`
- `TCL.md`
