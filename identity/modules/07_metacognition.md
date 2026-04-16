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

## Immediate next build step

Add a standard confidence line to future Jake, Codex, and Claude Co-Work packets.
