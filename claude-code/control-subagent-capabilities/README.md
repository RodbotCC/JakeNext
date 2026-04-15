---
name: control-subagent-capabilities
description: Claude Code reference entry for limiting and extending subagent behavior through tools, Agent allowlists, MCP server scoping, permission modes, skills, memory, hooks, and deny rules.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Control Subagent Capabilities

This is a focused Claude Code reference entry for controlling what subagents can do.

## What this entry covers

- tool allowlists and denylists
- restricting which subagents a main-thread agent can spawn
- scoping MCP servers to a subagent
- permission modes and precedence rules
- preloading skills
- enabling persistent memory
- conditional rules with hooks
- disabling specific subagents through deny rules

## Core judgment

The clean default is:
- start narrow
- grant only the tools or behaviors the subagent actually needs
- use project memory when you want sharable learning
- use hooks when you need conditional control instead of crude all-or-nothing blocking

## Tool access

By default, subagents inherit all tools from the main conversation, including MCP tools.

You can control tool access with:
- `tools`
- `disallowedTools`

### `tools`

Treat this as an allowlist.

Example:

```md
---
name: safe-researcher
description: Research agent with restricted capabilities
tools: Read, Grep, Glob, Bash
---
```

This subagent can use only:
- `Read`
- `Grep`
- `Glob`
- `Bash`

It cannot use:
- file-writing tools
- MCP tools
- anything else outside that list

### `disallowedTools`

Treat this as a denylist over the inherited tool pool.

Example:

```md
---
name: no-writes
description: Inherits every tool except file writes
disallowedTools: Write, Edit
---
```

This keeps everything except:
- `Write`
- `Edit`

### If both are set

Order matters:
- `disallowedTools` is applied first
- then `tools` is resolved against what remains

If a tool appears in both:
- it is removed

## Restrict which subagents can be spawned

When an agent runs as the main thread via `claude --agent`, it can use the `Agent` tool to spawn subagents.

You can restrict which subagent types it may spawn with:

`Agent(agent_type)`

Example:

```md
---
name: coordinator
description: Coordinates work across specialized agents
tools: Agent(worker, researcher), Read, Bash
---
```

This is an allowlist:
- only `worker`
- and `researcher`

If the agent tries to spawn anything else:
- the request fails
- only the allowed types appear in its prompt

### Allow any subagent

Use:

`tools: Agent, Read, Bash`

### Allow no subagents

If `Agent` is omitted entirely:
- the agent cannot spawn subagents

### Important scope note

This only matters for agents running as the main thread with `claude --agent`.

Subagents cannot spawn other subagents, so `Agent(agent_type)` does nothing inside subagent definitions.

## Scope MCP servers to a subagent

Use `mcpServers` when a subagent needs MCP access that should not exist in the parent conversation.

Each list entry can be:
- a string referencing an already-configured server
- an inline server definition

Example:

```md
---
name: browser-tester
description: Tests features in a real browser using Playwright
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
---
```

### Behavior

Inline servers:
- connect when the subagent starts
- disconnect when it finishes

String references:
- reuse the parent session's connection

### Why inline matters

If you want an MCP server available only to the subagent and not in the main conversation context, define it inline here instead of in `.mcp.json`.

## Permission modes

`permissionMode` controls how the subagent handles permission prompts.

Options:
- `default`
- `acceptEdits`
- `auto`
- `dontAsk`
- `bypassPermissions`
- `plan`

### Meaning

`default`
- normal prompting behavior

`acceptEdits`
- auto-accept file edits except in protected directories

`auto`
- classifier-reviewed automatic mode

`dontAsk`
- auto-deny permission prompts

`bypassPermissions`
- skip permission prompts

`plan`
- read-only exploration mode

### Precedence rules

If the parent uses `bypassPermissions`:
- that wins
- the subagent cannot override it

If the parent uses `auto`:
- the subagent inherits `auto`
- any subagent `permissionMode` value is ignored

### Protected directory note

Even with `bypassPermissions`, writes to protected directories still prompt, except for certain `.claude` paths called out in the docs.

## Preload skills

Use `skills` to inject skill content into the subagent context at startup.

Example:

```md
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---
```

Important detail:
- full skill content is injected
- subagents do not inherit skills from the parent conversation

If you want startup skill knowledge, list it explicitly.

## Enable persistent memory

Use `memory` to give the subagent a persistent directory across conversations.

Example:

```md
---
name: code-reviewer
description: Reviews code for quality and best practices
memory: user
---
```

### Scopes

`user`
- `~/.claude/agent-memory/<name-of-agent>/`
- for learning that should travel across all projects

`project`
- `.claude/agent-memory/<name-of-agent>/`
- for shareable project-specific memory

`local`
- `.claude/agent-memory-local/<name-of-agent>/`
- for project-specific memory that should stay out of version control

### Important behavior

When memory is enabled:
- the subagent gets memory instructions in its system prompt
- the first 200 lines or 25KB of `MEMORY.md` are included
- `Read`, `Write`, and `Edit` are automatically enabled so memory files can be managed

### Strong default

`project` is the recommended default when the learned knowledge belongs to the codebase and should be shareable.

## Conditional rules with hooks

Hooks are the right tool when you want dynamic restrictions instead of a coarse tool ban.

Example:

```md
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

Claude Code passes hook input as JSON on stdin.

That lets your validation script inspect the requested operation and block dangerous cases before they run.

This is especially strong when:
- one tool is needed
- but only some operations of that tool should be allowed

## Disable specific subagents

You can deny specific subagents using:

`Agent(subagent-name)`

Example in settings:

```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```

Or via CLI:

```sh
claude --disallowedTools "Agent(Explore)"
```

This works for:
- built-in subagents
- custom subagents

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/manifest.json)
- [examples/safe-researcher.md](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/examples/safe-researcher.md)
- [examples/coordinator.md](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/examples/coordinator.md)
- [examples/browser-tester.md](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/examples/browser-tester.md)
- [examples/db-reader.md](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/examples/db-reader.md)
- [examples/deny-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/examples/deny-settings.json)
