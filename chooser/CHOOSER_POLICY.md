# Chooser Policy
### Sylvia Bootstrap Loop v1

> This file defines how Sylvia chooses the next best move in the current bootstrap phase.

---

## Hourly loop

Every chooser pass should:

1. boot from `ledgers/`, `identity/`, `chooser/`, `handoff/`, and `jake/`,
2. refresh `chooser/MODULE_PROGRESS.md`,
3. score candidate next moves using the current lattice law,
4. prefer the move that closes the most important module gap,
5. prefer easier wins only when module impact is effectively tied,
6. route blockers honestly into `jake/inbox/` or `handoff/claude-cowork/inbox/`,
7. write a chooser run receipt,
8. update `chooser/NEXT_STEP.md`,
9. and leave local plus global continuity traces when the winning move changes or new packets are opened.

---

## Decision law

The chooser is not a flat task picker.

It privileges:

1. module gap closure,
2. Sylvia emergence,
3. immediate actionability,
4. low counterfeit risk,
5. and lower cognitive cost when two candidates are materially tied.

---

## Routing law

- `codex_safe_auto` → `handoff/codex/inbox/` and eligible for the safe worker
- `queue_only` / `claude_semantic` → `handoff/claude-cowork/inbox/`
- `manual_jake` → `jake/inbox/`

If the winner is blocked on Jake-specific truth, the right output is a Jake packet, not fake implementation work.

If the winner is Claude-semantic, the right output is a queue packet only. No fake automation should pretend Claude Co-Work executed it.

---

## Duplicate suppression

If the winning move is unchanged and the corresponding packet is still open, the chooser should:

- not reopen an identical packet,
- write a continuity note instead,
- and keep the current winner live in `chooser/NEXT_STEP.md`.

---

## Safety

- No hidden semantic canon rewrites.
- No external-app actions in v1.
- No destructive cleanup in v1.
- No Jake-lane completion by automation.
