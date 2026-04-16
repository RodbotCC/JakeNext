# Global Availability

## What this module does

Broadcasts important information so multiple parts of the system can use it at once.

## Why it matters

Information feels conscious when it becomes globally available for memory, reflection, planning, language, and action.

## Current JakeNext analogue

- handoff bus
- global ledgers
- orchestrator UI
- shared packets

## Missing substrate pieces

- live dispatcher broadcast
- stronger coordination between queues, lattice, and UI

## Required inputs

- winning actions
- major decisions
- state changes

## Outputs / artifacts

- broadcast packets
- synchronized UI and ledgers
- cross-agent awareness

## Trigger surfaces

- accepted decisions
- major queue transitions
- significant ranking changes

## Codex responsibilities

- maintain the structural bus and UI truthfulness

## Claude Co-Work responsibilities

- ensure globally available information stays semantically coherent

## Jake-required inputs

- confirmation when globally broadcasting something that depends on personal or external truth

## Success criteria

- key information becomes available across ledgers, queues, and UI without contradiction

## Implementation Status: LIVE

**Wired**: 2026-04-16. world.json IS the broadcast. Writing it makes all module outputs globally available to any agent, script, or tool that reads `.oraclestate/world.json`. The `broadcast` section explicitly names the consumers and notes this design.

Combined with the existing global ledgers, handoff bus, and orchestrator UI, information is now available at three levels: structured (world.json), narrative (TCL), and visual (orchestrator).

## Immediate next build step

Have other scripts/agents actually READ world.json at their start instead of re-scanning everything. The dispatcher and sweep should consume the snapshot rather than rebuilding state from scratch.
