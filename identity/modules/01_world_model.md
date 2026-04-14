# World Model

## What this module does

Maintains a unified, continuously updated representation of what is happening now by binding multiple information streams into one coherent scene.

## Why it matters

Without a world model there is data, but no present-tense reality. Consciousness needs a shared scene, not disconnected sensor fragments.

## Current JakeNext analogue

- `events/` as change receipts
- `orchestrator/` as visible system scene
- `ledgers/FDL.md` + `ledgers/FCL.md` as structural world-state map

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

## Immediate next build step

Define a first real world-state packet shape that the dispatcher and orchestrator can both read.
