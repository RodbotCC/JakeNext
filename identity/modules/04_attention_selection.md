# Attention as Selection

## What this module does

Selects which part of the current scene becomes foregrounded for deeper processing and action.

## Why it matters

Attention creates ownership and coherence by making some content vivid enough to matter while other content stays background.

## Current JakeNext analogue

- `ledgers/RLLl.md`
- local `RLL.md` files
- current comparator-driven ranking

## Missing substrate pieces

- explicit active-focus object
- coupling between comparator winners and actual action dispatch

## Required inputs

- current lattice rankings
- queue state
- trigger outputs

## Outputs / artifacts

- selected next-focus object
- chosen comparator context
- promoted active packets

## Trigger surfaces

- new ranking passes
- daily sweep
- Jake correction

## Codex responsibilities

- maintain ranking structure and queue transitions
- surface attention candidates in the orchestrator

## Claude Co-Work responsibilities

- decide when foreground meaning should override mechanical ranking

## Jake-required inputs

- selection corrections when the wrong thing feels foregrounded

## Success criteria

- the system can point to one active focus and explain why it won

## Immediate next build step

Use `sylvia_emergence` and `action_now` together to produce the first real focus recommendation.
