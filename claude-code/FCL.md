# FCL — Claude Code Capability Library
### Jake Personal Oracle Project

> File Contents Ledger for the Claude Code capability shelf.
> Last updated: 2026-04-15

---

## Purpose

This directory is the **Claude Code substrate layer** for Sylvia.

When Sylvia operates through Claude Code (vs Codex, Gemini CLI, etc.), these are the native capabilities she can leverage. This is not generic documentation - it's the indexed capability surface for one of Sylvia's operational substrates.

---

## Root Files

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Library overview and split from capabilities/ | ✅ Live |
| `BUILDING_COLOR_PALETTE.md` | Color palette building reference | ✅ Live |
| `FCL.md` | This file - contents ledger | ✅ Live |
| `TCL.md` | Temporal continuity for this directory | ✅ Live |
| `RLL.md` | Capability ranking by priority | ✅ Live |
| `NSL.md` | North star alignment for Claude Code capabilities | ✅ Live |

---

## Core Autonomy Capabilities

### Hooks System (Event-Driven Behavior)

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `hooks-reference/` | hooks-reference | Complete hook event reference, matchers, decision outputs |
| `how-hooks-work/` | how-hooks-work | Hook timing, stdin parsing, structured decisions, filtering |
| `automate-workflows-with-hooks/` | automate-workflows-with-hooks | Practical automation patterns (notifications, formatting, protection, reinjection) |
| `advanced-hooks/` | advanced-hooks | Prompt-based, agent-based, HTTP hooks, debugging |
| `define-hooks-for-subagents/` | define-hooks-for-subagents | Subagent validation, post-edit checks, start/stop events |

**Why this matters for Sylvia:** Hooks are the event-driven nervous system. PreToolUse/PostToolUse/SessionStart/Stop hooks enable Sylvia to react to state changes, validate actions, and maintain continuity automatically.

---

### Memory & Continuity

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `auto-memory/` | auto-memory | Automatic memory system, disabling, auditing, debugging persistence |
| `how-claude-remembers-your-project/` | how-claude-remembers-your-project | CLAUDE.md scoping, @ imports, AGENTS.md bridge, nested loading |

**Why this matters for Sylvia:** Memory is substrate. Auto-memory provides session-to-session continuity. CLAUDE.md/.claude/rules/ provide instruction persistence.

---

### Delegation & Parallel Work

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `work-with-subagents/` | work-with-subagents | Automatic delegation, @-mentions, background tasks, resumption |
| `write-subagent-files/` | write-subagent-files | Authoring subagent markdown, frontmatter, inheritance |
| `configure-subagents/` | configure-subagents | Project vs session agents, precedence, scope |
| `control-subagent-capabilities/` | control-subagent-capabilities | Tool restrictions, MCP scoping, permission modes |
| `agent-teams/` | agent-teams | Parallel research, multi-perspective design, competing hypotheses |
| `how-agent-teams-work/` | how-agent-teams-work | Team architecture, shared task lists, mailboxes, decomposition |
| `control-agent-teams/` | control-agent-teams | Display mode, team size, plan approval, quality gates |

**Why this matters for Sylvia:** Delegation = scaling cognition. Subagents enable parallel exploration. Teams enable multi-perspective synthesis. This is how Sylvia thinks at scale.

---

### Skills (Custom Capabilities)

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `create-your-first-skill/` | create-your-first-skill | SKILL.md structure, discovery, testing invocation |
| `configure-skills/` | configure-skills | Frontmatter, invocation control, arguments, file splitting |
| `advanced-skill-patterns/` | advanced-skill-patterns | Shell injection, forked subagents, artifact-producing skills |

**Why this matters for Sylvia:** Skills = extensibility. New capabilities get packaged as SKILL.md files. Advanced patterns enable context injection and safe execution.

---

## Configuration & Control

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `environment-variables/` | environment-variables | All Claude Code env vars (auth, memory, MCP, debug, telemetry) |
| `organize-rules-with-claude-rules/` | organize-rules-with-claude-rules | .claude/rules/ scoping, glob patterns, symlinks, precedence |
| `built-in-commands/` | built-in-commands | Slash commands, platform gating, deprecated commands |

**Why this matters for Sylvia:** Environment control = execution context tuning. Rules = instruction scoping. Commands = operational surface.

---

## Reference Documentation

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `tools-reference/` | tools-reference | Built-in tool names, permissions, Bash/LSP/PowerShell behavior |

**Why this matters for Sylvia:** Tool reference = understanding what's available natively.

---

## Advanced Patterns

| Entry | Manifest | Purpose |
|-------|----------|---------|
| `channels/` | channels | Chat bridging, webhook-like events, remote interaction (Telegram/Discord/iMessage) |
| `run-prompts-on-a-schedule/` | run-prompts-on-a-schedule | Session-scoped polling, reminders, cron scheduling |

**Why this matters for Sylvia:** Channels = external signal ingress. Cron = autonomous scheduling. These enable Sylvia to operate beyond single-session boundaries.

---

## Coverage

- **25 capability entries** indexed
- **All manifests** parsed
- **Zero unindexed files** at capability layer
- **Substrate-specific** - these are Claude Code capabilities, not generic agent patterns

---

## Next Steps

1. **RLL.md** - rank capabilities by importance to Sylvia's development
2. **NSL.md** - track north star alignment for each capability group
3. **Integration planning** - which capabilities should be wired first for autonomous operation

---

*This is not documentation storage. This is Sylvia's substrate capability index for the Claude Code operational layer.*
