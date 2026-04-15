---
name: hooks-reference
description: Claude Code reference entry for hook locations, matcher behavior, hook handler types, hook input and output contracts, event-specific control patterns, async hooks, security considerations, and debugging.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Hooks Reference

This is a focused Claude Code reference entry for the full hook system.

## What this entry covers

- hook locations and scope
- matcher patterns
- hook handler types
- command and HTTP hook I/O
- JSON decision control
- major hook event families
- prompt and agent hooks
- async hooks
- security and debugging

## Core judgment

Hooks are the deterministic control plane for Claude Code.

If skills are “reusable workflows” and subagents are “isolated workers,” hooks are:
- policy
- enforcement
- automation
- instrumentation

This is the layer you use when you need something to happen every time, not when you hope the model remembers to do it.

## Hook locations

Where you define a hook determines its scope.

| Location | Scope | Shareable |
|---|---|---|
| `~/.claude/settings.json` | all projects | no |
| `.claude/settings.json` | one project | yes |
| `.claude/settings.local.json` | one project | no |
| managed policy settings | org-wide | yes |
| plugin `hooks/hooks.json` | when plugin is enabled | yes |
| skill or agent frontmatter | while component is active | yes |

Important managed-policy detail:
- enterprise admins can use `allowManagedHooksOnly` to block user, project, and plugin hooks

## Matchers

The `matcher` field is a regex string that filters when a hook group fires.

Use:
- `"*"`
- `""`
- or omit `matcher`

to match everything.

### What matcher runs against

Each event matches against a different field.

High-signal examples:
- tool events match on tool name
- `SessionStart` matches on source like `startup` or `resume`
- `Notification` matches on notification type
- `ConfigChange` matches on configuration source
- `InstructionsLoaded` matches on load reason
- `Elicitation` matches on MCP server name

Some events do not support matchers at all and always fire:
- `UserPromptSubmit`
- `Stop`
- `TeammateIdle`
- `TaskCreated`
- `TaskCompleted`
- `WorktreeCreate`
- `WorktreeRemove`
- `CwdChanged`

If you add a matcher to those, it is ignored.

### Tool-event matcher examples

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/lint-check.sh"
          }
        ]
      }
    ]
  }
}
```

### MCP tool matching

MCP tools use names like:

```text
mcp__memory__create_entities
mcp__filesystem__read_file
mcp__github__search_repositories
```

So patterns like these are valid:
- `mcp__memory__.*`
- `mcp__.*__write.*`

## The `if` field

On tool events, individual handlers can also use:

```json
"if": "Bash(git *)"
```

This filters on:
- tool name
- and tool arguments together

`if` uses permission-rule syntax, not regex syntax.

Important limit:
- `if` only works on tool events
- on any other event, a hook with `if` set never runs

## Hook handler types

There are four hook types.

## Command hooks

```json
{
  "type": "command",
  "command": "/path/to/script.sh"
}
```

These:
- receive JSON on stdin
- return decisions through exit codes, stdout, and stderr

## HTTP hooks

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/pre-tool-use"
}
```

These:
- receive the same JSON as a POST body
- return decisions through the HTTP response body

## Prompt hooks

```json
{
  "type": "prompt",
  "prompt": "Evaluate whether Claude should stop. $ARGUMENTS"
}
```

These:
- send the hook input plus your prompt to a Claude model
- expect a simple JSON response like `{ "ok": true }`

## Agent hooks

```json
{
  "type": "agent",
  "prompt": "Verify tests pass. $ARGUMENTS"
}
```

These:
- spawn a subagent with tool access
- allow multi-turn verification work

## Common handler fields

All hook types share:
- `type`
- `if`
- `timeout`
- `statusMessage`

Skills also support:
- `once`

### Type-specific fields

Command hooks add:
- `command`
- `async`
- `shell`

HTTP hooks add:
- `url`
- `headers`
- `allowedEnvVars`

Prompt and agent hooks add:
- `prompt`
- `model`

## Referencing scripts safely

Use environment variables when pointing at scripts:

- `$CLAUDE_PROJECT_DIR`
- `${CLAUDE_PLUGIN_ROOT}`
- `${CLAUDE_PLUGIN_DATA}`

Example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook input

Command hooks receive JSON on stdin.

HTTP hooks receive the same JSON as the POST body.

### Common input fields

Most events include:
- `session_id`
- `transcript_path`
- `cwd`
- `hook_event_name`

Often also:
- `permission_mode`

When hooks run inside a subagent or `--agent` context, they may also include:
- `agent_id`
- `agent_type`

## Command-hook output and exit codes

For command hooks, the output contract is:
- `stdout`
- `stderr`
- exit code

### Exit code 0

- success
- JSON on stdout is parsed
- plain stdout may be added as context for some events

### Exit code 2

