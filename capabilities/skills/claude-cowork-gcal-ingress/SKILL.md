---
name: claude-cowork-gcal-ingress
description: Use when Claude Co-Work should pull Google Calendar events and convert upcoming commitments, gaps, and time pressures into event packets in events/inbox/ for the oracle to track and route.
---

# Claude Co-Work GCal Ingress

Use this skill to sweep Google Calendar for signals that carry time pressure, commitment weight, or scheduling opportunity.

## What this skill does

- Lists upcoming events for the next 7–14 days.
- Classifies each event by type: `calendar_commitment`, `calendar_deadline_approaching`, `calendar_event_proposed`.
- Surfaces events that imply action Jake hasn't taken yet (no prep packet, no associated ClickUp task, no oracle routing).
- Identifies calendar gaps — windows where oracle-generated commitments should be proposed.
- Writes one event packet per meaningful signal to `events/inbox/`.
- Appends to `events/inbox/TCL.md` and `ledgers/TCLl.md`.

## Why this skill exists

Jake does not currently maintain a calendar. The oracle builds one gradually — inferring commitments from signals, proposing entries, and building continuity around time. The GCal ingress is the intake layer for this.

## When to use it

- As part of the daily oracle sweep.
- When the deferred registry has open calendar items.
- Before any session where Jake's availability or upcoming commitments matter.

## Classification rules

| Signal type | Criteria |
|---|---|
| `calendar_commitment` | Confirmed event within 48 hours |
| `calendar_deadline_approaching` | Event or deadline within 7 days with no prep packet |
| `calendar_event_proposed` | Oracle-identified window where a commitment should be scheduled |

## Event packet format

- `event_type`: one of the three types above
- `source_path`: calendar event ID or title slug
- `notes`: event summary — title, date/time, attendees if any, why it matters to Jake
- `recommended_route`: `claude-cowork` for meaning; `jake` if approval or scheduling requires his input
- `needs_ai_review`: `true`

## Ledger updates required after each pass

- `events/inbox/FCL.md`
- `events/inbox/TCL.md`
- `ledgers/TCLl.md`
