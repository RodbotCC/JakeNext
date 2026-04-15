---
name: how-hooks-work
description: Claude Code reference entry for hook runtime behavior, events, stdin/stdout contracts, exit codes, structured JSON output, matchers, if-field filtering, and hook locations. Use when you need the mechanics of the hooks system rather than ready-made automation examples.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# How Hooks Work

This is a focused Claude Code reference entry for the mechanics of hooks.

## What this entry covers

- when hook events fire
- how matching hooks are executed
- stdin input and stdout/stderr output contracts
- exit code semantics
- structured JSON output
- matchers
- `if` filters
- where hooks can be configured

## Core judgment

Hooks are not magic decorations. They are a runtime decision system.

To use them well, you need to understand:
- when they fire
- what input they receive
- how they communicate decisions back
- how multiple hooks combine

Once you get that model, the rest stops feeling mysterious.

## Event execution model

Hook events fire at specific lifecycle points in Claude Code.

When an event fires:
- all matching hooks run in parallel
- identical hook commands are deduplicated automatically

## Hook events

| Event | When it fires |
| --- | --- |
| `SessionStart` | When a session begins or resumes |
| `UserPromptSubmit` | When you submit a prompt, before Claude processes it |
| `PreToolUse` | Before a tool call executes |
| `PermissionRequest` | When a permission dialog appears |
| `PermissionDenied` | When a tool call is denied by auto mode |
| `PostToolUse` | After a tool call succeeds |
| `PostToolUseFailure` | After a tool call fails |
| `Notification` | When Claude Code sends a notification |
| `SubagentStart` | When a subagent is spawned |
| `SubagentStop` | When a subagent finishes |
| `TaskCreated` | When a task is being created |
| `TaskCompleted` | When a task is being marked complete |
| `Stop` | When Claude finishes responding |
| `StopFailure` | When the turn ends due to an API error |
| `TeammateIdle` | When an agent team teammate is about to go idle |
| `InstructionsLoaded` | When `CLAUDE.md` or `.claude/rules/*.md` is loaded |
| `ConfigChange` | When a configuration file changes during a session |
| `CwdChanged` | When the working directory changes |
| `FileChanged` | When a watched file changes on disk |
| `WorktreeCreate` | When a worktree is being created |
| `WorktreeRemove` | When a worktree is being removed |
| `PreCompact` | Before context compaction |
| `PostCompact` | After context compaction completes |
| `Elicitation` | When an MCP server requests user input |
| `ElicitationResult` | After the user responds to an MCP elicitation |
| `SessionEnd` | When a session terminates |

## How multiple hook results combine

Each matching hook returns its own result.

Claude Code resolves them conservatively.

Examples:
- if one `PreToolUse` hook returns `deny`, the tool call is canceled
- if one hook returns `ask`, the permission prompt is shown even if others return `allow`
- `additionalContext` from multiple hooks is kept and passed through together

This means the system tends toward the most restrictive effective answer.

## Hook types

Most hooks use:
- `"type": "command"`

Three other types exist:
- `"type": "http"`
- `"type": "prompt"`
- `"type": "agent"`

This entry focuses on the general runtime model. The page you gave is mostly describing command hooks plus the shared decision model.

## Input model

Claude Code sends event-specific JSON to the hook through stdin.

Common fields include:
- `session_id`
- `cwd`
- `hook_event_name`

Tool-related events also include tool-specific fields such as:
- `tool_name`
- `tool_input`

Example `PreToolUse` input for a Bash command:

```json
{
  "session_id": "abc123",
  "cwd": "/Users/sarah/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

## Output model

Hooks communicate through:
- stdout
- stderr
- exit code

Example blocking script:

```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q "drop table"; then
  echo "Blocked: dropping tables is not allowed" >&2
  exit 2
fi

