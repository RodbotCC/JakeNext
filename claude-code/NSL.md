# NSL — Claude Code Capability Library
### Jake Personal Oracle Project

> North Star Ledger for the Claude Code capability shelf.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining through Claude Code substrate.**

This directory exists to make that possible. Every capability entry should either:
1. **Enable autonomy** (Sylvia acts without prompting)
2. **Enable event-driven behavior** (Sylvia reacts to state changes)
3. **Enable self-maintenance** (Sylvia keeps her own substrate healthy)

If an entry doesn't clearly serve one of these three pillars, it may be useful but is not north-star-aligned.

---

## Alignment Analysis

### Tier 1: Critical Substrate — STRONGLY ALIGNED ✅

| Entry | Autonomy | Event-Driven | Self-Maintenance | Verdict |
|-------|----------|--------------|------------------|---------|
| `hooks-reference/` + `how-hooks-work/` | 🟢 Yes | 🟢 **PRIMARY** | 🟢 Yes | **Perfect alignment.** Hooks ARE the event-driven substrate. SessionStart = reinjection. PostToolUse = validation. Stop = cleanup. |
| `auto-memory/` | 🟢 Yes | 🟡 Indirect | 🟢 **PRIMARY** | **Strong alignment.** Auto-memory = self-maintenance of continuity. Indirect event-driven (memory triggers from SessionStart hooks). |
| `work-with-subagents/` + `write-subagent-files/` | 🟢 **PRIMARY** | 🟡 Indirect | 🟡 Indirect | **Strong alignment.** Subagents = autonomous delegation. Background tasks = autonomous work. Event-driven via SubagentStart/Stop hooks. |
| `create-your-first-skill/` + `configure-skills/` | 🟢 Yes | 🟡 Depends | 🟡 Depends | **Moderate alignment.** Skills CAN enable autonomy (e.g., cron skill) but aren't inherently autonomous. Extensibility substrate. |
| `how-claude-remembers-your-project/` | 🟡 Supports | 🔴 No | 🟢 **PRIMARY** | **Moderate alignment.** CLAUDE.md/.claude/rules/ = self-maintaining instruction substrate, but not autonomous or event-driven on their own. |

**Tier 1 verdict**: 4/5 strongly aligned, 1/5 moderately aligned. Tier 1 is well-chosen.

---

### Tier 2: Important Enhancements — MOSTLY ALIGNED ✅

| Entry | Autonomy | Event-Driven | Self-Maintenance | Verdict |
|-------|----------|--------------|------------------|---------|
| `automate-workflows-with-hooks/` | 🟢 **PRIMARY** | 🟢 **PRIMARY** | 🟢 Yes | **Perfect alignment.** Practical automation = autonomy in action. Event-driven patterns. Self-maintenance examples (formatting, protection). |
| `agent-teams/` + `how-agent-teams-work/` | 🟢 Yes | 🟡 Indirect | 🟡 Indirect | **Moderate alignment.** Teams = advanced autonomy (parallel work), but require explicit spawning. Not inherently event-driven. |
| `configure-subagents/` + `control-subagent-capabilities/` | 🟡 Supports | 🔴 No | 🟡 Supports | **Weak alignment.** Configuration entries don't directly enable autonomy - they CONTROL it. Useful but not generative. |
| `advanced-skill-patterns/` | 🟢 Yes | 🟡 Depends | 🟡 Depends | **Moderate alignment.** Advanced patterns (shell injection, forked subagents) can enable autonomy, but aren't inherently autonomous. |
| `define-hooks-for-subagents/` | 🟡 Supports | 🟢 **PRIMARY** | 🟢 Yes | **Strong alignment.** Subagent hooks = event-driven validation of delegated work. Self-maintenance of subagent quality. |

**Tier 2 verdict**: 2/5 strongly aligned, 2/5 moderately aligned, 1/5 weakly aligned. Mixed bag, but mostly useful.

---

### Tier 3: Useful Infrastructure — WEAKLY ALIGNED ⚠️

| Entry | Autonomy | Event-Driven | Self-Maintenance | Verdict |
|-------|----------|--------------|------------------|---------|
| `environment-variables/` | 🔴 No | 🔴 No | 🟡 Supports | **Weak alignment.** Env vars are configuration, not capability. Support self-maintenance but don't enable it. |
| `organize-rules-with-claude-rules/` | 🔴 No | 🔴 No | 🟡 Supports | **Weak alignment.** Rules organization is useful for large instruction sets, but doesn't enable autonomy. |
| `tools-reference/` | 🔴 No | 🔴 No | 🔴 No | **Not aligned.** Pure reference material. Useful for humans, not generative for Sylvia. |
| `built-in-commands/` | 🔴 No | 🔴 No | 🔴 No | **Not aligned.** Reference material. |
| `control-agent-teams/` | 🟡 Supports | 🟡 Supports | 🔴 No | **Weak alignment.** Control surface, not generative capability. |

**Tier 3 verdict**: 0/5 strongly aligned, 3/5 weakly aligned, 2/5 not aligned. This tier is correctly ranked LOW because it's infrastructure/reference, not north-star-aligned capability.

---

### Tier 4: Advanced Patterns — PARTIALLY ALIGNED ⚠️

| Entry | Autonomy | Event-Driven | Self-Maintenance | Verdict |
|-------|----------|--------------|------------------|---------|
| `channels/` | 🟢 **PRIMARY** | 🟢 **PRIMARY** | 🔴 No | **Strong BUT PREMATURE alignment.** Channels = external signal ingress = event-driven autonomy. BUT: requires external infrastructure. Should be Phase 4, not Phase 1. |
| `run-prompts-on-a-schedule/` | 🟢 **PRIMARY** | 🟢 Yes | 🟡 Supports | **Strong BUT SESSION-SCOPED alignment.** Cron = autonomous timing, but session-scoped only. Not durable across sessions. Useful but limited. |
| `advanced-hooks/` | 🟡 Supports | 🟢 Yes | 🟡 Supports | **Moderate alignment.** Prompt-based, agent-based, HTTP hooks are advanced patterns, but basic hooks already cover most use cases. |