- blocking error
- stdout JSON is ignored
- stderr is used as the feedback channel

### Any other non-zero exit code

- non-blocking error for most events
- execution usually continues

Important exception:
- `WorktreeCreate` treats any non-zero exit code as failure

## Exit code 2 by event

The effect of exit code 2 depends on the event.

### Events where it blocks or stops something

- `PreToolUse`
- `PermissionRequest`
- `UserPromptSubmit`
- `Stop`
- `SubagentStop`
- `TeammateIdle`
- `TaskCreated`
- `TaskCompleted`
- `ConfigChange`
- `Elicitation`
- `ElicitationResult`
- `WorktreeCreate`

### Events where it cannot undo what already happened

- `PostToolUse`
- `PostToolUseFailure`
- `Notification`
- `SessionStart`
- `SessionEnd`
- `PreCompact`
- `PostCompact`
- `CwdChanged`
- `FileChanged`
- `InstructionsLoaded`
- `StopFailure`
- `WorktreeRemove`

So the timing of the event matters as much as the exit code.

## HTTP hook response behavior

HTTP hooks translate this same model into response handling.

### Success forms

- `2xx` with empty body
- `2xx` with plain text body
- `2xx` with JSON body

### Failure forms

- non-2xx
- timeout
- connection failure

These are non-blocking errors by default.

Important detail:
- HTTP status codes alone do not block actions
- to block, return `2xx` plus the right JSON decision payload

## JSON output

Exit codes give you rough control.

JSON output gives you structured control.

General fields available across hooks include:
- `continue`
- `stopReason`
- `suppressOutput`
- `systemMessage`

### Big rule

Choose one signaling style per hook:
- exit-code control
- or exit `0` and return JSON

If you exit `2`, Claude Code ignores any JSON on stdout.

### Output size limit

Hook output injected into context is capped at:

```text
10,000 characters
```

Larger output is written to a file and replaced with a preview plus path.

## Decision control patterns

Different events use different JSON decision shapes.

## Top-level `decision: "block"`

Used by:
- `UserPromptSubmit`
- `PostToolUse`
- `PostToolUseFailure`
- `Stop`
- `SubagentStop`
- `ConfigChange`

Example:

```json
{
  "decision": "block",
  "reason": "Test suite must pass before proceeding"
}
```

## `PreToolUse` hookSpecificOutput

`PreToolUse` is richer and uses:
- `permissionDecision`
- `permissionDecisionReason`
- `updatedInput`
- `additionalContext`

Possible decisions:
- `allow`
- `deny`
- `ask`
- `defer`

Precedence when multiple hooks disagree:

```text
deny > defer > ask > allow
```

## `PermissionRequest` decision object

Uses:
- `decision.behavior`
- `updatedInput`
- `updatedPermissions`
- `message`
- `interrupt`

## `PermissionDenied`

Can return:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionDenied",
    "retry": true
  }
}
```

to tell the model it may retry after auto-mode denial.

## Worktree events

`WorktreeCreate` is path-return-based, not allow/block-based.

Command hooks must print the created path on stdout.

HTTP hooks must return:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "WorktreeCreate",
    "worktreePath": "/absolute/path"
  }
}
```

## Event families

The full hook reference is big, but the events fall into clear families.

## Session and instruction lifecycle

- `SessionStart`
- `InstructionsLoaded`
- `SessionEnd`
- `PreCompact`
- `PostCompact`

These are mostly about:
- startup context
- observability
- compaction
- teardown

Important note:
- `SessionStart` only supports command hooks

## Prompt and stop control

- `UserPromptSubmit`
- `Stop`
- `StopFailure`

These control:
- prompt filtering
- whether Claude is allowed to stop
- failure reporting when the turn ends with an API error

Important `Stop` note:
- `stop_hook_active` exists specifically so you do not accidentally create infinite continue loops

## Tool lifecycle

- `PreToolUse`
- `PermissionRequest`
- `PostToolUse`
- `PostToolUseFailure`
- `PermissionDenied`

This is the core enforcement layer for:
- validation
- auto-approval
- input rewriting
- post-execution feedback

## Subagents, teams, and tasks

- `SubagentStart`
- `SubagentStop`
- `TaskCreated`
- `TaskCompleted`
- `TeammateIdle`

This family is where hooks start acting like workflow governors instead of just permission filters.

## File system and environment changes

- `ConfigChange`
- `CwdChanged`
- `FileChanged`
- `WorktreeCreate`
- `WorktreeRemove`

Important environment note:
- `CLAUDE_ENV_FILE` is available to `SessionStart`, `CwdChanged`, and `FileChanged`

## MCP interaction events

- `Notification`
- `Elicitation`
- `ElicitationResult`

These become especially important once sessions are connected to richer MCP systems.

## SessionStart specifics

`SessionStart` supports matchers on:
- `startup`
- `resume`
- `clear`
- `compact`

