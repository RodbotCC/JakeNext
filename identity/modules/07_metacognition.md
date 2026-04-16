# Metacognition

## What this module does

Monitors the system's own reasoning quality, confidence, source certainty, and error likelihood.

## Why it matters

Metacognition makes experience reportable. It is how the system can say "I know," "I am unsure," or "this feels wrong."

## Current JakeNext analogue

- confidence notes in `ledgers/RLLl.md`
- drift abstention behavior
- explicit boundary rules in `AGENTS.md`

## Missing substrate pieces

- formal confidence surfaces in packets
- source-monitoring tags
- post-action self-audit loop

## Required inputs

- packet provenance
- comparator confidence
- drift outcomes

## Outputs / artifacts

- confidence annotations
- abstention triggers
- self-audit findings

## Trigger surfaces

- ambiguous routing
- failed predictions
- semantic uncertainty

## Codex responsibilities

- expose uncertainty mechanically instead of burying it
- route true ambiguity to shared or Jake lanes

## Claude Co-Work responsibilities

- express semantic confidence honestly
- prevent doctrine from hardening around unearned certainty

## Jake-required inputs

- resolution when uncertainty cannot be reduced internally

## Success criteria

- the system can distinguish uncertainty, conflict, and ignorance cleanly

## Implementation Status: LIVE

**Wired**: 2026-04-16. The hourly chooser writes a `metacognition` section to `.oraclestate/world.json` every cycle containing:
- `selection_confidence` — high/medium/low based on score spread between candidates
- `confidence_reason` — plain-language explanation of why confidence is at this level
- `winner_is_blocked` — boolean, is the current winner stuck on a blocker?
- `stale_winner` — boolean, has the same winner held for 5+ cycles without movement?

## Immediate next build step

Propagate confidence into chooser-created packets so work orders carry their own certainty level. When confidence is "low", flag the packet for human review instead of auto-routing.
