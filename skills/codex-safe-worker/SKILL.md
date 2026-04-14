---
name: codex-safe-worker
description: Use when Codex should autonomously execute only explicitly approved local substrate work from `handoff/codex/inbox/` packets marked `codex_safe_auto`.
---

# Codex Safe Worker

Use this skill for safe autonomous local execution.

## What this skill does

- Reads Codex inbox packets.
- Filters for `Execution Mode: codex_safe_auto`.
- Executes only bounded local substrate actions.
- Moves packets through queue states and leaves receipts.

## Allowed actions in v1

- tree scan
- ledger drift check
- event packet creation
- event routing
- daily substrate sweep
- chooser artifact refresh
- module progress refresh

## Forbidden actions in v1

- external app actions
- destructive cleanup
- semantic canon rewrites
- Claude Co-Work work
- Jake-lane completion

## Rule

If a packet does not say `codex_safe_auto`, skip it.
