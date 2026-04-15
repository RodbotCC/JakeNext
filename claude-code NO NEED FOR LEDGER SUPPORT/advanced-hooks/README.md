---
name: advanced-hooks
description: Claude Code reference entry for prompt-based hooks, agent-based hooks, HTTP hooks, and advanced hook troubleshooting. Use when command hooks are too limited, when hook decisions require judgment or verification, or when you need to debug tricky hook behavior.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Advanced Hooks

This is a focused Claude Code reference entry for advanced hook types and hook troubleshooting.

## What this entry covers

- prompt-based hooks
- agent-based hooks
- HTTP hooks
- limitations of the hook system
- hook interaction with permission modes
- common failure modes
- debugging techniques

## Core judgment

Use the simplest hook that can do the job.

That usually means:
- `command` hooks first
- `prompt` hooks when you need judgment from hook input alone
- `agent` hooks when verification requires tools or repo inspection
- `http` hooks when the logic belongs in a service instead of the local shell

## Prompt-based hooks

Use `type: "prompt"` when the hook decision requires judgment rather than deterministic shell logic.

Instead of running a local shell command:
- Claude Code sends your prompt plus hook input data to a Claude model
- Haiku is the default
- you can override the model if you need more capability

### Decision contract

Prompt hooks return JSON with:
- `"ok": true`
- or `"ok": false`

Meaning:
- `true` means the action proceeds
- `false` means the action is blocked, and the `reason` is fed back to Claude

### Example

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
          }
        ]
      }
    ]
  }
}
```

Why this is useful:
- Claude can evaluate whether work is actually complete
- if not, it keeps working using the returned reason as the next instruction

## Agent-based hooks

Use `type: "agent"` when the hook decision requires actual verification against the repo or environment.

Unlike prompt hooks:
- these do not just make one LLM call
- they spawn a subagent that can inspect files, search code, and use tools

### Decision contract

Agent hooks use the same:
- `"ok"`
- `"reason"`

response shape as prompt hooks.

### Default runtime shape

Compared with prompt hooks, agent hooks have:
- longer default timeout: 60 seconds
- up to 50 tool-use turns

### Example

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### Decision boundary

Use prompt hooks when:
- hook input data alone is enough

Use agent hooks when:
- you need to inspect the actual codebase
- run tests
- check files
- or perform multi-step verification

## HTTP hooks

Use `type: "http"` when you want an external service to handle the logic instead of a local shell process.

Claude Code:
- POSTs the hook event data to your endpoint
- expects a response body using the same JSON output format as command hooks

### Example

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "http://localhost:8080/hooks/tool-use",
            "headers": {
              "Authorization": "Bearer $MY_TOKEN"
            },
            "allowedEnvVars": ["MY_TOKEN"]
          }
        ]
      }
    ]
  }
}
```

### Important detail

To block an action:
- your endpoint must return a `2xx` response
- with the appropriate JSON decision body

HTTP status codes alone do not block actions.

### Environment interpolation

Header interpolation supports:
- `$VAR_NAME`
- `${VAR_NAME}`

But only for variables listed in:
- `allowedEnvVars`

Other `$VAR` references resolve to empty.

## Hook limitations

### Command hooks are shell-only control surfaces

Command hooks communicate only through:
- stdout
- stderr
- exit codes

They cannot:
- trigger slash commands
- directly invoke tools

### `additionalContext` is plain text

Anything returned this way is injected as plain-text system reminder content.

### Default timeout

Default hook timeout:
- 10 minutes

It is configurable per hook via:
- `timeout` in seconds

### `PostToolUse` cannot undo

By the time `PostToolUse` runs:
- the tool action already happened

So it is good for:
- formatting
- validation
- follow-up automation

It is not good for:
- preventing the original action

### `PermissionRequest` does not fire in `-p`

In non-interactive mode:
- `PermissionRequest` hooks do not fire

Use:
- `PreToolUse`

for automated permission decisions there.

### `Stop` semantics

`Stop` fires whenever Claude finishes responding, not just when the whole task is done.

It does not fire on user interrupts.

API errors fire:
- `StopFailure`

### Multiple `updatedInput` writers are dangerous

If multiple `PreToolUse` hooks rewrite tool input:
- the last one to finish wins
- hooks run in parallel
- result ordering is non-deterministic

So do not have multiple hooks fighting over the same input mutation path.

## Hooks and permission modes

Important precedence rule:

`PreToolUse` hooks fire before permission-mode checks.

That means a `PreToolUse` hook returning deny can block the tool even if the user is running:
- `bypassPermissions`
- or `--dangerously-skip-permissions`

That is strong. It means hooks can enforce policy even when session permissions are loose.

The reverse is not true:
- a hook returning allow does not override deny rules from settings

Hooks can tighten policy harder than the session. They cannot loosen it past existing deny rules.

## Troubleshooting

### Hook not firing

Check:
- `/hooks` shows it under the right event
- the matcher is correct and case-sensitive
- you are triggering the right event
- for non-interactive `-p`, use `PreToolUse` instead of `PermissionRequest`

### Hook error in transcript

If you see something like:
- `PreToolUse hook error: ...`

Test the script manually by piping sample JSON:

```sh
echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./my-hook.sh
echo $?
```

Also check:
- absolute path vs relative path
- `$CLAUDE_PROJECT_DIR` usage
- whether `jq` is installed
- whether the script is executable

### `/hooks` shows nothing

Check:
- JSON validity
- correct settings file location
- whether the file watcher missed the change

If needed:
- restart the session

### Stop hook loops forever

If Claude keeps working forever, the hook needs to detect whether it already triggered continuation.

Example pattern:

```bash
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0
fi
```

### JSON validation failed

One sneaky cause:
- your shell profile prints text unconditionally

If `~/.zshrc` or `~/.bashrc` prints output even in non-interactive shells, that junk gets prepended to your hook JSON and parsing fails.

Fix by guarding shell-profile output so it only runs in interactive shells:

```bash
if [[ $- == *i* ]]; then
  echo "Shell ready"
fi
```

## Debugging techniques

### Transcript view

Use:
- `Ctrl+O`

This shows:
- one-line hook summaries
- blocking stderr messages
- hook error summaries

### Debug log

For full details, run Claude Code with:

```sh
claude --debug-file /tmp/claude.log
```

Then inspect with:

```sh
tail -f /tmp/claude.log
```

If you did not start with that flag:
- run `/debug` mid-session
- find the log path there

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/manifest.json)
- [examples/prompt-stop-check.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/examples/prompt-stop-check.json)
- [examples/agent-stop-test-verifier.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/examples/agent-stop-test-verifier.json)
- [examples/http-posttooluse.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/examples/http-posttooluse.json)
- [examples/stop-hook-active-guard.sh](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/examples/stop-hook-active-guard.sh)
- [examples/interactive-shell-guard.sh](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/examples/interactive-shell-guard.sh)
