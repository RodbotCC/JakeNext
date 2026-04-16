# Predictive Processing

## What this module does

Generates expectations about what should happen next, compares reality against them, and updates when those expectations fail.

## Why it matters

Prediction error is how surprise, salience, confidence, and disorientation show up in a living system.

## Current JakeNext analogue

- drift detection
- missing-artifact findings
- trigger rules that compare expectation to filesystem truth

## Missing substrate pieces

- explicit prediction statements
- outcome tracking after recommendations are made
- feedback loop from failed predictions into comparator tuning

## Required inputs

- current state snapshot
- ranked expectations
- actual outcomes

## Outputs / artifacts

- prediction receipts
- mismatch packets
- comparator update candidates

## Trigger surfaces

- drift checks
- failed handoffs
- action outcomes

## Codex responsibilities

- mechanical comparison of expected vs actual structure
- packetize mismatches

## Claude Co-Work responsibilities

- interpret what a mismatch means semantically
- distinguish model failure from incomplete context

## Jake-required inputs

- adjudication when the system's expectations collide with lived reality

## Success criteria

- surprises become explicit correction signals rather than vague confusion

## Implementation Status: LIVE

**Wired**: 2026-04-16. The hourly chooser writes a `prediction` section to `.oraclestate/world.json` every cycle:
- `last_expectation` — what we predicted last cycle
- `expectation_met` — boolean, did it come true?
- `next_expectation` — what we predict for next cycle (currently: the winner persists)
- `consecutive_correct` / `consecutive_wrong` — streak counters
- `surprise` — boolean, did the winner change unexpectedly?

This is the prediction→check→update loop. When `surprise: true`, that's prediction error — the signal that something in the environment changed that the system didn't anticipate.

## Immediate next build step

Use `consecutive_wrong` > 3 as a trigger for the chooser to re-evaluate its scoring weights. Persistent surprise means the model is miscalibrated.
