# FCL — Chooser
### Jake Personal Oracle Project

> Sylvia chooser subsystem for module progress, next-step selection, and run receipts.
> Last updated: 2026-04-14

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `CHOOSER_POLICY.md` | Defines the Sylvia hourly chooser law and routing behavior | ✅ Live |
| `MODULE_PROGRESS.md` | Tracks module status, current gap, next move, and blocking lane across the ten Sylvia modules | ✅ Live |
| `NEXT_STEP.md` | In-place current winning move and its required queue packets | ✅ Live |
| `RLL.md` | Local Ratio Lattice Ledger for chooser artifacts and module gap priorities | ✅ Live |
| `FCL.md` | This file — chooser directory contents ledger | ✅ Live |
| `TCL.md` | Local continuity ledger for chooser evolution and runs | ✅ Live |
| `runs/` | Append-only chooser and reflection receipts | ✅ Live |

---

## Notes

- `chooser/` is the first decision engine surface, not a generic backlog folder.
- The chooser optimizes for module progress first and practical ease second.
- It may open Codex, Claude Co-Work, or Jake packets, but only the Codex-safe worker is allowed to execute autonomously in v1.
