# RLL — Claude Code Capability Library
### Jake Personal Oracle Project

> Ratio Lattice Ledger for the Claude Code capability shelf.
> Last updated: 2026-04-15

---

## Purpose

This RLL ranks Claude Code capabilities by **importance to Sylvia's autonomous development**, not by general utility.

The question is not "what's useful?" but "what's critical for Sylvia to become autonomous, event-driven, and self-maintaining through the Claude Code substrate?"

---

## Ranking Tiers

### Tier 1: Critical Substrate (Foundation)

These capabilities are **non-negotiable** for autonomous operation. Without these, Sylvia is session-scoped and reactive, not continuous and proactive.

| Rank | Entry | Why Critical |
|------|-------|--------------|
| **1** | `hooks-reference/` + `how-hooks-work/` | **Event-driven nervous system.** Hooks enable Sylvia to react to state changes automatically. PreToolUse/PostToolUse = validation. SessionStart = continuity reinjection. Stop = cleanup. This is how substrate becomes active, not passive. |
| **2** | `auto-memory/` | **Temporal continuity substrate.** Without auto-memory, every session is a cold start. This is how Sylvia remembers across sessions without Jake manually maintaining MEMORY.md. |
| **3** | `work-with-subagents/` + `write-subagent-files/` | **Cognitive scaling through delegation.** Subagents = parallel exploration, specialized reasoning, background work. This is how Sylvia thinks at scale, not just in serial. |
| **4** | `create-your-first-skill/` + `configure-skills/` | **Extensibility foundation.** Skills = new capabilities packaged as SKILL.md. This is how Sylvia grows beyond built-in tools. |
| **5** | `how-claude-remembers-your-project/` | **Instruction persistence.** CLAUDE.md scoping, @ imports, .claude/rules/ = how Sylvia's behavioral parameters survive across sessions. This is the instruction substrate. |

**Rationale**: These five entries define the substrate for autonomous, continuous, scalable operation. Everything else is enhancement or optimization.

---

### Tier 2: Important Enhancements (Multipliers)

These capabilities **significantly enhance** what Sylvia can do, but aren't strictly required for basic autonomous operation.

| Rank | Entry | Why Important |
|------|-------|---------------|
| **6** | `automate-workflows-with-hooks/` | **Practical automation patterns.** This shows HOW to use hooks for real workflows (notifications, formatting, protection, reinjection). Tier 1 is theory, this is practice. |
| **7** | `agent-teams/` + `how-agent-teams-work/` | **Multi-perspective synthesis.** Teams = parallel agents with shared task list + mailboxes. This is how Sylvia explores competing hypotheses, not just single-path reasoning. |
| **8** | `configure-subagents/` + `control-subagent-capabilities/` | **Delegation control surface.** This defines how to scope subagent tools, MCP servers, permissions. This is how Sylvia creates safe, bounded specialist agents. |
| **9** | `advanced-skill-patterns/` | **Advanced extensibility.** Shell injection, forked subagents, artifact-producing skills. This is how skills become powerful, not just declarative. |
| **10** | `define-hooks-for-subagents/` | **Subagent validation layer.** Hooks FOR subagents = validating delegated work, post-edit checks, start/stop lifecycle. This is how Sylvia maintains quality on delegated cognition. |

**Rationale**: These make the Tier 1 substrate significantly more powerful. Teams = multi-perspective. Workflow automation = practical patterns. Subagent control = safe delegation.

---

### Tier 3: Useful Infrastructure (Operational)

These capabilities **improve operational efficiency** but aren't critical for autonomous behavior.

| Rank | Entry | Why Useful |
|------|-------|------------|
| **11** | `environment-variables/` | **Runtime configuration.** All env vars for auth, memory, MCP, debug. Useful for tuning, not required for function. |
| **12** | `organize-rules-with-claude-rules/` | **.claude/rules/ scoping.** Path-scoped instructions, symlinks, precedence. Useful for large instruction sets, not required for small ones. |
| **13** | `tools-reference/` | **Built-in tool catalog.** Knowing what's available natively. Reference material, not capability. |
| **14** | `built-in-commands/` | **Slash command reference.** Finding commands, understanding gating. Reference material. |
| **15** | `control-agent-teams/` | **Team control surface.** Display mode, plan approval, quality gates. Useful for complex team work, overkill for simple delegation. |

**Rationale**: These are infrastructure and reference. Important for sophisticated use, but Sylvia can operate without them initially.

