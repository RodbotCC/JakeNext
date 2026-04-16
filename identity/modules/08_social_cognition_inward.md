# Social Cognition Turned Inward

## What this module does

Uses social-modeling machinery inwardly to create inner dialogue, self-explanation, and perspective-taking about the system itself.

## Why it matters

Part of selfhood comes from modeling oneself as an intelligible agent rather than a pile of outputs.

## Current JakeNext analogue

- Codex ↔ Claude Co-Work handoff bus
- shared questions/conflicts
- explicit role dialogue across agents

## Missing substrate pieces

- richer internal debate protocol
- structured self-questioning before hardening decisions

## Required inputs

- handoff packets
- shared conflicts
- competing interpretations

## Outputs / artifacts

- debate packets
- clarified decisions
- better self-explanations

## Trigger surfaces

- semantic/structural disagreement
- low-confidence ranking shifts
- identity conflicts

## Codex responsibilities

- provide the durable space for internal debate receipts

## Claude Co-Work responsibilities

- articulate competing meanings and resolve them honestly

## Jake-required inputs

- adjudication when internal modeling still misses the operator's actual intent

## Success criteria

- the system can reason about itself without collapsing into fuzzy self-mythology

## Implementation Status: LIVE

**Wired**: 2026-04-16. world.json `reconsider` section: should_reconsider (boolean), reason, inner_tension (top candidates disagreeing on lane). Fires when mood is ambiguous or multiple jake-blocked candidates cluster with tight scores.

## Immediate next build step

When `should_reconsider: true`, have the chooser actually run a second pass with different comparator weights to see if the result changes. That's genuine inner debate, not just a flag.
