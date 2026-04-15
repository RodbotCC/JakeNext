---
name: automate-workflows-with-hooks
description: Claude Code reference entry for using hooks to automate workflow steps, enforce deterministic project rules, send notifications, inject context, reload environments, audit configuration changes, and auto-handle selected permission prompts.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Automate Workflows With Hooks

This is a focused Claude Code reference entry for practical hook automation.

## What this entry covers

- what hooks are for
- how to add your first hook
- where hook configuration lives
- common workflow automations
- deterministic enforcement vs prompt-based judgment
- representative examples for notifications, formatting, file protection, context reinjection, environment reloads, auditing, and permission automation

## Core judgment

Hooks are the deterministic muscle of Claude Code.

Use hooks when you need:
- guaranteed automation
- guaranteed validation
- guaranteed policy enforcement

Do not rely on the model to remember to do the same repetitive thing forever when a hook can make it automatic.

For decisions requiring judgment instead of fixed rules:
- use prompt-based hooks
- or agent-based hooks

For other extension surfaces:
- use skills for reusable instructions and commands
- use subagents for isolated worker flows
- use plugins for packaged extensions

## What hooks are

Hooks are user-defined shell commands that run at specific points in Claude Code's lifecycle.

They let you:
- automate repetitive actions
- enforce project rules
- integrate with existing tools
- inject or validate information at the right moment

## Set up your first hook

The basic shape is:
- add a `hooks` block to a settings file
- choose the event
- choose a matcher if needed
- define one or more command hooks

Example notification hook in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

## How to inspect hooks

Use:

`/hooks`

The hooks browser is read-only. Use it to:
- inspect configured hooks
- verify event coverage
- confirm matchers and source files

To actually add or change hooks:
- edit settings JSON
- or ask Claude to edit it

## Where hooks live

This page’s examples use:
- `~/.claude/settings.json`
- `.claude/settings.json`

Use project settings when the behavior belongs to the repository.
Use user settings when the behavior should follow you everywhere.

## Common automation patterns

### 1. Notifications

Use `Notification` when Claude needs input or approval.

This is the classic "stop babysitting the terminal" hook.

### 2. Auto-format after edits

Use `PostToolUse` with `Edit|Write` to run formatting after file changes.

Example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

This is one of the best hook patterns because it keeps formatting deterministic instead of optional.

### 3. Block edits to protected files

Use `PreToolUse` with `Edit|Write` and a script that exits with code `2` when a protected path is targeted.

Good targets:
- `.env`
- lockfiles
- `.git/`

### 4. Re-inject context after compaction

Use `SessionStart` with matcher `compact` to add back critical reminders after compaction.

This is a nice move when certain conventions or sprint context must survive summarization.

### 5. Audit config changes

Use `ConfigChange` to log settings or skills changes.

This is especially useful for:
- compliance
- debugging
- understanding why behavior shifted mid-session

### 6. Reload environment on directory or file changes

Use:
- `CwdChanged`
- or `FileChanged`

This is strong for `direnv`-style setups where Bash environment state must follow the current directory or watched files.

### 7. Auto-approve narrow permission prompts

Use `PermissionRequest` and emit a JSON allow decision on stdout.

This is powerful and sharp. Keep the matcher narrow.

## Deterministic blocking and feedback

Several hook patterns rely on exiting with code `2`.

That means:
- the action is blocked
- feedback is passed back to Claude

This is ideal when you want a hard rule with a clear explanation.

## Stdout as context or decision channel

Hooks can communicate through stdout.

Typical uses:
- inject reminder text into context
- emit structured decision JSON for permission handling
- write dynamic environment exports into `CLAUDE_ENV_FILE`

## Practical examples

### Get notified when Claude needs input

Event:
- `Notification`

Best for:
- long waits
- permission prompts
- multitasking away from the terminal

### Auto-format code after edits

Event:
- `PostToolUse`

Matcher:
- `Edit|Write`

Best for:
- Prettier
- formatter pipelines
- deterministic formatting enforcement

### Block edits to protected files

Event:
- `PreToolUse`

Matcher:
- `Edit|Write`

Best for:
- secrets
- lockfiles
- protected infra paths

### Re-inject context after compaction

Event:
- `SessionStart`

Matcher:
- `compact`

Best for:
- project conventions
- sprint reminders
- dynamic context such as recent commits

### Audit configuration changes

Event:
- `ConfigChange`

Best for:
- compliance
- change tracking
- settings or skills observability

### Reload environment when directory or files change

Events:
- `CwdChanged`
- `FileChanged`

Best for:
- `direnv`
- environment-sensitive projects
- keeping Bash in sync with working context

### Auto-approve specific permission prompts

Event:
- `PermissionRequest`

Best for:
- very narrow trusted cases like `ExitPlanMode`

Danger:
- broad matchers can accidentally auto-approve far too much

## Strong safety advice

Keep matchers as narrow as possible.

Especially for:
- `PermissionRequest`
- `PreToolUse`
- anything that blocks or allows execution

An empty matcher or `.*` on the wrong hook can get stupid fast.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/manifest.json)
- [examples/notification-macos.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/notification-macos.json)
- [examples/post-edit-prettier.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/post-edit-prettier.json)
- [examples/protect-files-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/protect-files-settings.json)
- [examples/protect-files.sh](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/protect-files.sh)
- [examples/sessionstart-compact-reminder.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/sessionstart-compact-reminder.json)
- [examples/config-change-audit.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/config-change-audit.json)
- [examples/filechanged-direnv.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/filechanged-direnv.json)
- [examples/permissionrequest-exit-plan-mode.json](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/examples/permissionrequest-exit-plan-mode.json)
