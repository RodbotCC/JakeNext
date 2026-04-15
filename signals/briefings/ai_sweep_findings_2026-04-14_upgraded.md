# AI Sweep — Upgraded Intelligence Analysis
### Jake Personal Oracle Project
**Date**: 2026-04-14 | **Sweep period**: April 7–14, 2026 | **Methodology**: Mechanical extraction + competitive comparison

---

## Overview

This sweep identifies 5 high-signal AI findings from the past week. For each, I extract **how it mechanically works**, then compare against JakeNext's current architecture to identify capability gaps or direct analogs.

---

## Finding 1: Observational Memory (RAG Alternative)

**What it is**: Open-source memory architecture using two background agents to compress conversation history into a dated observation log, with no dynamic retrieval step.

**How it works mechanically**:
- Two agents run continuously: one creates dated observations from raw conversation turns; one removes stale observations as context grows.
- No RAG pipeline (no embedding, no search). Instead, the entire observation log stays in the prompt window, organized by timestamp.
- Token optimization via prompt caching: identical observation logs across turns are cached, reducing token spend by up to 10x.
- Benchmarks: 84.23% on LongMemEval vs. RAG's 80.05% (GPT-4o baseline), on fewer tokens.

**Competitive comparison to JakeNext**:
- **Analog**: Sylvia's `canon/JAKE_DEFERRED_REGISTRY.md` uses a similar structure — dated entries that accumulate and self-organize.
- **Gap**: JakeNext doesn't yet have background agents continuously curating the deferred registry or compressing old entries. The registry is static until Jake or Claude manually edits it.
- **Opportunity**: A Codex background task that runs hourly, reviews `canon/JAKE_DEFERRED_REGISTRY.md`, archives stale items, and creates summaries of recently-closed loops could give JakeNext the same token efficiency + continuity win that Observational Memory offers.

---

## Finding 2: Microsoft Agent Framework 1.0 (Enterprise Multi-Agent)

**What it is**: Microsoft unified .NET/Python framework merging AutoGen and Semantic Kernel; now production-ready with native A2A (Agent-to-Agent) and MCP (Model Context Protocol) support, plus browser-based orchestration UI.

**How it works mechanically**:
- Single API layer abstracts AutoGen's peer-to-peer agent communication and Semantic Kernel's structured task execution.
- A2A protocol: agents declare capabilities and listen for requests from other agents; built-in contract negotiation and handoff law.
- MCP integration: agents auto-discover and invoke tools from any MCP-compatible service; no manual schema registration.
- Browser DevUI: real-time view of agent states, active conversations, and tool invocations; can pause/inspect/resume live runs.

**Competitive comparison to JakeNext**:
- **Analog**: JakeNext's dispatcher + orchestrator UI mirrors this model — agents (Codex, Claude Co-Work, Jake) declared with clear role boundaries, MCP tools discoverable, live UI showing current state.
- **Gap**: JakeNext doesn't yet have true A2A protocol (agent-to-agent negotiation). Currently it's dispatcher-mediated: packets route through a central queue, not peer-to-peer agent contracts.
- **Opportunity**: If JakeNext scales to more concurrent agent roles (e.g., Sylvia spawning specialized searcher agents, or Codex + Claude Co-Work negotiating work division), a true A2A protocol layer would replace the current packet-mediated model and reduce bottlenecks.

---

## Finding 3: ACE (Agentic Context Engineering) Framework

**What it is**: Formalized discipline treating the context window as a scarce resource. Contexts evolve as "playbooks" that accumulate, refine, and organize strategies through generation, reflection, and curation — both offline (system prompts) and online (agent memory).

**How it works mechanically**:
- Offline phase: system prompt engineered to prioritize high-signal instructions; low-signal guidance removed.
- Online phase: as an agent runs, it generates candidate context additions, reflects on their relevance, and curates them into a working playbook.
- Reflection loop: after each action, the agent asks: "Did this context element contribute?" and weights future context by contribution.
- Results: +10.6% improvement on agent benchmarks, +8.6% on finance tasks vs. strong baselines.

