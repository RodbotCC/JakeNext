# FCL — claude-cowork-slack-ingress
### Skill Directory Contents Ledger

> What lives here, what it does, and how it connects to the system.
> Last updated: 2026-04-14

---

## Purpose

This directory contains the Claude Co-Work skill for ingesting Slack signals as oracle event packets. Claude Co-Work executes this skill using live MCP tool access to Slack, then writes routable packets to `events/inbox/`.

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
- Blacklist constraint is a hard filter — no signal from blacklisted contacts may pass through.
- Packet naming: `events/inbox/evt_{timestamp}_{type}_{hash}.json`

---

## Dependencies

- Slack MCP connector (`mcp__slack_search_public_and_private`, `mcp__slack_read_channel`, etc.)
- `events/inbox/` directory must exist
- Blacklist awareness from `CLAUDE.md` and `skills/claude-cowork-slack-ingress/SKILL.md`

---

## Relationship to System

Feeds the RELATIONSHIPS and PRESENCE domains of the ratio lattice. Surfaces where Jake should be visible, active, or responding. Without this ingress, the oracle cannot reason about Jake's Slack presence obligation.