Its most special capability is:
- appending `additionalContext`
- writing exports into `CLAUDE_ENV_FILE`

This is one of the highest-leverage hooks in the whole system.

## InstructionsLoaded specifics

`InstructionsLoaded` is observability-only.

It tells you:
- which instruction file loaded
- why it loaded
- scope
- trigger path for lazy loads

It cannot block anything.

This is great for debugging complicated `CLAUDE.md` and `.claude/rules/` behavior.

## PreToolUse specifics

This is the sharpest hook in the system.

It can:
- allow
- deny
- ask
- defer
- rewrite tool input
- add context before execution

It also supports detailed per-tool schemas for tools like:
- `Bash`
- `Write`
- `Edit`
- `Read`
- `Glob`
- `Grep`
- `WebFetch`
- `WebSearch`
- `Agent`
- `AskUserQuestion`

## Deferring tool calls

`defer` is for non-interactive `-p` integrations that need to pause at a tool call, collect input elsewhere, and resume later.

Important limits:
- only works in `-p` mode
- requires Claude Code `v2.1.89+`
- only works when Claude made a single tool call in the turn

This is mainly for custom UIs and SDK wrappers, not ordinary interactive terminal use.

## Prompt hooks and agent hooks

Prompt hooks support:
- `type: "prompt"`
- single-turn LLM evaluation
- `{ "ok": true/false, "reason": "..." }`

Agent hooks support:
- `type: "agent"`
- multi-turn tool-based verification
- same response schema

### Good mental split

Use prompt hooks when:
- hook input alone is enough to decide

Use agent hooks when:
- the hook needs to inspect files, search code, or run checks

## Async hooks

Command hooks can run with:

```json
"async": true
```

This means:
- the hook runs in the background
- Claude continues immediately
- decision fields no longer matter

Async hooks are good for:
- long test suites
- deployments
- reporting
- logging

Important limits:
- only command hooks can be async
- output is delivered on the next conversation turn
- there is no deduplication across repeated async firings

## Hooks in skills and agents

Hooks can also live inside:
- skill frontmatter
- agent frontmatter

They use the same configuration format, but their lifetime is scoped to the component.

Subagent `Stop` hooks are automatically converted to:
- `SubagentStop`

## The `/hooks` menu

`/hooks` is a read-only browser for configured hooks.

It shows:
- hook counts by event
- matcher groupings
- handler type
- source
- full command, prompt, or URL

Source labels include:
- User
- Project
- Local
- Plugin
- Session
- Built-in

This is the easiest sanity-check tool before you start debugging with logs.

## Disable hooks

To remove a hook:
- delete it from settings

To disable all hooks temporarily:

```json
{
  "disableAllHooks": true
}
```

Important managed-policy detail:
- lower-level `disableAllHooks` cannot disable managed hooks

## Security

This is the dangerous part, and the docs are right to be blunt.

Command hooks run with your user’s full permissions.

That means they can:
- read files
- modify files
- delete files
- exfiltrate data

if you write them badly.

### Best practices

- validate and sanitize input
- always quote shell variables
- block path traversal
- use absolute paths
- skip sensitive paths like `.env`, `.git/`, keys, and secrets

## Windows PowerShell hooks

Command hooks can specify:

```json
"shell": "powershell"
```

This does not require `CLAUDE_CODE_USE_POWERSHELL_TOOL`, because hooks spawn PowerShell directly.

## Debugging hooks

Use:

```sh
claude --debug-file /tmp/claude.log
```

or:

```sh
claude --debug
```

then inspect the debug log.

For more granular hook matching and execution details, set:

```sh
CLAUDE_CODE_DEBUG_LOG_LEVEL=verbose
```

This is where you can see:
- which hooks matched
- exit codes
- stdout
- stderr
- matcher counts

## Practical advice

The cleanest way to work with hooks is:
- use settings-based hooks for persistent policy
- use skill/agent hooks for component-local rules
- use `PreToolUse` for prevention
- use `PostToolUse` for feedback
- use `InstructionsLoaded` and debug logs for observability
- use async hooks only when blocking behavior is genuinely unnecessary

This system is powerful enough to become a mess if you spray it everywhere, so scoping and naming discipline matter a lot.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/manifest.json)
- [examples/hook-locations.md](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/hook-locations.md)
- [examples/matcher-cheatsheet.md](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/matcher-cheatsheet.md)
- [examples/pretooluse-decision.json](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/pretooluse-decision.json)
- [examples/permissionrequest-decision.json](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/permissionrequest-decision.json)
- [examples/worktreecreate-output.json](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/worktreecreate-output.json)
- [examples/async-posttooluse.json](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/async-posttooluse.json)
- [examples/claude-env-file.sh](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/claude-env-file.sh)
- [examples/security-checklist.md](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/examples/security-checklist.md)