**Competitive comparison to JakeNext**:
- **Analog**: JakeNext's ledger system (FCL, TCL, RLL) is a curated context layer — only high-signal documents reach the ratio lattice and the chooser's attention.
- **Gap**: JakeNext doesn't yet have online reflection and auto-curation. The ledgers are manually updated. There's no automatic signal-scoring that deprioritizes stale or low-relevance items.
- **Opportunity**: A Codex post-session reflection skill that scores which ledger entries and deferred items actually contributed to decisions, then weights future chooser context accordingly, would implement the ACE playbook model and likely improve the chooser's win rate.

---

## Finding 4: MCP Governance + Infrastructure Crossing

**What it is**: Model Context Protocol (MCP) now under Linux Foundation governance via the Agentic AI Foundation (formed Dec 2025). 97M+ monthly SDK downloads. 75+ official connectors. Enterprise security vendors (Cisco at RSA 2026) now shipping MCP-native tools.

**How it works mechanically**:
- MCP is a standardized protocol for agent ↔ tool communication. Agents declare a set of available tools; external services connect and invoke them.
- Protocol is implementation-agnostic: works with any LLM backend, any agent framework.
- Enterprise adoption signal: when security vendors build for a protocol, it's no longer a tool layer — it's infrastructure that companies will defend and extend.

**Competitive comparison to JakeNext**:
- **Current state**: JakeNext already uses MCP via Claude Co-Work's ingress skills (Slack, ClickUp, Google Calendar MCP connectors). Dispatcher detects packets and routes them.
- **Gap**: JakeNext doesn't yet expose MCP tools outbound to other systems. If Jake wants to make Sylvia callable from Slack (e.g., "Sylvia, what's the next move?"), that would require a reverse MCP adapter.
- **Opportunity**: A Slack-⟷-Sylvia MCP bridge would let team members query the oracle directly from Slack. This is a pure extension with no architectural risk.

---

## Finding 5: Paperclip Growth Velocity + A2A/MCP Convergence

**What it is**: Paperclip (open-source) hit 44,900 GitHub stars in 3 weeks (launched March 4). Fastest-growing AI project on record. Also: crewAI, LangGraph, and Microsoft Agent Framework all natively support both A2A and MCP — framework wars cooling; protocol layer is where lock-in happens.

**How it works mechanically**:
- Paperclip solves what hundreds of people need but nothing solved cleanly: probably a missing piece in the multi-agent operational stack (agent lifecycle, observability, recovery, or inter-agent state).
- A2A + MCP convergence: frameworks now compete on developer experience and domain focus, not on transport layer. Agent communication and tool access are commodity.

**Competitive comparison to JakeNext**:
- **Current state**: JakeNext has A2A-like roles (Codex, Claude Co-Work, Jake) and MCP tools (Slack, ClickUp ingress). Dispatcher is the hidden operational layer.
- **Gap**: JakeNext doesn't yet have Paperclip's likely strength — which is probably one of: agent lifecycle tracking, sophisticated recovery/retry logic, observable inter-agent handoff, or real-time observability dashboard.
- **Opportunity**: Audit which of these Paperclip probably does well, then either integrate it or build the JakeNext equivalent. Current orchestrator UI is good for *seeing* state; next frontier is *managing* agent lifecycle (retry policy, fallback paths, graceful degradation).

---

## Summary: Capability Gaps for JakeNext

Ranked by immediate impact:

1. **Online context reflection and auto-curation** (ACE gap) — low-risk, high-leverage. Post-session reflective scoring of which ledger items mattered would improve chooser win rate.
2. **Background observation log curation** (Observational Memory gap) — medium-risk, high-leverage. Hourly deferred registry compression + archival would give token efficiency gains and cleaner continuity memory.
3. **Agent lifecycle management and observability** (Paperclip gap) — high-risk, medium-leverage. Worth auditing Paperclip to understand what operational pattern it's solving, then decide whether to integrate or build equivalent.
4. **True A2A negotiation protocol** (Microsoft Agent Framework gap) — high-risk, medium-leverage. Only needed if JakeNext scales beyond 3 core agent roles.
5. **Outbound Slack MCP bridge** (MCP direction flip) — low-risk, medium-leverage. Allows Slack users to query Sylvia directly; pure extension.

---

## Research Scan Status

- **Team AI sweep (Track A)**: Complete for April 7–14. 5 high-signal findings extracted and analyzed.
- **Personal research sweep (Track B)**: Pending. Awaiting Jake's mathematics/physics framework to activate targeted matching against related work.

---

*End sweep. Next sweep scheduled per task configuration.*
