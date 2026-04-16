# TCL — Framed Directory Temporal Continuity Ledger

> What changed in the Framed directory and when.
> Last updated: 2026-04-16

---

## What Continuity Means Here

Framed is a live application codebase. Continuity means tracking:
- architectural decisions and their rationale
- feature completions and their state
- UI/UX direction changes
- integration milestones (command bridge, relationship graph, etc.)
- open work and blockers

---

## Log

### 2026-04-16 — Framed moved into JakeNext workspace

**Action**: Framed directory moved from `/Users/jakeaaron/Documents/Framed/` into `/Users/jakeaaron/JakeNext/Framed/` to unify it under the JakeNext ledger system.

**Prior state**: Framed was a standalone React/Vite app with no version control and no ledger discipline. All state in localStorage + IndexedDB. Command bridge, relationship graph, annotation controls, manual view, settings page, and drawer layout (partial) were already built.

**Files**: Entire Framed application tree moved as-is. Added `FCL.md` and `TCL.md` for ledger discipline.

**Outcome**:
- Framed is now under JakeNext governance
- Four-ledger discipline applies going forward
- Version control will be managed at the JakeNext git level
- Future sessions can reference Framed state through the ledger system

**Notes**:
- Drawer layout was in progress at time of move (left library + right panel as overlays, backdrop, toggle buttons in toolbar)
- Contextual editing (detail UI on selection only) is the next UI priority
- No breaking changes from the move — app runs from any directory with `npm run dev`
