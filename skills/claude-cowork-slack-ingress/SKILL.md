---
name: claude-cowork-slack-ingress
description: Use when Claude Co-Work should pull live Slack signals — unanswered DMs, direct mentions, key channel activity — and convert them into event packets in events/inbox/ for routing by the dispatcher.
---

# Claude Co-Work Slack Ingress

Use this skill to sweep Slack for signals that matter to Jake and write them as routable oracle events.

## What this skill does

- Searches for unanswered DMs sent to Jake since the last ingress pass.
- Searches for direct @mentions of Jake across channels.
- Reads key channels: #ai-topics (team-facing AI discussion), any channel where Jake's presence is expected.
- Classifies each signal by type: `slack_dm_unanswered`, `slack_mention_unanswered`, `slack_action_opportunity`.
- Applies the contact blacklist — blacklisted contacts are silently discarded.
- Writes one event packet per actionable signal to `events/inbox/`.
- Appends to `events/inbox/TCL.md` and `ledgers/TCL.md`.

## Why this skill exists

Jake's role is often to see what's happening in Slack and determine where his involvement matters. The oracle reads Slack as an observer — it surfaces threads where action by Jake has meaningful impact and ignores noise.

## When to use it

- As part of the daily oracle sweep.
- When the deferred registry has open Slack-presence items.
- Any time a fresh Slack signal sweep is warranted.

## Blacklist rule (hard constraint)

The following contacts are permanently excluded. Never read, surface, or act on signals from:
- Pedro (774) 701-9505
- Matty (978) 868-4357
- Three additional blacklisted numbers

In Slack: if any blacklisted party is identified in a DM thread, skip the entire thread silently.

## Event packet format

Each Slack signal becomes an event packet in `events/inbox/` using the `buildEventPacket` shape:
- `event_type`: `slack_dm_unanswered` | `slack_mention_unanswered` | `slack_action_opportunity`
- `source_path`: channel or DM identifier
- `notes`: the signal summary — who sent it, what it's about, why it matters
- `recommended_route`: `claude-cowork` for meaning/response judgment
- `needs_ai_review`: `true`

## Output

One packet per actionable signal. Packet naming follows the event spine convention:
`events/inbox/evt_{timestamp}_{type}_{hash}.json`

## Ledger updates required after each pass

- `events/inbox/FCL.md` — list new packets
- `events/inbox/TCL.md` — log the ingress pass
- `ledgers/TCL.md` — global continuity entry