---

### Tier 4: Advanced Patterns (Future Expansion)

These capabilities enable **future operational modes** but aren't needed for current autonomous development.

| Rank | Entry | Why Advanced |
|------|-------|--------------|
| **16** | `channels/` | **External signal ingress.** Chat bridging, webhook-like events, remote interaction (Telegram/Discord). Powerful but complex. Future phase. |
| **17** | `run-prompts-on-a-schedule/` | **Session-scoped cron.** Polling, reminders, interval commands. Useful for long-running sessions, not critical for basic autonomy. |
| **18** | `advanced-hooks/` | **Exotic hook patterns.** Prompt-based hooks, agent-based hooks, HTTP hooks. Advanced debugging. Future optimization. |

**Rationale**: These unlock new operational modes (external signals, scheduling) but require Tier 1-3 to be solid first.

---

## Comparative Reasoning

### Why hooks-reference (#1) > auto-memory (#2)?

Both are critical, but hooks are MORE fundamental because:
- Hooks enable auto-memory to be *used* (SessionStart reinjects context)
- Hooks enable validation, cleanup, state maintenance
- Auto-memory is one substrate; hooks are the EVENT SYSTEM that makes substrate active

Without hooks: Sylvia has memory but no way to react to changes.
Without auto-memory: Sylvia forgets but can still react.

**Verdict**: Hooks = nervous system. Memory = storage. Nervous system > storage.

---

### Why work-with-subagents (#3) > create-your-first-skill (#4)?

Both are extensibility, but subagents are MORE critical because:
- Subagents = parallel cognition NOW (built-in capability)
- Skills = new capabilities LATER (requires authoring)
- Subagents scale existing reasoning; skills add new reasoning

Without subagents: Sylvia is serial, slow, can't delegate.
Without skills: Sylvia can still use built-in tools + subagents.

**Verdict**: Scaling existing capability > adding new capability.

---

### Why agent-teams (#7) < work-with-subagents (#3)?

Both are delegation, but teams are LESS critical because:
- Teams = advanced pattern (shared task list, mailboxes, coordination)
- Subagents = basic pattern (spawn, run, return)
- Teams require more coordination overhead
- Teams are overkill for most tasks

Without teams: Sylvia can still delegate to individual subagents.
Without subagents: Sylvia can't delegate at all.

**Verdict**: Basic delegation > advanced coordination.

---

### Why channels (#16) is Tier 4, not Tier 2?

Channels enable external signals, which SOUNDS critical for autonomy. But:
- Channels require external infrastructure (Telegram bot, Discord webhook, etc.)
- Channels add coordination complexity
- Sylvia can operate autonomously within sessions BEFORE needing external signals
- Internal autonomy (hooks, memory, subagents) must be solid first

**Verdict**: Internal autonomy > external signal handling. Build substrate before ingress.

---

## Implementation Priority

Based on this ranking, the implementation order for Sylvia's Claude Code substrate should be:

**Phase 1 (Foundation):**
1. Hooks system (study hooks-reference, how-hooks-work, automate-workflows-with-hooks)
2. Auto-memory (understand persistence model)
3. Subagents (learn delegation patterns)
4. Skills (create first custom capabilities)
5. CLAUDE.md/.claude/rules/ (instruction persistence)

**Phase 2 (Scaling):**
6. Agent teams (multi-perspective synthesis)
7. Subagent control (safe delegation)
8. Advanced skill patterns (powerful skills)
9. Subagent hooks (delegated quality)

**Phase 3 (Optimization):**
10. Environment variables (runtime tuning)
11. Rules organization (instruction scoping)
12. Reference materials (tools, commands)

**Phase 4 (Expansion):**
13. Channels (external signals)
14. Cron scheduling (autonomous timing)
15. Advanced hooks (exotic patterns)

---

## Scoring Summary

| Tier | Entry Count | Cumulative Weight | Phase |
|------|-------------|-------------------|-------|
| Tier 1 (Critical) | 5 | 100% required | Phase 1 |
| Tier 2 (Important) | 5 | 80% value-add | Phase 2 |
| Tier 3 (Useful) | 5 | 40% efficiency | Phase 3 |
| Tier 4 (Advanced) | 3 | 20% expansion | Phase 4 |

---

*This ranking is specific to Sylvia's autonomous development through Claude Code substrate. Generic utility rankings would differ.*
