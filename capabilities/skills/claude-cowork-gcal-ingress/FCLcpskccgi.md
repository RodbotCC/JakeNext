# FCL — claude-cowork-gcal-ingress
### Skill Directory Contents Ledger

> What lives here, what it does, and how it connects to the system.
> Last updated: 2026-04-14

---

## Purpose

This directory contains the Claude Co-Work skill for ingesting Google Calendar signals as oracle event packets. Claude Co-Work executes this skill using live MCP tool access to GCal, then writes routable packets to `events/inbox/`.

---

## Contents

| File | Purpose |
|---|---|
| `SKILL.md` | Skill definition — what it does, when to use it, classification rules, event packet format, ledger obligations |
| `FCL.md` | This file — directory contents ledger |
| `TCL.md` | Local continuity ledger — history of skill creation, updates, and ingress passes |

---

## Conventions

- This skill is executed by Claude Co-Work, not Codex — it requires MCP tool access.
- Each run must produce at least one `events/inbox/FCL.md` update and one `events/inbox/TCL.md` entry.
- Calendar gaps are a first-class output — the skill should propose scheduling windows, not only surface existing events.
- Packet naming: `events/inbox/evt_{timestamp}_{type}_{hash}.json`

---

## Dependencies

- Google Calendar MCP connector (`mcp__gcal_list_calendars`, `mcp__gcal_list_events`, etc.)
- `events/inbox/` directory must exist

---

## Relationship to System

Feeds the COMMITMENTS and SELF-DIRECTION domains of the ratio lattice. Surfaces time pressure, approaching deadlines, and open scheduling windows. Without this ingress, the oracle cannot reason about Jake's calendar obligations or help build a commitment surface.
