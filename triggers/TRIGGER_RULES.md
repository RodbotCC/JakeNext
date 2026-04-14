# TRIGGER_RULES — JakeNext Event Grammar
### Version 1 — Scan-Based Foundation

---

## Operating Principle

The file tree is the trigger surface. A filesystem change is not automatically meaningful, but it is always eligible to become legible.

The first implementation is scan-based. Scripts compare snapshots and create event packets. A live watcher can be added later after these rules prove stable.

---

## Trigger Classes

| Event Type | Detection | Default Route | AI Review | Ledger Rule |
|---|---|---|---|---|
| `file_created` | Path exists in current scan but not previous snapshot | `codex` for structure/scripts; `claude-cowork` for source/canon | Required for source/canon | Update the relevant local `FCL.md`, append the relevant local `TCL.md`, and append `ledgers/TCL.md` if significant |
| `file_edited` | Path hash or size changed | `codex` for scripts/ledgers; `claude-cowork` for foundation/source/analysis | Required for semantic files | Update the relevant local `TCL.md`; update local `FCL.md` if purpose/status changed; append `ledgers/TCL.md` when the edit materially changes workspace state |
| `file_moved` | Previous hash appears at a new path | `codex`; shared conflict if meaning changed | Conditional | Update `ledgers/FDL.md`, both affected local `FCL.md` files, both affected local `TCL.md` files, and `ledgers/TCL.md` |
| `staleness` | Packet remains in inbox/active beyond declared threshold | `codex` for queue hygiene; `claude-cowork` for priority meaning | Conditional | Append the local queue `TCL.md` and `ledgers/TCL.md` if it changes priority or queue state |
| `ledger_drift` | Ledger references disagree with actual filesystem | `codex` for mechanical drift; shared conflict for semantic mismatch | Conditional | Repair ledgers after review |
| `correction` | Jake correction or explicit contradiction enters system | `claude-cowork` first | Required | Update correction log and any affected doctrine |
| `density` | Related files accumulate enough to deserve synthesis | `claude-cowork` for synthesis; `codex` for packet creation | Required | Append the relevant local `TCL.md`, append `ledgers/TCL.md`, and update macro-level status if accepted |
| `jake_blocker` | A candidate move or live task needs Jake-specific truth, approval, or manual action | `jake/inbox/` | Required | Append the relevant local queue `TCL.md`, append `chooser/TCL.md` if emitted by the chooser, and append `ledgers/TCL.md` if the blocker changes active priority |
| `chooser_run` | Hourly chooser pass re-evaluates module gaps and selects a current winner | `chooser/` plus the winning queue lane | Required | Write a chooser run receipt, update `chooser/NEXT_STEP.md`, append `chooser/TCL.md`, and append `ledgers/TCL.md` if the winner changed or packets were opened |

---

## Path Routing Rules

| Path Pattern | Primary Owner | Reason |
|---|---|---|
| `scripts/**` | `codex` | Tooling and automation |
| `events/**` | `codex` | Event packet mechanics |
| `triggers/**` | `codex` | Trigger grammar implementation |
| `chooser/**` | `codex` | Chooser law, module gap state, and run receipts |
| `templates/**` | `codex` | Packet/work-order scaffolding |
| `.oraclestate/**` | `codex` | Non-canonical machine state |
| `jake/**` | `jake` | Operator truth lane and response queues |
| `handoff/codex/**` | `codex` | Codex work queue |
| `handoff/claude-cowork/**` | `claude-cowork` | Claude Co-Work semantic queue |
| `handoff/shared/**` | `shared` | Decisions, questions, conflicts |
| `source/**` | `claude-cowork` | Raw source meaning |
| `analysis/**` | `claude-cowork` | Interpretation and synthesis |
| `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md` | `claude-cowork` | Canonical oracle doctrine |
| `canon/JAKE_DEFERRED_REGISTRY.md` | `claude-cowork` | Priority and correction meaning |
| `AGENTS.md` | `codex` with shared review | Agent boundary contract |
| `ledgers/FDL.md`, `ledgers/FCL.md`, `ledgers/MACRO_LEDGER.md`, `ledgers/TCL.md`, local `FCL.md`, local `TCL.md` | `codex` for mechanical edits; shared if semantic status changes | Ledger spine |

---

## Staleness Thresholds

| Queue | Threshold | Action |
|---|---|---|
| `events/inbox/` | 24 hours | Create staleness event |
| `handoff/*/inbox/` | 24 hours | Create queue reminder packet |
| `handoff/*/active/` | 48 hours | Create active-work review packet |
| `handoff/shared/conflicts/` | 24 hours | Surface as priority conflict |
| `jake/inbox/` | 24 hours | Surface as operator bottleneck without rerouting away from Jake |
| `chooser/NEXT_STEP.md` | 24 hours without outcome movement | Run chooser continuity pass instead of reopening the same winner |

---

## Safety Rules

- No trigger silently rewrites semantic canon.
- No trigger deletes packets as a cleanup shortcut.
- No generated packet is treated as truth until reviewed or processed.
- If routing is ambiguous, use `handoff/shared/conflicts/`.
- If Jake corrects the system, correction outranks automation.
- If the chooser winner is unchanged and still open, write continuity instead of reopening the same packet.
- If the winner is `claude_semantic`, queue it only; do not fake auto-execution.
- If the winner is `manual_jake`, route to `jake/inbox/` instead of generating bluff work for agents.
- Only packets marked `codex_safe_auto` may be consumed by the safe worker.