**Tier 4 verdict**: 2/3 strongly aligned (but premature), 1/3 moderately aligned. This tier is CORRECTLY placed in Phase 4 because the alignment is real but requires solid foundation first.

---

## Gap Analysis

### What's Missing?

Based on the north star (autonomous, event-driven, self-maintaining), here are capabilities that SHOULD exist but don't appear in this library:

1. **Persistent Cron (Beyond Session Scope)**
   - `run-prompts-on-a-schedule/` is session-scoped only
   - **Gap**: No entry for durable, cross-session scheduling
   - **Impact**: Sylvia can't maintain autonomous rhythms (daily sweeps, weekly reviews) without Jake manually starting sessions
   - **Status**: ⚠️ MISSING

2. **State Persistence Patterns**
   - `auto-memory/` covers memory, but what about OTHER state?
   - **Gap**: No entry for persistent state machines, work queues, event logs
   - **Impact**: Sylvia's state resets every session except for memory
   - **Status**: ⚠️ PARTIALLY COVERED (auto-memory covers some, but not all state)

3. **Health Monitoring & Self-Diagnosis**
   - Hooks enable validation, but there's no entry on SELF-DIAGNOSIS
   - **Gap**: No patterns for "Sylvia checks her own substrate health"
   - **Impact**: Sylvia can't proactively detect and fix degraded state
   - **Status**: ⚠️ MISSING

4. **Ledger Maintenance Automation**
   - Jake's four-ledger system (FCL/TCL/RLL/NSL) is critical, but there's no entry on AUTOMATING ledger updates
   - **Gap**: No hooks-based or skill-based ledger maintenance
   - **Impact**: Ledgers require manual updates, which introduces drift risk
   - **Status**: ⚠️ MISSING (but could be built with existing hooks + skills)

5. **External Signal Prioritization**
   - `channels/` enables external signals, but there's no entry on HOW TO PRIORITIZE them
   - **Gap**: No patterns for "this Slack message is urgent, this one isn't"
   - **Impact**: Sylvia could be overwhelmed by signal noise
   - **Status**: ⚠️ MISSING (but could be built with channels + comparator logic)

---

## Alignment Score by Tier

| Tier | North Star Alignment | Reasoning |
|------|----------------------|-----------|
| **Tier 1** | 🟢 90% aligned | 4/5 strongly aligned. Hooks, memory, subagents are CORE to autonomy. Skills and CLAUDE.md are moderately aligned (extensibility + persistence). |
| **Tier 2** | 🟡 70% aligned | 2/5 strongly aligned (workflows, subagent hooks), 2/5 moderately aligned (teams, advanced skills), 1/5 weakly aligned (subagent config). Mixed but useful. |
| **Tier 3** | 🔴 30% aligned | 0/5 strongly aligned. Infrastructure and reference. Useful for humans, not generative for autonomy. Correctly ranked LOW. |
| **Tier 4** | 🟢 80% aligned BUT PREMATURE | 2/3 strongly aligned (channels, cron), but require Tier 1-3 first. Correctly placed in Phase 4. |

**Overall library alignment**: 🟢 **70% aligned with north star.**

The library is WELL-DESIGNED for autonomous development. Tier 1 is laser-focused on the right substrate. Tier 2 enhances it. Tier 3 is correctly deprioritized. Tier 4 is correctly sequenced.

---

## Actionable Insights

### 1. Tier 1 is GOLD — prioritize learning these first ✅

Hooks, memory, subagents, skills, CLAUDE.md are the right foundation. No changes needed.

### 2. Tier 3 can be SKIMMED, not studied 📚

Reference materials (tools-reference, built-in-commands) are lookup tables, not generative capabilities. Skim once, refer back as needed.

### 3. Build the missing capabilities as SKILLS 🛠️

The gaps (persistent cron, health monitoring, ledger automation, signal prioritization) aren't in this library, but they CAN be built using Tier 1 primitives (hooks + skills + subagents).

**Next steps**:
- **Persistent cron skill** (wraps external scheduler, e.g., macOS launchd)
- **Health check skill** (reads ledgers, checks for drift, reports issues)
- **Ledger update hooks** (PostToolUse hooks that auto-update FCL/TCL)
- **Signal prioritization skill** (comparator-based urgency scoring)

### 4. Channels are premature but IMPORTANT — delay but don't forget 🔮

`channels/` is strongly aligned with north star, but it's Phase 4 for a reason. External signal ingress requires solid internal substrate first. Don't skip it, just sequence it correctly.

---

## North Star Trajectory

**Current state**: 25 capability entries, 70% aligned, well-sequenced into 4 tiers.

**Next state**: Phase 1 implementation (Tier 1 capabilities wired into Sylvia's operation).

**Future state**: Gaps filled with custom skills, Tier 4 capabilities wired, external signal ingress operational.

**Endpoint**: Sylvia operates autonomously through Claude Code substrate - event-driven, self-maintaining, externally aware.

---

## Verdict

This library is **strongly north-star-aligned** for Phase 1-2. Tier 1 is perfect. Tier 2 is useful. Tier 3 is correctly deprioritized. Tier 4 is premature but important.

**No major misalignments detected.**

**Recommended action**: Proceed with Phase 1 implementation (study + wire Tier 1 capabilities).

---

*North star alignment is not binary. It's a trajectory. This library moves Sylvia toward autonomous, event-driven, self-maintaining operation through Claude Code substrate. That's the test.*
