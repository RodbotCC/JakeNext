# World Model

## What this module does

Maintains a unified, continuously updated representation of what is happening now by binding multiple information streams into one coherent scene.

## Why it matters

Without a world model there is data, but no present-tense reality. Consciousness needs a shared scene, not disconnected sensor fragments.

## Current JakeNext analogue

- `events/` as change receipts
- `orchestrator/` as visible system scene
- `ledgers/FDL.md` + `ledgers/FCLl.md` as structural world-state map

## Missing substrate pieces

- live ingestion from more than filesystem changes
- world-state synthesis across events, source, handoff, and Jake inputs
- explicit scene object for "what is happening now"

## Required inputs

- filesystem events
- queue state
- active ledgers
- future external signals

## Outputs / artifacts

- bounded world-state summaries
- active-scene packets
- updated orchestrator state

## Trigger surfaces

- `file_created`
- `file_edited`
- `file_moved`
- sweep cycles

## Codex responsibilities

- event capture
- scene-support structure
- state normalization

## Claude Co-Work responsibilities

- semantic interpretation of what the bound scene means
- identify which scene elements deserve canon or synthesis

## Jake-required inputs

- corrections when the system mistakes what is actually going on
- priority context when external reality outruns the current signals

## Success criteria

- the system can state the current operational scene without guessing
- multiple sources bind into one coherent "now"

## Implementation Status: LIVE

**Wired**: 2026-04-16. The hourly chooser now persists `.oraclestate/world.json` after every cycle — a unified scene snapshot containing the current winner, module summary, top 3 candidates, queue pressure signals, previous winner comparison, and a delta section tracking what changed since last cycle.

**How it works**: The chooser already reads 7 sources (MACRO_LEDGER, TCL, RLL, identity, MODULE_PROGRESS, handoff, jake). After scoring and selecting, it now writes the bound scene to `world.json`. Every other module can read this single file instead of re-scanning everything.

**Delta principle**: Each cycle compares against the previous `world.json` and produces `delta.winner_changed`, `delta.mood_changed`, and `delta.new_modules_since_last`. Downstream modules only need to process what changed.

## Immediate next build step

Enrich `world.json` with Pieces behavioral context (what Jake is actually doing) and queue packet counts per lane.
