---
name: codex-sylvia-chooser
description: Use when Codex should run the Sylvia chooser loop: refresh module progress, score candidate moves, select the next best step, and open the right Codex, Claude Co-Work, or Jake packet without bluffing.
---

# Codex Sylvia Chooser

Use this skill when the system needs to decide the next best move.

## What this skill does

- Boots from the current ledgers, identity docs, queues, and chooser state.
- Prioritizes module gap closure over generic easy wins.
- Writes chooser receipts and the current `NEXT_STEP.md`.
- Opens or reuses the right packet in Codex, Claude Co-Work, or Jake lanes.
- Suppresses duplicate queue churn when the winner has not truly changed.

## Why this skill exists

Without a real chooser, the architecture can describe itself forever without actually deciding anything.

## When to use it

- On the hourly chooser automation.
- After meaningful structure or identity changes.
- After major queue outcomes that could change the winning next move.

## Rules

- Module progress wins ties over easy novelty.
- If the blocker is Jake-specific, route to `jake/inbox/`.
- If the winner is Claude-semantic, queue it only.
- Only `codex_safe_auto` work is eligible for the safe worker.
- Every chooser pass leaves a run receipt and chooser continuity trace.
