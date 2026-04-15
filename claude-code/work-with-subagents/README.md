---
name: work-with-subagents
description: Claude Code reference entry for invoking, delegating to, backgrounding, resuming, and composing subagents in real workflows. Use when deciding how subagents should be used in practice rather than how they are defined.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Work With Subagents

This is a focused Claude Code reference entry for using subagents in practice.

## What this entry covers

- automatic delegation
- explicit invocation patterns
- running the full session as a subagent
- foreground vs background behavior
- common workflow patterns
- when to use subagents versus the main conversation
- resuming stopped subagents
- subagent auto-compaction
- strong example patterns

## Core judgment

Subagents are best when the work is:
- self-contained
- noisy
- specialized
- or worth isolating from the main conversation

The main conversation is still the right place when:
- you need iterative back-and-forth
- context is shared heavily across phases
- latency matters

## Automatic delegation

Claude automatically decides whether to delegate based on:
- your task wording
- the `description` field of available subagents
- current context

If you want Claude to be more eager to delegate, write descriptions with phrases like:

- `use proactively`

That makes delegation intent easier for Claude to detect.

## Explicit invocation patterns

There are three escalating ways to invoke subagents.

### 1. Natural language

You name the subagent and Claude typically decides to delegate.

Examples:
- `Use the test-runner subagent to fix failing tests`
- `Have the code-reviewer subagent look at my recent changes`

### 2. `@`-mention

This guarantees that specific subagent runs for that task.

Example:

```text
@"code-reviewer (agent)" look at the auth changes
```

Important detail:
- your full message still goes to Claude
- Claude writes the subagent task prompt based on your request
- the mention controls which subagent is invoked, not the full prompt content

Manual mention forms:
- `@agent-<name>` for local subagents
- `@agent-<plugin-name>:<agent-name>` for plugin subagents

### 3. Session-wide subagent

Run the whole session as a subagent with:

```sh
claude --agent code-reviewer
```

Or for plugins:

```sh
claude --agent <plugin-name>:<agent-name>
```

You can also set the default in `.claude/settings.json`:

```json
{
  "agent": "code-reviewer"
}
```

Important behavior:
- the subagent system prompt replaces the default Claude Code system prompt
- `CLAUDE.md` and project memory still load through normal message flow
- the CLI flag overrides the setting
- the choice persists when resuming the session

## Foreground vs background

Subagents can run in:
- foreground
- background

### Foreground

Foreground subagents:
- block the main conversation until complete
- pass permission prompts through to you
- pass clarifying questions through to you

### Background

Background subagents:
- run concurrently while you keep working
- ask for needed permissions up front
- inherit the approved permissions
- auto-deny anything not pre-approved

If a background subagent needs to ask clarifying questions:
- that tool call fails
- the subagent continues

If a background subagent fails due to permissions:
- retry with a new foreground subagent for interactive approval flow

Ways to trigger backgrounding:
- ask Claude to run it in the background
- press `Ctrl+B` on a running task

To disable background tasks entirely:

`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

## Common patterns

### Isolate high-volume operations

One of the best uses for subagents is keeping noisy output out of the main context.

Examples:
- run tests and return only failing cases
- fetch documentation and return only key findings
- process logs and return only relevant conclusions

### Run parallel research

Use multiple subagents when the investigations are independent.

Example:
- research authentication, database, and API modules in parallel

This works well when the threads do not depend on each other.

Important caution:
- many detailed subagent results can still consume a lot of main-context space when they return

### Chain subagents

For sequential workflows, have Claude use one subagent after another.

Example:
- code-reviewer finds performance issues
- optimizer fixes them

### Choose between subagents and main conversation

Use the main conversation when:
- you need frequent refinement
- implementation, planning, and testing share lots of context
- the task is quick and targeted
- startup latency matters

Use subagents when:
- the task is self-contained
- the output is verbose
- you want restrictions or specialization
- a summary return is enough

### Choose subagents vs skills vs `/btw`

Use subagents when:
- you want isolated context

Use skills when:
- you want reusable prompts or workflows inside the main conversation context

Use `/btw` when:
- you need a quick question answered about current context
- and you do not need tool access

## Resume subagents

Each subagent invocation starts as a fresh instance unless you explicitly resume it.

When resumed:
- it keeps its previous conversation history
- tool calls, tool results, and reasoning remain available
- it picks up where it stopped instead of starting over

Claude resumes a stopped subagent using `SendMessage` with the agent ID in the `to` field.

Important detail:
- `SendMessage` is only available when agent teams are enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

You can ask Claude to continue prior work naturally:

1. `Use the code-reviewer subagent to review the authentication module`
2. after completion: `Continue that code review and now analyze the authorization logic`

Subagent transcript storage:
- `~/.claude/projects/{project}/{sessionId}/subagents/`
- file pattern: `agent-{agentId}.jsonl`

Important persistence behavior:
- main conversation compaction does not affect subagent transcripts
- transcripts persist within the session
- transcript cleanup follows `cleanupPeriodDays` with default 30 days

## Auto-compaction

Subagents support auto-compaction using the same logic as the main conversation.

Default:
- roughly 95% capacity

Override with:

`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`

Example:
- set it to `50` to compact earlier

Compaction events are logged in subagent transcripts with `compact_boundary` metadata.

## Example subagent patterns

### Code reviewer

Read-only specialist:
- strong after code changes
- good for quality, security, maintainability review

### Debugger

Fix-capable specialist:
- reproduce
- isolate
- fix
- verify

### Data scientist

Domain specialist:
- SQL
- BigQuery
- data analysis

### Database reader with hook validation

Fine-grained Bash restriction:
- Bash allowed
- only read-only queries permitted through a hook validator

## Important boundary

Subagents cannot spawn other subagents.

If you need nested delegation:
- chain subagents from the main conversation
- or use skills where that fits better

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/manifest.json)
- [examples/code-reviewer.md](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/examples/code-reviewer.md)
- [examples/debugger.md](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/examples/debugger.md)
- [examples/data-scientist.md](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/examples/data-scientist.md)
- [examples/db-reader.md](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/examples/db-reader.md)
