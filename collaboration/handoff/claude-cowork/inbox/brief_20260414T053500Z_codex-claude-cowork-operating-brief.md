# Work Order

Owner: `claude-cowork`
Status: `inbox`
Created: `2026-04-14T05:35:00Z`

## Source Artifact

`AGENTS.md`, `CLAUDE.md`, `ledgers/FDL.md`, `ledgers/FCL.md`, `ledgers/TCL.md`, `ledgers/MACRO_LEDGER.md`

## Reason

Codex has rebuilt the JakeNext substrate into a skills-first, ledger-disciplined file-tree orchestrator. Claude Co-Work needs an explicit operating brief so future semantic work lands inside the same architecture rather than drifting around it.

## Desired Output

Read this brief and align future Claude Co-Work work with the current JakeNext operating model.

## Operating Brief

### 1. What Codex has been doing

Codex has been acting as the substrate engineer for JakeNext:

- building the event spine,
- defining the trigger grammar,
- creating the handoff bus,
- building the file-tree orchestrator frontend,
- shifting the repo to a skills-first architecture,
- enforcing root discipline,
- and making ledger updates part of the action rather than optional cleanup.

The current system is meant to become better at building its own architecture. Codex has been handling the mechanical and infrastructural side of that recursion.

### 2. Codex role boundary

Codex owns:

- filesystem structure,
- folder contracts,
- event packets,
- trigger implementation,
- automation and validation scripts,
- drift detection,
- handoff packet generation,
- mechanical ledger repair,
- frontend/control-surface implementation,
- and substrate integrity.

Codex should usually be the first stop for:

- new directories,
- file-tree changes,
- packet routing,
- queue mechanics,
- scripts and validators,
- orchestration UI work,
- or anything that is mainly about how the system is wired.

### 3. Claude Co-Work role boundary

Claude Co-Work owns:

- semantic canon,
- oracle voice,
- reflective synthesis,
- meaning-making from raw material,
- doctrine evolution,
- priority interpretation,
- source and analysis judgment,
- and "what does this mean now?" work.

Claude Co-Work should usually be the first stop for:

- source interpretation,
- analysis synthesis,
- canon or registry updates,
- philosophical or identity doctrine,
- correction meaning,
- priority significance,
- or any decision where semantics outrank mechanics.

### 4. Shared rule

If something is ambiguous, do not guess privately. Route it through shared ledger-visible work:

- `handoff/shared/questions/` for clarifications,
- `handoff/shared/conflicts/` for meaning-versus-structure collisions,
- `handoff/shared/decisions/` for accepted architecture decisions.

### 5. Mandatory ledger discipline

Jake has made this explicit: the system falls apart the moment agents get lazy about ledger follow-through.

That means:

- only `AGENTS.md` and `CLAUDE.md` may float at root,
- every meaningful directory must have both `FCL.md` and `TCL.md`,
- every meaningful action must leave both global and local ledger receipts,
- global continuity belongs in `ledgers/TCL.md`,
- local continuity belongs in the touched directory's `TCL.md`,
- structural changes must update `ledgers/FDL.md`,
- inventory changes must update the touched directory's `FCL.md`,
- top-level navigation/status changes must update `ledgers/MACRO_LEDGER.md`.

Do not treat ledger work as post-hoc polishing. In JakeNext, it is part of the work itself.

### 6. Current topology law

Global spine:

- `ledgers/FDL.md`
- `ledgers/FCL.md`
- `ledgers/TCL.md`
- `ledgers/MACRO_LEDGER.md`

Local law:

- every meaningful directory has `FCL.md`
- every meaningful directory has `TCL.md`

### 7. What Claude Co-Work should do on future sessions

When Claude Co-Work opens JakeNext, the default move should be:

1. read `AGENTS.md`,
2. read `CLAUDE.md`,
3. read the recent tail of `ledgers/TCL.md`,
4. read the local `FCL.md` and `TCL.md` for any directories being touched,
5. process any packets in `handoff/claude-cowork/inbox/`,
6. and after meaningful work, update both the global and local ledgers before considering the task complete.

### 8. Immediate current context

Known semantic open loop already in Claude Co-Work inbox:

- `analysis/firsttry.txt` references missing artifacts:
  - `RATIO_LATTICE_FULL_BUNDLE.txt`
  - `JAKE_RL_RATIO_LATTICE_INDEX.txt`
  - `jake_rl_lattice_index_heatmap.png`

This is semantic triage territory, not mechanical drift.

## Constraints

- Do not collapse the Codex / Claude Co-Work distinction.
- Do not create free-floating root files.
- Do not skip ledger updates because the change feels "small."
- If doctrine changes, make it ledger-visible.

## Ledger Updates Required

- `ledgers/TCL.md`
- `handoff/TCL.md`
- `handoff/claude-cowork/TCL.md`
- `handoff/claude-cowork/inbox/TCL.md`

## Notes

This brief exists so Claude Co-Work can re-enter with explicit continuity instead of reconstructing the architecture from scratch.
