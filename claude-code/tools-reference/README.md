---
name: tools-reference
description: Claude Code reference entry for built-in tool names, permission requirements, special behavior for Bash, LSP, and PowerShell, and how these names map to permissions, hooks, and subagent tool lists.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Tools Reference

This is a focused Claude Code reference entry for the built-in tools Claude Code can use.

## What this entry covers

- built-in tool names
- which tools require permission
- how tool names map into permissions, hooks, and subagents
- special behavior for Bash, LSP, and PowerShell

## Core judgment

These tool names matter because they are not just documentation labels.

They are the exact strings you use in:
- permission rules
- subagent tool lists
- hook matchers

So this page is really a shared vocabulary reference for the rest of Claude Code.

## Where tool names show up

You use these exact names in:
- permission settings
- `/permissions`
- subagent `tools` and `disallowedTools`
- hook matchers like `PreToolUse` and `PostToolUse`

To disable a built-in tool entirely, add it to the permission `deny` array.

To add new tools:
- use MCP servers

To extend Claude with reusable prompt workflows:
- use skills

Skills run through the existing `Skill` tool rather than creating a new tool entry.

## Built-in tools

## No-permission tools

- `Agent`
  Spawn a subagent with its own context window.

- `AskUserQuestion`
  Ask multiple-choice clarification questions.

- `CronCreate`
  Create a scheduled task in the current session.

- `CronDelete`
  Delete a scheduled task.

- `CronList`
  List scheduled tasks.

- `EnterPlanMode`
  Switch into plan mode.

- `EnterWorktree`
  Create and enter a git worktree session.

- `ExitWorktree`
  Leave a worktree session.

- `Glob`
  Pattern-based file discovery.

- `Grep`
  Search file contents.

- `ListMcpResourcesTool`
  List MCP resources.

- `LSP`
  Language-server-based code intelligence.

- `Read`
  Read file contents.

- `ReadMcpResourceTool`
  Read a specific MCP resource by URI.

- `SendMessage`
  Message an agent-team teammate or resume a subagent by agent ID.

- `TaskCreate`
  Create a task.

- `TaskGet`
  Get task details.

- `TaskList`
  List tasks.

- `TaskOutput`
  Deprecated background-task output fetch tool.

- `TaskStop`
  Stop a running background task.

- `TaskUpdate`
  Update task status, dependencies, details, or delete tasks.

- `TeamCreate`
  Create an agent team.

- `TeamDelete`
  Delete an agent team.

- `TodoWrite`
  Manage the session checklist in non-interactive / Agent SDK contexts.

- `ToolSearch`
  Search and load deferred tools when tool search is enabled.

## Permission-required tools

- `Bash`
  Execute shell commands.

- `Edit`
  Make targeted edits to existing files.

- `ExitPlanMode`
  Present a plan for approval and leave plan mode.

- `NotebookEdit`
  Modify notebook cells.

- `PowerShell`
  Execute PowerShell commands on Windows in preview mode.

- `Skill`
  Execute a skill in the main conversation.

- `WebFetch`
  Fetch a URL directly.

- `WebSearch`
  Perform a web search.

- `Write`
  Create or overwrite files.

## Tool strings worth remembering

The highest-signal exact tool strings are:
- `Bash`
- `Read`
- `Edit`
- `Write`
- `Skill`
- `Agent`
- `LSP`
- `WebFetch`
- `WebSearch`
- `PowerShell`

Those are the ones you will keep seeing across:
- permissions
- hooks
- subagent configs
- debugging conversations

## Bash tool behavior

`Bash` runs each command in a separate process.

### What persists

- working directory persists across commands

### What does not persist

- environment variables do not persist across commands

So:
- `cd` can carry forward
- `export FOO=bar` will not carry forward by itself

### Working directory reset option

Set:

```sh
CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1
```

to return to the project directory after each Bash command.

### Persisting environment setup

To persist environment variables across Bash commands:
- activate your environment before launching Claude Code
- or use `CLAUDE_ENV_FILE`
- or populate that file via hooks like `SessionStart`, `CwdChanged`, or `FileChanged`

## LSP tool behavior

`LSP` gives Claude language-server-backed code intelligence.

### What it can do

- jump to definitions
- find references
- get type information
- list symbols
- find interface implementations
- trace call hierarchies

### Important behavior after edits

After file edits, it can automatically report:
- type errors
- warnings

That lets Claude fix issues without always needing a separate build step.

### Activation requirement

The tool is inactive until you install a code-intelligence plugin for the language and separately install the language server binary.

So if someone says “LSP isn’t doing anything,” the first thing to check is whether the code intelligence plugin and server are actually installed.

## PowerShell tool

`PowerShell` is an opt-in preview on native Windows.

### Enable it

Set:

```json
{
  "env": {
    "CLAUDE_CODE_USE_POWERSHELL_TOOL": "1"
  }
}
```

Claude tries:
- `pwsh.exe` first
- then `powershell.exe`

Important detail:
- `Bash` still remains registered alongside `PowerShell`

So Claude may still need to be told explicitly to use PowerShell.

### Related shell settings

There are three connected knobs:

- `"defaultShell": "powershell"` in `settings.json`
  Routes interactive `!` commands through PowerShell.

- `"shell": "powershell"` in hook config
  Runs that command hook in PowerShell.

- `shell: powershell` in skill frontmatter
  Runs inline skill shell blocks in PowerShell.

### Preview limitations

Current limitations include:
- auto mode does not work with PowerShell yet
- PowerShell profiles are not loaded
- sandboxing is not supported
- native Windows only, not WSL
- Git Bash is still required to start Claude Code

## Practical permission-rule usage

Because these names are exact strings, the permission patterns end up looking like:

```text
Bash(git diff *)
Read
Edit
Skill(review-pr *)
Agent(my-custom-agent)
```

This is why the exact names matter so much.

## Check what tools are available

Your actual tool set depends on:
- provider
- platform
- settings

To check from inside a live session, ask Claude:

```text
What tools do you have access to?
```

For exact MCP tool names, use:

```text
/mcp
```

## Practical advice

When debugging tool behavior, always separate:
- tool exists but is permission-blocked
- tool exists but is context-restricted
- tool is disabled or unavailable on this platform/provider
- tool name in your rule does not match the actual string

Nine times out of ten, one of those is the culprit.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/manifest.json)
- [examples/no-permission-tools.txt](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/examples/no-permission-tools.txt)
- [examples/permission-required-tools.txt](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/examples/permission-required-tools.txt)
- [examples/bash-behavior.txt](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/examples/bash-behavior.txt)
- [examples/powershell-enable.json](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/examples/powershell-enable.json)
- [examples/permission-rule-snippets.txt](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/examples/permission-rule-snippets.txt)
