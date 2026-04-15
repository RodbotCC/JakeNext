# TCL — Knowledge
### Jake Personal Oracle Project

> Temporal Continuity Ledger for the knowledge corpus layer.
> Last updated: 2026-04-15

---

## Log

### 2026-04-15 ~02:05 EDT — Knowledge directory created from consolidation (TEMPORARY)

**Action**: Created `knowledge/` parent directory to group knowledge corpus subdirectories. Moved `source/` and `analysis/` into this parent.

**Context**: Jake requested directory consolidation. Source and analysis are both knowledge-related but their distinction is unclear.

**Files moved**:
- `source/` → `knowledge/source/`
- `analysis/` → `knowledge/analysis/`

**Files created**:
- `knowledge/FCL.md`
- `knowledge/TCL.md` (this file)

**Rationale**: Both directories hold text-based knowledge artifacts. Grouping them temporarily while we determine:
1. Whether they're redundant (merge into one?)
2. Whether they should live in canon/ instead
3. Whether they're legacy storage that can be archived

**Status**: ⚠️ **TEMPORARY LAYER** - likely to be deprecated or reorganized.

**Outcome**: Knowledge layer is isolated for review. This consolidation makes it easier to audit whether these directories earn their keep.

---

*Continuity note: This parent directory is explicitly temporary. Future sessions should revisit whether source/ and analysis/ are actually useful or just legacy clutter.*
