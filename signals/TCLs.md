# TCL — Signals
### Jake Personal Oracle Project

> Temporal Continuity Ledger for the signals processing layer.
> Last updated: 2026-04-15

---

## Log

### 2026-04-15 ~02:05 EDT — Signals directory created from consolidation

**Action**: Created `signals/` parent directory to group signal processing subdirectories. Moved `events/`, `triggers/`, and `DAILY_BRIEFINGS/` (renamed to `briefings/`) into this parent.

**Context**: Jake requested directory consolidation to reduce root-level clutter from 16 directories to ~10. Grouped related subdirectories under parent directories without flattening structure.

**Files moved**:
- `events/` → `signals/events/`
- `triggers/` → `signals/triggers/`
- `DAILY_BRIEFINGS/` → `signals/briefings/`

**Files created**:
- `signals/FCLs.md`
- `signals/TCLs.md` (this file)

**Rationale**: Signal processing (ingress, routing, output) is a cohesive functional layer. Grouping these three directories makes the system architecture more legible.

**Outcome**: Signal processing layer is now clearly delineated. Root directory is cleaner. Signal flow is easier to understand.

---

*Continuity note: Individual subdirectories retain their own FCL/TCL ledgers. This parent-level TCL tracks the consolidation event.*
