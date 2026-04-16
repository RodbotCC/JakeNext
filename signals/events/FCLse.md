# FCL — Events
### Jake Personal Oracle Project

> Event spine for filesystem-triggered oracle work.
> Last updated: 2026-04-14

---

## Purpose

The `events/` directory stores structured event packets created from filesystem scans, ledger drift checks, daily substrate sweeps, and future watcher runs.

Events are not semantic conclusions. They are receipts that something changed and a prompt for AI interpretation or mechanical routing.

---

## Lifecycle

| Directory | Purpose | Status |
|---|---|---|
| `inbox/` | Newly created event packets awaiting routing or review | ✅ Live |
| `processed/` | Event packets that have been routed, handled, or superseded | ✅ Live |
| `failed/` | Event packets that could not be routed or need recovery | ✅ Live |

---

## Packet Convention

Event packets use JSON and should follow `templates/event_packet.json`.

Minimum fields:

- `event_id`
- `event_type`
- `timestamp`
- `source_path`
- `classification`
- `recommended_route`
- `needs_ai_review`
- `ledger_updates`
- `notes`

---

## Rules

- Scripts may create event packets.
- AI agents interpret event packets.
- Failed packets stay in `failed/` until explicitly recovered.
- Processed packets are receipts and should not be deleted casually.

