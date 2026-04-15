---
name: write-subagent-files
description: Claude Code reference entry for authoring subagent Markdown files with YAML frontmatter. Use when creating or editing file-based subagents, choosing frontmatter fields, or understanding how the body becomes the subagent system prompt.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Write Subagent Files

This is a focused Claude Code reference entry for authoring file-based subagents.

## What this entry covers

- the basic file format for subagents
- how YAML frontmatter and Markdown body divide responsibility
- supported frontmatter fields
- inheritance behavior and important defaults
- what happens when you add a file manually

## Core judgment

The clean default for most file-based subagents is:
- keep frontmatter minimal
- make `description` delegation-friendly
- keep the body sharp and specific
- add advanced fields only when the subagent really needs them

## File structure

Subagent files are Markdown files with YAML frontmatter followed by the body prompt:

```md
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

## What each part does

### Frontmatter

The frontmatter defines:
- identity
- delegation metadata
- tool/model configuration
- execution behavior

### Body

The Markdown body becomes the subagent's system prompt.

Important detail:
- subagents receive this prompt plus basic environment details like working directory
- they do **not** receive the full Claude Code system prompt

## Loading behavior

Subagents are loaded at session start.

If you manually add a file:
- restart the session
- or use `/agents` to load it immediately

## Required fields

Only these are required:
- `name`
- `description`

### `name`

Use:
- lowercase letters
- hyphens

Treat it as a stable identifier.

### `description`

This should explain when Claude should delegate to the subagent.

Good descriptions are:
- short
- concrete
- delegation-oriented

## Supported frontmatter fields

### Identity and delegation

- `name`
- `description`

### Tool control

- `tools`
  Tools the subagent can use. If omitted, the subagent inherits all tools.

- `disallowedTools`
  Tools to deny, removing them from the inherited or explicit list.

### Model and execution behavior

- `model`
  `sonnet`, `opus`, `haiku`, a full model ID, or `inherit`

- `permissionMode`
  `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, or `plan`

- `maxTurns`
  Maximum number of agentic turns before stopping

- `effort`
  `low`, `medium`, `high`, or `max` for Opus 4.6 only

- `background`
  Set to `true` to always run as a background task

- `isolation`
  Set to `worktree` to run in a temporary git worktree

### Context and startup behavior

- `skills`
  Skills injected into the subagent context at startup

- `initialPrompt`
  First user turn when the agent runs as the main session agent

- `memory`
  Persistent memory scope: `user`, `project`, or `local`

### Integrations and hooks

- `mcpServers`
  Either existing configured server names or inline server definitions

- `hooks`
  Lifecycle hooks scoped to the subagent

### Display

- `color`
  `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, or `cyan`

## Important behavioral notes

### Tool inheritance

If `tools` is omitted:
- the subagent inherits all tools

If `disallowedTools` is present:
- those tools are removed from the effective set

### Skill inheritance

Subagents do **not** inherit skills from the parent conversation.

If you want skills available at startup:
- declare them in `skills`

### Main-session startup behavior

`initialPrompt` only matters when the subagent runs as the main session agent via:
- `--agent`
- or the agent setting

### Worktree isolation

If `isolation: worktree` is used:
- the subagent gets an isolated temporary worktree
- it is automatically cleaned up if no changes are made

## Practical authoring advice

For most subagents:
- keep the `description` about when to use it
- keep the body about how it should think and act
- avoid stuffing every possible field in on day one

The best subagent files feel deliberate, not maximalist.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/manifest.json)
- [examples/minimal-reviewer.md](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/examples/minimal-reviewer.md)
- [examples/advanced-debugger.md](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/examples/advanced-debugger.md)
- [examples/background-researcher.md](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/examples/background-researcher.md)
