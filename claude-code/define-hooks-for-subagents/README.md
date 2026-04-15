---
name: define-hooks-for-subagents
description: Claude Code reference entry for configuring subagent lifecycle hooks in frontmatter and project settings. Use when validating tool usage inside a subagent or responding to subagent start and stop events from the main session.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Define Hooks For Subagents

This is a focused Claude Code reference entry for subagent hooks.

## What this entry covers

- hooks defined inside subagent frontmatter
- hooks defined in `settings.json` for subagent lifecycle events
- the difference between subagent-local and project-level scope
- common hook events and matcher behavior
- the automatic `Stop` to `SubagentStop` conversion

## Core judgment

Use:
- frontmatter hooks when the rule belongs to that subagent's own behavior
- project-level hooks when the main session should react to subagent lifecycle events

That split keeps local behavior local and session orchestration session-wide.

## Two hook locations

### 1. Subagent frontmatter

Define hooks directly in the subagent Markdown file.

These hooks:
- run only while that subagent is active
- are cleaned up when the subagent finishes

### 2. `settings.json`

Define hooks in project or user settings when the main session should respond to subagent lifecycle events.

These hooks:
- belong to the main session
- react to subagent start and stop events

## Frontmatter hook events

Subagent frontmatter supports all hook events, but the most common ones called out in the docs are:

| Event | Matcher input | When it fires |
| --- | --- | --- |
| `PreToolUse` | Tool name | Before the subagent uses a tool |
| `PostToolUse` | Tool name | After the subagent uses a tool |
| `Stop` | none | When the subagent finishes |

Important detail:
- `Stop` hooks in subagent frontmatter are automatically converted to `SubagentStop` at runtime

## Frontmatter example

```md
---
name: code-reviewer
description: Review code changes with automatic linting
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh $TOOL_INPUT"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

### Why this is strong

This pattern is great when:
- one subagent has its own execution discipline
- you want validation before a specific tool
- or cleanup/verification after specific tool calls

## Project-level subagent lifecycle hooks

In `settings.json`, the main session can react to:

| Event | Matcher input | When it fires |
| --- | --- | --- |
| `SubagentStart` | Agent type name | When a subagent begins execution |
| `SubagentStop` | Agent type name | When a subagent completes |

These support matchers so you can target:
- one specific subagent
- or all subagents

## `settings.json` example

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          { "type": "command", "command": "./scripts/setup-db-connection.sh" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command", "command": "./scripts/cleanup-db-connection.sh" }
        ]
      }
    ]
  }
}
```

## Practical split

### Put hooks in frontmatter when

- the rule belongs to the subagent itself
- the validation is tool-specific
- the behavior should travel with the subagent definition

Examples:
- validate Bash before execution
- run lint after `Edit` or `Write`
- enforce a subagent-specific discipline

### Put hooks in `settings.json` when

- the main session needs to orchestrate setup or cleanup
- the rule depends on subagent lifecycle rather than tool use
- you want one project-level behavior for multiple agents

Examples:
- open a temporary resource when `db-agent` starts
- tear down shared resources whenever any subagent stops

## Matcher behavior

For frontmatter hooks:
- matcher input is the tool name

For project-level subagent lifecycle hooks:
- matcher input is the agent type name

That means the matcher target changes depending on which event family you are using.

## Mental model

Think of it this way:

Frontmatter hooks:
- "while I am this subagent, enforce these local rules"

Project-level hooks:
- "when subagents start or stop in this session, run these orchestration rules"

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/define-hooks-for-subagents/manifest.json)
- [examples/code-reviewer.md](/Users/jakeaaron/Documents/Storie/claude-code/define-hooks-for-subagents/examples/code-reviewer.md)
- [examples/db-agent-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/define-hooks-for-subagents/examples/db-agent-settings.json)
- [examples/cleanup-all-subagents-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/define-hooks-for-subagents/examples/cleanup-all-subagents-settings.json)
