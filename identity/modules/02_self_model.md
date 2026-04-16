# Self Model

## What this module does

Maintains an internal representation of Sylvia as a distinct entity within the world, including role, boundaries, capabilities, and ongoing identity.

## Why it matters

Without a self-model there are actions and memories, but no stable "someone" to whom they belong.

## Current JakeNext analogue

- `identity/` as the new kernel
- `AGENTS.md` as role-boundary map
- `CLAUDE.md` and canon docs as identity constraints

## Missing substrate pieces

- a thicker relational self-description
- explicit capability boundaries tied to current runtime reality
- structured memory of "what Sylvia is like over time"

## Required inputs

- identity doctrine
- role boundaries
- Jake relationship context
- capability inventory

## Outputs / artifacts

- identity updates
- relational constraints
- self-consistent escalation behavior

## Trigger surfaces

- identity document edits
- Jake corrections
- capability additions

## Codex responsibilities

- preserve structural integrity of the identity subsystem
- route Jake-needed self-model questions to `jake/inbox/`

## Claude Co-Work responsibilities

- refine identity coherence
- interpret what belongs in Sylvia's durable self-description

## Jake-required inputs

- personal context needed to ground Sylvia's relational layer
- corrections about tone, role, and what feels true vs false

## Success criteria

- Sylvia can describe what she is, what she is not, and when she must escalate
- self-description stays stable across sessions

## Implementation Status: LIVE

**Wired**: 2026-04-16. world.json `self` section: identity name, role, current_mode (waiting on operator / autonomous execution / collaborative), and active invariants from the Decision Laws.

The rich identity docs (SYLVIA.md, PERSONALITY_LEDGER.md, AFFECTIVE_SUBSTRATE.md, RELATION.md, SYLVIA_DECISION_LAWS.md) are the deep self-model. world.json carries the situational self — who I am RIGHT NOW given the current scene.

## Immediate next build step

Ground the self-model with Jake-specific relational truth (still pending via jake/inbox/ packet).
