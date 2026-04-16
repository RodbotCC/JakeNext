# NSL — Chooser
### Jake Personal Oracle Project

> North Star Ledger for the chooser directory.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining.**

---

## How This Directory Advances the North Star

### 1. Chooser Loop Enables Autonomous Action Selection

`CHOOSER_POLICY.md` + `NEXT_STEP.md` + decision scripts:
- Evaluate candidate moves from events, collaboration queues, deferred registry
- Apply comparator law and RLL scoring
- Select the next best move autonomously

**Without this**: Sylvia waits for Jake to tell her what to do. With it, Sylvia selects her own next action.

**Alignment**: 🟢 **PERFECT** - Autonomous action selection is literally the core of "autonomous."

---

### 2. Module Progress Tracking Enables Self-Awareness

`MODULE_PROGRESS.md`:
- Tracks which modules are complete, in-progress, or missing
- Identifies capability gaps
- Provides completion signals for module-based work

**Without this**: Sylvia doesn't know what she can do. With it, Sylvia knows her own capabilities.

**Alignment**: 🟢 **STRONG** - Self-awareness of capabilities enables better decision-making.

---

### 3. Run Receipts Enable Self-Maintenance

`runs/` directory:
- Append-only log of every chooser decision
- Captures reasoning, scores, and selected winner
- Enables auditing and learning from past choices

**Without this**: Every decision is a cold start. With it, Sylvia learns from her own history.

**Alignment**: 🟢 **STRONG** - Self-maintenance = learning from own history.

---

### 4. Dynamic Completeness Principle (From Decision Laws)

Chooser embodies Law 1: **Dynamic completeness over timeless completion**.
- Decisions are situational (comparator + baseline + residue)
- The "right" move changes as context changes
- No timeless optimal answer

**Without this**: Sylvia seeks perfect decisions and never acts. With it, Sylvia acts on best-available moves.

**Alignment**: 🟢 **STRONG** - Dynamic completeness enables action under uncertainty.

---

## What This Directory IS

Chooser is the **autonomous decision engine**.

It's where Sylvia decides what to do next without Jake telling her. It's the operational substrate of autonomy.

---

## What This Directory IS NOT

- **Not passive state storage** - Chooser actively selects moves
- **Not Jake's decision-making** - Jake's decisions route through collaboration/jake/
- **Not event storage** - Events live in signals/events/, chooser consumes them

---

## Gaps / Risks

1. **Chooser stuck in loops**: If comparator law doesn't properly handle ties or stale packets, chooser can loop forever.
   - **Mitigation**: Law 4 (when ambiguous, take easiest valid next move) prevents infinite loops.

2. **Chooser ignores deferred registry**: If sweeps don't cross-reference deferred work, chooser only sees inbox.
   - **Mitigation**: Sweeps must actively check deferred registry for newly-actionable items.

3. **Run receipts not used for learning**: If receipts are just logs and never analyzed, no learning happens.
   - **Mitigation**: Future capability - analyze run receipts to identify patterns (e.g., "Jake always rejects this type of move").

---

## Verdict

**Perfectly aligned** with north star. Chooser is where autonomy happens.

Without chooser, Sylvia is a chatbot waiting for prompts.
With chooser, Sylvia is an agent selecting her own next moves.

---

*This directory earns its keep by being the autonomous decision engine that selects Sylvia's next actions.*
