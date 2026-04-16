# FCL — Templates
### Jake Personal Oracle Project

> Reusable packet templates for events, work orders, chooser receipts, ledger reconciliation, and agent handoffs.
> Last updated: 2026-04-14

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `event_packet.json` | JSON shape for event packets emitted into `events/inbox/` | ✅ Live |
| `work_order.md` | Standard work-order packet for agent queues | ✅ Live |
| `ledger_reconciliation.md` | Packet template for repairing ledger/filesystem drift | ✅ Live |
| `agent_handoff.md` | Packet template for Codex ↔ Claude Co-Work requests | ✅ Live |
| `jake_request.md` | Standard request packet for Jake-specific blockers, approvals, and missing personal truth | ✅ Live |
| `chooser_run.md` | Standard chooser receipt for hourly Sylvia decision passes | ✅ Live |
| `FCL.md` | This file — templates directory contents ledger | ✅ Live |

---

## Rules

- Templates define packet shape, not final meaning.
- Agent-specific packets should keep boundaries explicit.
- If a new packet class appears more than twice, promote it into a template here.
