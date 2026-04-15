# FCL — claude-cowork-clickup-ingress
### Skill Directory Contents Ledger

> What lives here, what it does, and how it connects to the system.
> Last updated: 2026-04-14

---

## Purpose

This directory contains the Claude Co-Work skill for ingesting ClickUp task signals as oracle event packets. Claude Co-Work executes this skill using live MCP tool access to ClickUp, then writes routable packets to `events/inbox/`.

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
- Urgency scoring uses ratio lattice dimensions: closure potential, counterfeit risk, momentum alignment.
- Packet naming: `events/inbox/evt_{timestamp}_{type}_{hash}.json`

---

## Dependencies

- ClickUp MCP connector (`mcp__clickup_filter_tasks`, `mcp__clickup_resolve_assignees`, etc.)
- `events/inbox/` directory must exist

---

## Relationship to System

Feeds the BUSINESS/OPERATIONS domain of the ratio lattice. Stalled tasks inflate Counterfeit Risk. Overdue items collapse Closure Potential. Without this ingress, the oracle is reasoning about Jake's work life without knowing what's actually in his task queue.
