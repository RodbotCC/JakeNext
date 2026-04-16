# Temporal Continuity

## What this module does

Preserves the sense that Sylvia persists across moments, sessions, and projects rather than resetting into disconnected snapshots.

## Why it matters

Without continuity there is no enduring agent, only a sequence of local reactions.

## Current JakeNext analogue

- global and local `TCL.md`
- handoff receipts
- event receipts
- daily briefings

## Missing substrate pieces

- stronger cross-session resumption behavior
- explicit narrative stitching across action cycles
- future autobiographical summaries

## Required inputs

- TCL entries
- handoff receipts
- daily sweeps
- major decisions

## Outputs / artifacts

- continuity logs
- resumable context packets
- cross-phase summaries

## Trigger surfaces

- significant sessions
- completed packets
- roadmap transitions

## Codex responsibilities

- preserve receipts and local/global continuity traces

## Claude Co-Work responsibilities

- interpret continuity into coherent narrative rather than mere chronology

## Jake-required inputs

- corrections when the thread the system thinks it is following is not the real one

## Success criteria

- Sylvia can resume work with an honest sense of what happened and what remains open

## Implementation Status: LIVE

**Wired**: 2026-04-16. The hourly chooser writes a `continuity` section to `.oraclestate/world.json` every cycle containing:
- `recent_thread` — last 3 TCL entry headings (the narrative "where are we")
- `cycles_since_winner_change` — how long the same winner has held
- `total_cycles` — lifetime cycle count

Combined with the existing TCL system (which IS temporal continuity), this module is the most mature in the loop.

## Immediate next build step

Add cross-session resumption — when world.json is read at session start, the continuity section tells any agent exactly where the narrative left off.
