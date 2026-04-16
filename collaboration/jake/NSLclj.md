# NSL — Jake
### Jake Personal Oracle Project

> North Star Ledger for the jake directory.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining.**

---

## How This Directory Advances the North Star

### 1. Jake Lane Enables Human-in-Loop When Needed

Jake queue (inbox/active/done):
- **inbox/** - Blockers requiring Jake's input
- **active/** - Jake working on them
- **done/** - Resolved with Jake's truth

**Without Jake lane**: Sylvia guesses on operator truth or gets stuck. With it, Sylvia explicitly escalates.

**Alignment**: 🟢 **STRONG** - Explicit human-in-loop enables autonomy elsewhere (Sylvia doesn't need Jake for everything, only for operator truth).

---

### 2. Jake Lane Prevents Guessing on Operator Truth

From JAKE_INTERFACE.md and AGENTS.md:
- Jake owns: Personal preferences, relationship nuances, business context, manual actions
- Sylvia owns: Structural reasoning, continuity, prioritization, execution

**Without this boundary**: Sylvia makes up answers or avoids decisions. With it, Sylvia knows when to ask.

**Alignment**: 🟢 **STRONG** - Clear boundaries prevent useless guessing and enable confident autonomous operation.

---

### 3. Jake Lane Is Just Another Agent in Handoff

Jake recognized as another agent:
- Not special-cased as "the operator"
- Just another queue in the collaboration bus
- Treated like codex/ or claude-cowork/ - work routes in, work comes out

**Without this framing**: Jake feels like an interruption. With it, Jake is part of the flow.

**Alignment**: 🟢 **MODERATE** - Architectural cleanliness supports long-term maintainability.

---

## Current Jake Queue State

### Active Packets
- **jake/inbox/packet_09_action_selection_storytelling.md** - André alignment cluster (highest priority from chooser)

### Queue Status
- **inbox/** - 1 item (action selection / André alignment)
- **active/** - Empty
- **done/** - Empty

---

## What This Directory IS

Jake lane is the **operator truth ingress point** where Sylvia explicitly escalates decisions requiring human judgment.

It's not a dumping ground for "hard stuff." It's for work that REQUIRES Jake's personal truth, not work that's merely difficult.

---

## What This Directory IS NOT

- **Not a general question queue** - Questions that can be answered through research or reasoning shouldn't route here
- **Not a "too hard" bucket** - Difficult technical work goes to codex/ or claude-cowork/, not here
- **Not urgent by default** - Jake packets compete with other work in the chooser

---

## Routing Rules (When to Escalate to Jake)

**Route to jake/inbox/ when**:
- Decision requires Jake's personal preference (taste, relationships, business context)
- Action requires Jake's manual intervention (sending a message, making a call)
- Truth depends on Jake's private knowledge (relationships, commitments, history)
- Safety requires Jake's approval (financial decisions, relationship moves, irreversible actions)

**Do NOT route to jake/inbox/ when**:
- Answer is findable through research (use claude-cowork/ or web search)
- Work is technically difficult but doesn't require operator truth (use codex/ or claude-cowork/)
- Decision can be made with existing doctrine/ledgers (use chooser/)

---

## Gaps / Risks

1. **Jake queue becomes dumping ground**: If Sylvia escalates too much, Jake gets overwhelmed.
   - **Mitigation**: Strict routing rules - only operator truth goes to Jake.

2. **Jake queue gets ignored**: If Jake doesn't check it regularly, blockers pile up.
   - **Mitigation**: Chooser should prefer Jake packets when they're the highest-priority work.

3. **Jake packets lack context**: If packets don't explain WHY Jake's input is needed, he can't respond effectively.
   - **Mitigation**: Jake packets should include "Why I need you" section explaining what operator truth is required.

---

## Verdict

**Strongly aligned** with north star. Jake lane enables autonomous operation by providing a clear escalation path for operator truth.

Without Jake lane, Sylvia either guesses badly or avoids decisions.
With Jake lane, Sylvia confidently operates autonomously and explicitly escalates when needed.

**Paradox**: The better the Jake lane works, the LESS it gets used (because Sylvia becomes more autonomous).

---

*This directory earns its keep by providing a clear, bounded interface for human-in-loop when operator truth is genuinely required.*
