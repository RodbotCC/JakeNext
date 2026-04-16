---
name: claude-cowork-clickup-ingress
description: Use when Claude Co-Work should pull ClickUp task state — stalled tasks, overdue items, new assignments — and convert them into event packets in events/inbox/ for oracle routing and ratio lattice scoring.
---

# Claude Co-Work ClickUp Ingress

Use this skill to sweep ClickUp for task signals that affect Jake's operational priorities or the Comeketo business domain.

## What this skill does

- Retrieves tasks assigned to Jake across all spaces.
- Identifies stalled tasks (no recent update, status unchanged too long).
- Surfaces overdue or near-deadline tasks.
- Flags tasks where Jake is blocking others.
- Scores each signal's urgency using the ratio lattice dimensions (closure potential, counterfeit risk, momentum alignment).
- Writes one event packet per actionable signal to `events/inbox/`.
- Appends to `events/inbox/TCL.md` and `ledgers/TCLl.md`.

## Why this skill exists

ClickUp is Jake's project/task state. It feeds the BUSINESS domain of the ratio lattice. Without ingesting ClickUp, the oracle is reasoning about Jake's life without knowing what's in his actual work queue. Stalled tasks inflate Counterfeit Risk. Overdue items collapse Closure Potential. This ingress keeps the lattice honest.

## When to use it

- As part of the daily oracle sweep.
- When the deferred registry has open Comeketo items (role mapping, André alignment, sales mission control).
- Any time a business domain signal sweep is warranted.

## Classification rules

| Signal type | Criteria |
|---|---|
| `clickup_task_stalled` | Task assigned to Jake, no update in 72+ hours, not done |
| `clickup_task_overdue` | Task with due date in the past, not closed |
| `clickup_task_blocking` | Task Jake owns that others are waiting on |
| `clickup_task_new` | Task newly assigned to Jake |

## Event packet format

- `event_type`: one of the four types above
- `source_path`: ClickUp task URL or ID
- `notes`: task name, list/space, status, due date, why it matters to the oracle
- `recommended_route`: `claude-cowork` for interpretation; `jake` if action requires his direct input
- `needs_ai_review`: `true`

## Ledger updates required after each pass

- `events/inbox/FCL.md`
- `events/inbox/TCL.md`
- `ledgers/TCLl.md`
