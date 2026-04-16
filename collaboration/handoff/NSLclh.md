# NSL — Handoff
### Jake Personal Oracle Project

> North Star Ledger for the handoff directory.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining.**

---

## How This Directory Advances the North Star

### 1. Handoff Enables Multi-Agent Coordination

Three agent queues:
- **codex/** - Deterministic execution (file ops, validation, mechanical work)
- **claude-cowork/** - Semantic reasoning (analysis, synthesis, judgment)
- **shared/** - Cross-agent coordination (decisions, questions, conflicts)

**Without handoff**: All work goes to one agent, bottlenecking. With it, work routes to the best-suited agent.

**Alignment**: 🟢 **STRONG** - Multi-agent coordination enables autonomous work distribution.

---

### 2. Queue System Enables Asynchronous Operation

Each agent queue has inbox/active/done lifecycle:
- **inbox/** - New work awaiting pickup
- **active/** - Work in progress
- **done/** - Completed work receipts

**Without queues**: Synchronous blocking (wait for response). With queues, asynchronous flow (fire and check later).

**Alignment**: 🟢 **STRONG** - Asynchronous operation enables autonomous background work.

---

### 3. Shared Queues Enable Agent Collaboration

Three shared coordination queues:
- **decisions/** - Cross-agent decisions requiring consensus
- **questions/** - Unresolved questions awaiting clarification
- **conflicts/** - Agent disagreements requiring resolution

**Without shared queues**: Agents operate in silos. With them, agents collaborate.

**Alignment**: 🟢 **MODERATE** - Collaboration improves quality but isn't strictly required for autonomy.

---

### 4. Handoff Respects Agent Boundaries (AGENTS.md)

From AGENTS.md:
- Codex: Safe for file ops, deterministic execution, ledger updates
- Claude Co-Work: Safe for semantic reasoning, synthesis, judgment
- Shared: For work requiring multi-agent coordination

**Without boundaries**: Agents do the wrong kind of work. With them, work routes correctly.

**Alignment**: 🟢 **STRONG** - Correct routing prevents errors and enables safe autonomy.

---

## Current Handoff State

### Queue Status (as of Phase 3)
- **codex/inbox/** - Empty (dispatcher operational)
- **claude-cowork/inbox/** - Empty
- **shared/decisions/** - 1 item (Codex permission to auto-close)
- **shared/questions/** - Empty
- **shared/conflicts/** - Empty

### Operational Status
- **Dispatcher**: ✅ v1 (routes event packets to queues)
- **Codex worker**: ✅ v1 (executes safe packets from codex/inbox/)
- **Claude Co-Work ingress**: ✅ v1 (Slack/GCal/ClickUp)
- **Shared coordination**: ⏳ Partial (decisions queue exists, not actively used)

---

## What This Directory IS

Handoff is the **multi-agent coordination bus** that routes work to the appropriate agent and enables asynchronous collaboration.

It's not decision-making (that's in chooser/). It's not execution (that's in capabilities/). It's work routing and coordination.

---

## What This Directory IS NOT

- **Not permanent storage** - Handoff queues are transient work states
- **Not the work itself** - Handoff holds packets, not outcomes
- **Not a single agent** - Handoff coordinates BETWEEN agents

---

## Gaps / Risks

1. **Queue overflow**: If work enters faster than agents can process, queues grow unbounded.
   - **Mitigation**: Monitor queue depths, add capacity or backpressure as needed.

2. **Dead letters**: If packets are malformed or unroutable, they get stuck.
   - **Mitigation**: Dispatcher should move unroutable packets to a dead-letter queue for review.

3. **Shared queues underutilized**: If agents don't use shared/decisions|questions|conflicts/, coordination suffers.
   - **Mitigation**: Explicitly route cross-agent work to shared queues instead of forcing synchronous resolution.

4. **No queue monitoring**: If queues aren't monitored, work silently piles up.
   - **Mitigation**: Add monitoring skill that checks queue depths and alerts on overflow.

---

## Verdict

**Strongly aligned** with north star. Handoff enables multi-agent coordination, which enables autonomous work distribution and asynchronous operation.

Without handoff, Sylvia is a single-threaded bottleneck.
With handoff, Sylvia coordinates multiple specialized agents for parallel work.

---

*This directory earns its keep by enabling multi-agent coordination and asynchronous work distribution.*
