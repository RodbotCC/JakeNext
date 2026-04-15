---
name: configure-subagents
description: Claude Code reference entry for defining, scoping, and listing subagents. Use when creating project, user, plugin, managed, or session-scoped subagents and when resolving precedence between duplicate agent names.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Configure Subagents

This is a focused Claude Code reference entry for configuring subagents.

## What this entry covers

- using `/agents` as the primary interface
- listing agents from the CLI with `claude agents`
- choosing the right scope for a subagent
- precedence rules when names collide
- the `--agents` JSON format for session-only agents
- plugin and managed-agent caveats
- how subagents apply to agent teams

## Core judgment

The right default is:
- use `/agents` for normal creation and editing
- use `.claude/agents/` for project-specific subagents you want in version control
- use `~/.claude/agents/` for your personal reusable agents
- use `--agents` for one-off session injection and automation

## Fast map

### Recommended UI

Run:

`/agents`

Use it to:
- view all available subagents
- create new subagents
- edit tool access and configuration
- delete custom subagents
- see which definitions are active when duplicates exist

### Non-interactive listing

Run:

`claude agents`

This lists configured agents by source and shows which ones are overridden by higher-priority definitions.

## Scope and precedence

Higher-priority definitions win when multiple subagents share the same name.

| Location | Scope | Priority |
| --- | --- | --- |
| Managed settings | Organization-wide | 1 |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin `agents/` directory | Where plugin is enabled | 5 |

## Practical guidance

### Project subagents

Use `.claude/agents/` when the subagent belongs to the codebase itself.

Why this is strong:
- team-visible
- check-in friendly
- easy to evolve collaboratively

Important detail:
- Claude Code discovers project subagents by walking up from the current working directory
- directories added with `--add-dir` grant file access only and are not scanned for agents

### User subagents

Use `~/.claude/agents/` for personal agents you want available everywhere.

### Session-scoped subagents

Use `--agents` when you want fast testing or automation without writing files to disk.

### Managed subagents

These are organization-deployed and take precedence over project and user agents with the same name.

### Plugin subagents

These come from installed plugins and appear alongside your other subagents, but they have security restrictions.

Plugin subagents do **not** support:
- `hooks`
- `mcpServers`
- `permissionMode`

If you need those fields, copy the agent into `.claude/agents/` or `~/.claude/agents/`.

## `--agents` JSON shape

The `--agents` flag accepts JSON using the same frontmatter fields as file-based agents.

Fields called out in the docs:
- `description`
- `prompt`
- `tools`
- `disallowedTools`
- `model`
- `permissionMode`
- `mcpServers`
- `hooks`
- `maxTurns`
- `skills`
- `initialPrompt`
- `memory`
- `effort`
- `background`
- `isolation`
- `color`

For CLI-defined subagents:
- `prompt` is the system prompt equivalent
- these agents only exist for the current session
- they are not saved to disk

## Agent teams

Subagent definitions from these scopes can also be used for teammates.

When a teammate references a subagent type:
- the teammate uses that definition's tools and model
- the subagent body is appended to the teammate's system prompt as additional instructions

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/configure-subagents/manifest.json)
- [examples/project_agent.md](/Users/jakeaaron/Documents/Storie/claude-code/configure-subagents/examples/project_agent.md)
- [examples/session_agents.json](/Users/jakeaaron/Documents/Storie/claude-code/configure-subagents/examples/session_agents.json)
- [examples/session_agents.sh](/Users/jakeaaron/Documents/Storie/claude-code/configure-subagents/examples/session_agents.sh)
