# NSL — Events
### Jake Personal Oracle Project

> North Star Ledger for the events directory.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining.**

---

## How This Directory Advances the North Star

### 1. Events Enable External Awareness

Event packets capture external signals:
- Slack DMs, mentions, action opportunities
- GCal commitments, deadlines, scheduling gaps
- ClickUp tasks (stalled, overdue, blocking, new)

**Without events**: Sylvia is blind to the external world. With them, Sylvia knows what's happening.

**Alignment**: 🟢 **PERFECT** - External awareness is required for "event-driven."

---

### 2. Event Routing Enables Autonomous Response

Event lifecycle:
1. **inbox/** - raw packets awaiting routing
2. Triggers apply routing rules
3. **processed/** - routed to appropriate queues (handoff/, jake/, chooser/)
4. **failed/** - recovery queue for malformed packets

**Without routing**: Events pile up unhandled. With it, Sylvia automatically routes work.

**Alignment**: 🟢 **STRONG** - Autonomous routing enables event-driven behavior.

---

### 3. Event Packets Standardize Signal Format

All external signals become event packets with standard structure:
- `event_id`, `timestamp`, `source`
- `priority`, `urgency`, `deadline`
- `requires_jake` flag
- `payload` (signal-specific data)

**Without standardization**: Every signal type needs custom handling. With it, routing is uniform.

**Alignment**: 🟢 **MODERATE** - Standardization supports autonomy but isn't autonomy itself.

---

## Current Event State

### Phase 3 Completion
- **7 live packets in inbox/** (from Apr 14 ingress run)
- Slack ingress ✅ operational
- GCal ingress ✅ operational
- ClickUp ingress ✅ operational

### Event Flow Status
- **Ingress**: ✅ Working (3 skills operational)
- **Routing**: ⏳ Partial (dispatcher exists, not fully wired)
- **Processing**: ⏳ Partial (manual review still required)
- **Cleanup**: ⚠️ Not automated (failed/ queue not monitored)

---

## What This Directory IS

Events is the **signal ingress layer** that makes Sylvia aware of the external world.

It's not decision-making (that's in chooser/). It's not execution (that's in capabilities/). It's signal capture and routing.

---

## What This Directory IS NOT

- **Not permanent storage** - Events are transient, not canonical
- **Not decision logic** - Routing rules live in triggers/, not here
- **Not execution** - Work execution happens in handoff queues, not here

---

## Gaps / Risks

1. **Event inbox overflow**: If ingress rate exceeds routing rate, inbox grows unbounded.
   - **Mitigation**: Dispatcher should run frequently enough to keep inbox drained.

2. **Failed events unmonitored**: If failed/ queue isn't reviewed, errors go unnoticed.
   - **Mitigation**: Add monitoring skill that checks failed/ and alerts when packets accumulate.

3. **Event packets lack context**: If packets don't capture enough context, routing decisions are blind.
   - **Mitigation**: Ingress skills should enrich packets with relevant metadata (urgency, deadline, requires_jake flag).

4. **Stale events**: If old events aren't pruned, processed/ grows unbounded.
   - **Mitigation**: Add cleanup skill that archives old processed/ events after N days.

---

## Verdict

**Strongly aligned** with north star. Events enable external awareness, which enables event-driven behavior.

Without events, Sylvia operates in a vacuum.
With events, Sylvia is connected to the real world and can respond to it.

---

*This directory earns its keep by capturing external signals and routing them into Sylvia's decision-making process.*
