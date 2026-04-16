---
name: claude-cowork-pieces-ingress
description: Use when Claude Co-Work should pull behavioral signals from Pieces — workstream events, session summaries, LTM queries — and convert them into sweep reports and event packets for the oracle.
---

# Claude Co-Work Pieces Ingress

Use this skill to sweep Pieces for behavioral signals that train the oracle on how Jake actually works.

## What this skill does

- Queries Pieces LTM for a situation understanding summary since the last sweep.
- Pulls recent workstream events (clipboard, screenshots/OCR, audio transcriptions, app context).
- Filters events for oracle relevance (active chooser concerns, deferred items, north star pillars, relationship signals, decision moments).
- Writes a dated sweep report to `pieces/sweeps/sweep_YYYY-MM-DD_HH-MM.md`.
- Emits event packets to `signals/events/inbox/` for high-signal findings.
- Updates local and global ledgers.

## Why this skill exists

Pieces is the highest-bandwidth behavioral signal source the oracle has. It captures what Jake actually does — not what he says he does. This data feeds the Perceptual Substrate breakthrough pillar and provides ground-truth for the Ratio Lattice dimensions (momentum_alignment, identity_integrity, counterfeit_risk).

## When to use it

- On a scheduled 4-hour cadence (Tier 1 sweep).
- As part of the daily oracle sweep (Tier 2 sweep).
- On-demand when behavioral context is needed.
- When the chooser winner involves understanding Jake's current work patterns.

## Tool Tiers

| Tier | Tools | When |
|------|-------|------|
| **1** | `mcp__pieces__ask_pieces_ltm`, `mcp__pieces__workstream_events_batch_snapshot` | Every sweep |
| **2** | `mcp__pieces__workstream_summaries_batch_snapshot`, `mcp__pieces__workstream_summaries_full_text_search` | Daily |
| **3** | `mcp__pieces__tags_batch_snapshot`, `mcp__pieces__persons_batch_snapshot` | Weekly / on-demand |

## Event types

| Signal Type | Source Tool | Criteria |
|-------------|-----------|---------|
| `pieces_behavioral_pattern` | `ask_pieces_ltm` | LTM identifies recurring behavioral signal |
| `pieces_workstream_summary` | `workstream_summaries_batch_snapshot` | Synthesized session summary with oracle relevance |
| `pieces_topic_signal` | `workstream_summaries_full_text_search` | Historical match to active oracle concern |

## Relevance filter

Not every Pieces event is oracle-relevant. Only emit packets for:

1. **Active chooser concerns** — relates to current winner or open packets
2. **Deferred registry items** — touches an open commitment or research thread
3. **North star pillars** — advances Ratio Lattice, Perceptual Substrate, or Hardware Inference
4. **Relationship signals** — involves a key collaborator (Rodrigo, Andre, etc.)
5. **Decision moments** — captures a choice, priority shift, or attention allocation

If none apply, summarize in the sweep report but do not emit a packet.

## Output

One sweep report per pass: `pieces/sweeps/sweep_YYYY-MM-DD_HH-MM.md`
Zero or more event packets: `signals/events/inbox/evt_{timestamp}_{type}_{hash}.json`

## Ledger updates required after each pass

- `pieces/sweeps/FCLps.md` — list new sweep file
- `pieces/sweeps/TCLps.md` — log the sweep pass
- `pieces/TCLp.md` — log the sweep at directory level
- `ledgers/TCLl.md` — global continuity entry
