# TCL — Capabilities
### Jake Personal Oracle Project

> Temporal Continuity Ledger for the operational capabilities layer.
> Last updated: 2026-04-15

---

## Log

### 2026-04-15 ~01:34 EDT — Chooser tooling repaired after consolidation

**Action**: Reconciled the chooser-related scripts under `capabilities/scripts/` with the current consolidated workspace topology.

**Outcome**: Automation now targets the live collaboration queues and current capability paths.

### 2026-04-15 ~02:05 EDT — Capabilities directory created from consolidation

**Action**: Created `capabilities/` parent directory to group operational capability subdirectories. Moved `skills/`, `scripts/`, `templates/`, and `orchestrator/` into this parent.

**Context**: Jake requested directory consolidation. These four directories all provide executable capabilities (vs pure reasoning or memory).

**Files moved**:
- `skills/` → `capabilities/skills/`
- `scripts/` → `capabilities/scripts/`
- `templates/` → `capabilities/templates/`
- `orchestrator/` → `capabilities/orchestrator/`

**Files created**:
- `capabilities/FCLcp.md`
- `capabilities/TCLcp.md` (this file)

**Rationale**: All four directories provide ways for Sylvia to ACT:
- Skills = packaged autonomous capabilities
- Scripts = automation/validation
- Templates = reusable work patterns
- Orchestrator = UI for operator visibility/control

Grouping them clarifies that this is the "action layer" - what Sylvia can DO.

**Outcome**: Operational capabilities layer is now clearly delineated. The distinction between reasoning (chooser, identity) and action (capabilities) is clearer.

---

*Continuity note: Individual subdirectories retain their own FCL/TCL ledgers. This parent-level TCL tracks the consolidation event.*

### 2026-04-15 ~01:32 EDT — Script references aligned to consolidated capability paths

**Action**: Repaired safe-worker substrate paths that still referenced the old root-level `scripts/` and `handoff/` layout after the `capabilities/` and `collaboration/` consolidation.

**Outcome**: The Codex safe worker can once again scan the live Codex queue from `capabilities/scripts/` without path failure.
