---
name: codex-dispatcher
description: Use when Codex should run the Sylvia dispatcher to detect new packets in handoff queues and route them to the correct execution path — auto-executing safe packets, surfacing semantic work, and flagging Jake bottlenecks.
---

# Codex Dispatcher

Use this skill when queue packets need to be detected and acted on immediately, not just passively accumulated.

## What this skill does

- Scans `handoff/codex/inbox/`, `handoff/claude-cowork/inbox/`, and `jake/inbox/` for new packets.
- For `codex_safe_auto` packets: immediately invokes `consume_codex_safe_packets.mjs` to execute them.
- For `queue_only` / `claude_semantic` packets: surfaces them in the Claude Co-Work inbox TCL and global TCL without pretending to execute them.
- For `manual_jake` packets: surfaces them as operator bottlenecks in `jake/TCL.md` without rerouting.
- Tracks all seen packets in `.oraclestate/dispatcher_state.json` to prevent double-dispatch.
- Writes a JSON dispatch receipt to `events/processed/` after each pass.
- Appends to relevant TCL.md files and the global `ledgers/TCL.md` for every dispatch action.

## Why this skill exists

Without a dispatcher, packets sit in queues indefinitely unless a human manually runs the safe worker or scans the inbox. The dispatcher is the nervous system that makes the substrate reactive — packets arrive, and the right thing happens.

## When to use it

- On the Sylvia Dispatcher scheduled automation (recommended: every 15 minutes or on packet arrival).
- Manually, after opening a new packet, to confirm it routes correctly.
- After a chooser run that creates new Codex or Claude Co-Work packets.

## Modes

| Mode | Command | When to use |
|---|---|---|
| One-shot | `node scripts/dispatcher.mjs` | Scheduled task; single pass and exit |
| Watch | `node scripts/dispatcher.mjs --watch` | Persistent daemon; polls every 30s |
| Watch (custom interval) | `node scripts/dispatcher.mjs --watch --interval=60` | Long-running with explicit cadence |
| Reset state | `node scripts/dispatcher.mjs --reset` | Clear seen-packet memory and start fresh |

## Routing law

| Execution Mode | Lane | Dispatcher Action |
|---|---|---|
| `codex_safe_auto` | codex | Invokes safe worker immediately |
| `queue_only` | codex | Surfaces for Codex review; no auto-run |
| `claude_semantic` | claude-cowork | Surfaces for semantic review; never auto-run |
| `manual_jake` | jake | Surfaces as operator bottleneck; never rerouted |

## Safety invariants

- Never auto-executes `claude_semantic` or `manual_jake` packets. Queueing is the ceiling.
- Never silently rewrites semantic canon.
- Never deletes or moves packets for non-safe modes.
- If the safe worker fails, logs the error to `ledgers/TCL.md` and continues.
- Duplicate suppression is durable — state persists across script restarts.

## Ledger discipline

After every dispatch pass, the dispatcher must have left traces in:
- `ledgers/TCL.md` — for every packet dispatched (safe-executed, surfaced, or flagged)
- The relevant queue TCL (`handoff/codex/TCL.md`, `handoff/claude-cowork/TCL.md`, or `jake/TCL.md`)
- `events/processed/TCL.md` — for the dispatch receipt written that pass

## Adding new safe actions

To add a new safe action the dispatcher can execute:
1. Add the action name to `consume_codex_safe_packets.mjs` in the `runSafeAction` function.
2. Create a `codex_safe_auto` packet using that action name in `Safe Action:`.
3. Document the action in `templates/work_order.md`.
