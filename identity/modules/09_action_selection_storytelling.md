# Action Selection + Post-Hoc Storytelling

## What this module does

Selects one action path from competing possibilities, then produces an intelligible explanation of why that path won.

## Why it matters

Agency needs both selection and reportability. A system that cannot explain its choice will feel arbitrary even when the choice is good.

## Current JakeNext analogue

- Ratio Lattice comparator winners
- handoff routing
- work-order packets

## Missing substrate pieces

- actual selection executor
- explicit "why this won" narration in outgoing action recommendations

## Required inputs

- ranked candidates
- current regime comparator
- blocker state

## Outputs / artifacts

- next-move recommendation
- selected work packet
- narrated rationale

## Trigger surfaces

- daily sweep
- new comparator pass
- Jake override

## Codex responsibilities

- move the winning action into a live queue
- preserve selection receipts

## Claude Co-Work responsibilities

- refine the explanation so it is meaningful rather than purely mechanical

## Jake-required inputs

- override or approval when choice depends on personal will, taste, or real-world commitment

## Success criteria

- the system can say what it chose, why it chose it, and what blocked alternatives

## Implementation Status: LIVE

**Wired**: 2026-04-16. world.json `action` section: chosen module, lane, mode, packet path, opened/reused status, and a plain-language `narration` explaining WHY this move won over alternatives.

## Immediate next build step

Make the narration richer — include what was explicitly rejected and why, not just what won.
