# SWEEP_POLICY — Pieces Behavioral Memory Governance
### JakeNext Oracle Project

> Governs how, when, and why the oracle sweeps Pieces for behavioral training signal.
> Last updated: 2026-04-16

---

## Tool Tiers

| Tier | Tools | Cadence | Signal Type |
|------|-------|---------|-------------|
| **1 (Critical)** | `ask_pieces_ltm`, `workstream_events_batch_snapshot` | Every sweep (4h) | Situation understanding + raw behavioral events |
| **2 (High)** | `workstream_summaries_batch_snapshot`, `workstream_summaries_full_text_search` | Daily | Session summaries + historical topic matches |
| **3 (Supporting)** | `tags_batch_snapshot`, `persons_batch_snapshot` | Weekly or on-demand | Category tracking + relationship signals |

---

## Sweep Procedure

### Tier 1 Sweep (every 4 hours)

1. Call `ask_pieces_ltm` — "What has Jake been working on since the last oracle sweep?"
2. Call `workstream_events_batch_snapshot` — get recent behavioral events
3. Filter events for oracle relevance (active chooser concerns, deferred items, north star pillars)
4. Write sweep report to `pieces/sweeps/sweep_YYYY-MM-DD_HH-MM.md`
5. Emit event packets to `signals/events/inbox/` for any high-signal findings
6. Update `pieces/sweeps/TCLps.md`, `pieces/TCLp.md`, `ledgers/TCLl.md`

### Tier 2 Sweep (daily)

All Tier 1 steps, plus:
7. Call `workstream_summaries_batch_snapshot` — get session summaries
8. Call `workstream_summaries_full_text_search` — cross-reference active oracle concerns
9. Check for pattern promotion candidates (3+ sweep confirmations of same signal)

### Tier 3 Sweep (weekly or on-demand)

All Tier 1+2 steps, plus:
10. Call `tags_batch_snapshot` — review category evolution
11. Call `persons_batch_snapshot` — review relationship signals

---

## Sweep Report Format

```markdown
# Pieces Sweep — {date} {time}
### Tier: {1|2|3}

## LTM Situation Understanding
{Output from ask_pieces_ltm — synthesized summary of what Jake has been doing}

## Behavioral Events ({count} significant / {total} raw)
| Time | Type | Summary | Oracle Relevance |
|------|------|---------|-----------------|
{Table of significant events only}

## Workstream Summaries ({count})
{If Tier 2+: AI-synthesized session summaries from Pieces}

## Oracle Training Signal
{The "so what" — what should Sylvia learn from this sweep?
 - What decision patterns emerged?
 - What attention patterns emerged?
 - What does this tell us about current priorities vs declared priorities?
 - Does this confirm or challenge the current chooser winner?}

## Event Packets Emitted ({count})
{List of packets written to signals/events/inbox/}
```

---

## Pattern Promotion

When 3+ sweeps reveal the same behavioral pattern:

1. Create a pattern file in `pieces/patterns/pattern_{slug}.md`
2. Document: pattern name, first observed, confirmations, oracle relevance, recommended action
3. Update `pieces/patterns/FCLpp.md` and `pieces/patterns/TCLpp.md`
4. Consider whether the pattern should update the deferred registry, chooser policy, or identity docs

Pattern files are **permanent**. They are the durable output of the sweep system.

---

## Retention

- **Sweep files**: 30-day retention. Older sweeps can be archived or deleted.
- **Pattern files**: Permanent. These are the training signal that survives.
- **Event packets**: Follow the normal event lifecycle in `signals/events/`.

---

## Relevance Filter

Not every Pieces event is oracle-relevant. Filter by:

1. **Active chooser concerns** — does this event relate to the current winner or open packets?
2. **Deferred registry items** — does this event touch an open commitment or research thread?
3. **North star pillars** — does this event advance one of the three breakthrough pillars?
4. **Relationship signals** — does this involve a key collaborator (Rodrigo, Andre, etc.)?
5. **Decision moments** — does this capture a choice, priority shift, or attention allocation?

If none of these apply, the event is noise. Summarize it in the sweep report but do not emit a packet.

---

## Scheduling

**Critical constraint**: Pieces MCP runs on `localhost:39300`. Remote agents (Anthropic cloud) cannot reach it. All Pieces sweeps must run **locally** via Claude Code.

| Schedule | What | How |
|----------|------|-----|
| Every 4 hours (active session) | Tier 1 sweep | `/loop 4h` in Claude Code session |
| Daily | Tier 2 sweep | Manual or hook-triggered at session start |
| Weekly (manual) | Tier 3 sweep | On-demand |

**`/loop` usage**: During active Claude Code sessions, run `/loop 4h run the Pieces Tier 1 sweep per pieces/SWEEP_POLICY.md` to get recurring behavioral captures while Jake is working.

**Session-start hook** (future): Wire a Claude Code hook that runs a Tier 1 sweep automatically when a JakeNext session opens. This ensures every session starts with fresh behavioral context.

**Remote scheduling** (Slack/ClickUp/GCal ingress): These use cloud MCP connectors and CAN run as remote agents via `/schedule`. Pieces cannot.