exit 0
```

## Exit codes

### Exit `0`

The action proceeds.

Special note:
- for `UserPromptSubmit` and `SessionStart`, stdout can be injected into Claude's context

### Exit `2`

The action is blocked.

Best practice:
- write the reason to stderr
- Claude receives that feedback and can adjust

### Any other exit code

The action still proceeds.

What happens:
- transcript gets a one-line error notice
- full stderr goes to the debug log

## Structured JSON output

Exit codes give you a coarse allow/block model.

If you want more control:
- exit `0`
- print JSON to stdout

Important rule:
- do not mix exit `2` blocking with JSON output
- if you exit `2`, Claude Code ignores the JSON

## Example structured decision

Example `PreToolUse` decision payload:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

For `PreToolUse`, the main decision values are:
- `allow`
- `deny`
- `ask`

And in non-interactive `-p` mode:
- `defer`

### Important nuance about `allow`

Returning `allow` skips the interactive prompt, but it does **not** override deny rules.

If another deny rule matches:
- the call is still blocked

If an ask rule matches:
- the user is still prompted

So hook approval does not beat stricter permission rules.

## Event-specific decision patterns

Different events use different JSON structures.

Examples from the docs:
- `PreToolUse` uses `hookSpecificOutput.permissionDecision`
- `PostToolUse` and `Stop` use top-level `decision: "block"`
- `PermissionRequest` uses `hookSpecificOutput.decision.behavior`

So you cannot blindly reuse one event's JSON format for another.

## Matchers

Without a matcher:
- the hook runs on every occurrence of its event

With a matcher:
- the hook runs only for matching cases

Example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "prettier --write ..." }
        ]
      }
    ]
  }
}
```

This matcher targets the tool name.

## What each matcher filters

| Event family | Matcher filters |
| --- | --- |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied` | Tool name |
| `SessionStart` | Session start source |
| `SessionEnd` | Session end reason |
| `Notification` | Notification type |
| `SubagentStart`, `SubagentStop` | Agent type |
| `PreCompact`, `PostCompact` | Compaction trigger |
| `ConfigChange` | Configuration source |
| `StopFailure` | Error type |
| `InstructionsLoaded` | Load reason |
| `Elicitation`, `ElicitationResult` | MCP server name |
| `FileChanged` | Filename basename |
| `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `CwdChanged` | No matcher support |

## `if` field

The `if` field is a more precise filter layer than matcher.

Version note:
- requires Claude Code `v2.1.85` or later
- earlier versions ignore it

### What it does

`matcher` filters at the group level, usually by tool name.

`if` filters by:
- tool name
- plus arguments

So the hook process only spawns when the full permission-rule-style pattern matches.

Example:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(git *)",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-git-policy.sh"
          }
        ]
      }
    ]
  }
}
```

This means:
- only Bash calls that start with `git` spawn the hook process

### Scope of `if`

`if` only works on tool events:
- `PreToolUse`
- `PostToolUse`
- `PostToolUseFailure`
- `PermissionRequest`
- `PermissionDenied`

If you add `if` to other events:
- the hook does not run

## Hook locations

Where you define a hook determines its scope.

| Location | Scope | Shareable |
| --- | --- | --- |
| `~/.claude/settings.json` | All your projects | No |
| `.claude/settings.json` | Single project | Yes |
| `.claude/settings.local.json` | Single project | No |
| Managed policy settings | Organization-wide | Yes |
| Plugin `hooks/hooks.json` | When plugin is enabled | Yes |
| Skill or agent frontmatter | While the skill or agent is active | Yes |

## Discoverability and global disable

Use:

`/hooks`

to browse configured hooks grouped by event.

To disable all hooks:

```json
{
  "disableAllHooks": true
}
```

## Live settings changes

If you edit settings files directly while Claude Code is running, the file watcher usually picks up hook changes automatically.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/manifest.json)
- [examples/pretooluse-input.json](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/examples/pretooluse-input.json)
- [examples/block-drop-table.sh](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/examples/block-drop-table.sh)
- [examples/pretooluse-decision.json](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/examples/pretooluse-decision.json)
- [examples/if-filter-bash-git.json](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/examples/if-filter-bash-git.json)
- [examples/disable-all-hooks.json](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/examples/disable-all-hooks.json)
