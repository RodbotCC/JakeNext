# RLL — Pieces Tool Ranking
### JakeNext Oracle Project

> Comparative ranking of Pieces MCP tools by oracle training signal value.
> Last updated: 2026-04-16

---

## Tool Tiers

### Tier 1 — Critical (every sweep)

| Tool | Signal Type | Training Value | Why |
|------|-----------|---------------|-----|
| `ask_pieces_ltm` | Situation understanding | **Highest** | Single call returns synthesized summary + relevant events. Best ratio of signal-to-noise. Answers "what is Jake doing and why?" |
| `workstream_events_batch_snapshot` | Raw behavioral events | **High** | Clipboard, screenshots, audio with millisecond timestamps. Captures actual decision moments. |

### Tier 2 — High Value (daily or on-demand)

| Tool | Signal Type | Training Value | Why |
|------|-----------|---------------|-----|
| `workstream_summaries_batch_snapshot` | Session summaries | **High** | AI-synthesized work session summaries. Captures project scope and duration. |
| `workstream_summaries_full_text_search` | Historical topic matches | **Medium-High** | Cross-references current oracle concerns against behavioral history. |

### Tier 3 — Supporting (weekly or on-demand)

| Tool | Signal Type | Training Value | Why |
|------|-----------|---------------|-----|
| `tags_batch_snapshot` | Category tracking | **Medium** | Shows how work is being categorized over time. |
| `persons_batch_snapshot` | Relationship signals | **Medium** | Who appears in Jake's activity. Collaboration patterns. |

### Not Currently Used

| Tool | Reason |
|------|--------|
| `extract_temporal_range` | Requires specific temporal phrase formatting; useful for targeted queries |
| `conversations_batch_snapshot` | Returns empty in testing; conversation messages may be more useful |
| `*_vector_search` tools | Semantic search — valuable for pattern discovery, not regular sweeps |
| `*_full_text_search` (non-summary) | Useful for targeted investigation, not regular sweeps |
| `create_pieces_memory` | Write-back to Pieces — future use for bidirectional integration |

---

## Ranking Rationale

Signal value is scored by:
1. **Behavioral fidelity** — does it capture what Jake actually did vs. what was summarized?
2. **Oracle relevance** — can it feed chooser decisions, deferred registry, or module gap closure?
3. **Noise ratio** — how much filtering is needed before the signal is useful?
4. **Temporal precision** — can it be time-bounded to avoid re-processing?
