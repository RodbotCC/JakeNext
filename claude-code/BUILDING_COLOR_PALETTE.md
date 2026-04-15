# Claude Code Building Color Palette

This is the fast builder cheat sheet for the `claude-code/` shelf.

Use it as a “what do I have to build with?” map.

It is organized by functional palette rather than by page.

## Session Control

Use these when you need to create, continue, fork, compact, rewind, or end sessions.

### CLI

- `claude`
- `claude "query"`
- `claude -c`
- `claude -r <session>`
- `claude --fork-session`
- `claude --session-id <uuid>`
- `claude --name <name>`
- `claude --no-session-persistence`

### Built-in commands

- `/clear`
- `/compact [instructions]`
- `/resume [session]`
- `/rename [name]`
- `/branch [name]`
- `/rewind`
- `/exit`
- `/context`
- `/diff`
- `/copy [N]`
- `/export [filename]`

### Related entries

- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [built-in-commands](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/README.md)
- [checkpointing](/Users/jakeaaron/Documents/Storie/claude-code/checkpointing/README.md)

## Execution Modes

Use these when deciding how Claude runs: interactive, print mode, plan mode, bare mode, background, forked subagent, or remote.

### Core modes

- interactive session: `claude`
- non-interactive / SDK-style: `claude -p`
- bare mode: `claude --bare -p ...`
- plan mode: `--permission-mode plan`, `/plan`
- forked skill execution: `context: fork`
- background subagents
- remote web session: `--remote`
- remote-controlled local session: `--remote-control`

### Relevant flags

- `--print`, `-p`
- `--bare`
- `--permission-mode`
- `--remote`
- `--remote-control`, `--rc`
- `--teammate-mode`
- `--worktree`

### Relevant tools

- `EnterPlanMode`
- `ExitPlanMode`
- `Agent`
- `EnterWorktree`
- `ExitWorktree`

### Related entries

- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [run-claude-code-programmatically](/Users/jakeaaron/Documents/Storie/claude-code/run-claude-code-programmatically/README.md)
- [work-with-subagents](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/README.md)
- [advanced-skill-patterns](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/README.md)

## Permissions

Use these to decide what Claude can do, what must ask, and what is fully denied.

### Core controls

- `/permissions`
- `--allowedTools`
- `--disallowedTools`
- `--tools`
- `--permission-mode`
- `--dangerously-skip-permissions`
- `--allow-dangerously-skip-permissions`

### Permission modes

- `default`
- `acceptEdits`
- `plan`
- `auto`
- `dontAsk`
- `bypassPermissions`

### Hook-level control

- `PreToolUse`
- `PermissionRequest`
- `PermissionDenied`

### JSON control patterns

- `permissionDecision: allow | deny | ask | defer`
- `decision.behavior: allow | deny`
- `updatedPermissions`

### Relevant env vars

- `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`

### Related entries

- [tools-reference](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)
- [control-subagent-capabilities](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/README.md)
- [environment-variables](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/README.md)

## Model & Performance

Use these to shape model choice, effort, context pressure, fallback, and token budgets.

### Core controls

- `/model [model]`
- `/effort [low|medium|high|max|auto]`
- `/fast [on|off]`
- `--model`
- `--effort`
- `--fallback-model`

### Model env vars

- `ANTHROPIC_MODEL`
- `CLAUDE_CODE_EFFORT_LEVEL`
- `CLAUDE_CODE_SUBAGENT_MODEL`
- `ANTHROPIC_DEFAULT_SONNET_MODEL*`
- `ANTHROPIC_DEFAULT_OPUS_MODEL*`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL*`
- `ANTHROPIC_CUSTOM_MODEL_OPTION*`

### Thinking and output controls

- `MAX_THINKING_TOKENS`
- `CLAUDE_CODE_DISABLE_THINKING`
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING`
- `CLAUDE_CODE_MAX_OUTPUT_TOKENS`
- `CLAUDE_CODE_DISABLE_1M_CONTEXT`

### Context pressure controls

- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW`
- `DISABLE_AUTO_COMPACT`
- `DISABLE_COMPACT`

### Related entries

- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [environment-variables](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/README.md)
- [auto-memory](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/README.md)

## File Operations

Use these when Claude needs to inspect, change, or organize files.

### Built-in tools

- `Read`
- `Write`
- `Edit`
- `Glob`
- `Grep`
- `NotebookEdit`
- `LSP`

### File-scoped instruction systems

- `CLAUDE.md`
- `CLAUDE.local.md`
- `.claude/rules/`
- nested `CLAUDE.md`
- path-scoped rules via `paths:`

### Worktree isolation

- `--worktree`
- `EnterWorktree`
- `ExitWorktree`
- `WorktreeCreate`
- `WorktreeRemove`

### Related entries

- [tools-reference](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/README.md)
- [how-claude-remembers-your-project](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/README.md)
- [organize-rules-with-claude-rules](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/README.md)
- [checkpointing](/Users/jakeaaron/Documents/Storie/claude-code/checkpointing/README.md)

## Shell Execution

Use these for command execution, environment setup, and shell-specific automation.

### Tools

- `Bash`
- `PowerShell` (Windows preview)

### Shell behavior primitives

- working directory persists across Bash commands
- environment variables do not persist across Bash commands by default
- `CLAUDE_ENV_FILE` lets you persist env setup across commands
- `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` resets CWD after each command

### Shell-facing hooks

- `SessionStart`
- `CwdChanged`
- `FileChanged`
- `PreToolUse`
- `PostToolUse`

### Shell env vars

- `BASH_DEFAULT_TIMEOUT_MS`
- `BASH_MAX_TIMEOUT_MS`
- `BASH_MAX_OUTPUT_LENGTH`
- `CLAUDE_CODE_SHELL`
- `CLAUDE_CODE_SHELL_PREFIX`
- `CLAUDE_ENV_FILE`
- `CLAUDE_CODE_USE_POWERSHELL_TOOL`

### Related entries

- [tools-reference](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)
- [environment-variables](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/README.md)

## Agents & Teams

Use these when work should be delegated, isolated, parallelized, or coordinated.

### Subagent primitives

- `/agents`
- `claude agents`
- `--agent`
- `--agents`
- subagent files in `.claude/agents/` and `~/.claude/agents/`
- subagent frontmatter:
  - `tools`
  - `disallowedTools`
  - `model`
  - `permissionMode`
  - `skills`
  - `mcpServers`
  - `hooks`
  - `memory`
  - `background`
  - `isolation`

### Team primitives

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- `TeamCreate`
- `TeamDelete`
- `SendMessage`
- shared task list
- teammate display modes

### Team controls

- `--teammate-mode`
- `teammateMode`
- plan approval
- teammate shutdown
- cleanup flow

### Related entries

- [configure-subagents](/Users/jakeaaron/Documents/Storie/claude-code/configure-subagents/README.md)
- [write-subagent-files](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/README.md)
- [control-subagent-capabilities](/Users/jakeaaron/Documents/Storie/claude-code/control-subagent-capabilities/README.md)
- [work-with-subagents](/Users/jakeaaron/Documents/Storie/claude-code/work-with-subagents/README.md)
- [agent-teams](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/README.md)
- [control-agent-teams](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/README.md)
- [how-agent-teams-work](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/README.md)

## Hooks & Automation

Use these when you need deterministic control, policy enforcement, or automatic side effects.

### Hook handler types

- `command`
- `http`
- `prompt`
- `agent`

### Core event families

- startup/instruction lifecycle:
  - `SessionStart`
  - `InstructionsLoaded`
  - `SessionEnd`
  - `PreCompact`
  - `PostCompact`
- prompt and stop:
  - `UserPromptSubmit`
  - `Stop`
  - `StopFailure`
- tool lifecycle:
  - `PreToolUse`
  - `PermissionRequest`
  - `PostToolUse`
  - `PostToolUseFailure`
  - `PermissionDenied`
- subagents/teams/tasks:
  - `SubagentStart`
  - `SubagentStop`
  - `TaskCreated`
  - `TaskCompleted`
  - `TeammateIdle`
- config/filesystem:
  - `ConfigChange`
  - `CwdChanged`
  - `FileChanged`
  - `WorktreeCreate`
  - `WorktreeRemove`
- MCP interaction:
  - `Notification`
  - `Elicitation`
  - `ElicitationResult`

### Automation primitives

- matchers
- `if`
- `additionalContext`
- `updatedInput`
- `updatedPermissions`
- `continue`
- `stopReason`
- `async: true`

### Related entries

- [automate-workflows-with-hooks](/Users/jakeaaron/Documents/Storie/claude-code/automate-workflows-with-hooks/README.md)
- [how-hooks-work](/Users/jakeaaron/Documents/Storie/claude-code/how-hooks-work/README.md)
- [advanced-hooks](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)
- [define-hooks-for-subagents](/Users/jakeaaron/Documents/Storie/claude-code/define-hooks-for-subagents/README.md)

## Integrations

Use these when Claude Code needs to reach outside the core CLI into browsers, MCP, plugins, IDEs, channels, or remote surfaces.

### MCP / plugins

- `/mcp`
- `/plugin`
- `/reload-plugins`
- `--mcp-config`
- `--strict-mcp-config`
- `ToolSearch`
- `ListMcpResourcesTool`
- `ReadMcpResourceTool`

### Channels

- `--channels`
- `--dangerously-load-development-channels`
- fakechat
- Telegram / Discord / iMessage plugin channels

### IDE / browser / remote

- `/ide`
- `/chrome`
- `/desktop`
- `/remote-control`
- `/remote-env`
- `--ide`
- `--chrome`
- `--remote`
- `--remote-control`
- `--teleport`

### Provider integrations

- Bedrock
- Vertex
- Foundry
- Mantle

### Related entries

- [channels](/Users/jakeaaron/Documents/Storie/claude-code/channels/README.md)
- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [environment-variables](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/README.md)
- [tools-reference](/Users/jakeaaron/Documents/Storie/claude-code/tools-reference/README.md)

## Context & Memory

Use these to control what Claude carries across turns and sessions.

### Persistent instruction systems

- `CLAUDE.md`
- `CLAUDE.local.md`
- `.claude/rules/`
- `@imports`
- nested instruction loading

### Auto memory

- `/memory`
- `MEMORY.md`
- topic memory files
- auto memory toggle

### Compaction/context tools

- `/compact`
- summarize-from-here in `/rewind`
- auto-compaction controls
- context visualization with `/context`

### Related entries

- [how-claude-remembers-your-project](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/README.md)
- [organize-rules-with-claude-rules](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/README.md)
- [auto-memory](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/README.md)
- [checkpointing](/Users/jakeaaron/Documents/Storie/claude-code/checkpointing/README.md)

## Configuration

Use these when you need to shape Claude Code globally, per-project, per-session, or per-component.

### Primary configuration surfaces

- `~/.claude/settings.json`
- `.claude/settings.json`
- `.claude/settings.local.json`
- managed policy settings
- plugin-provided config
- skill frontmatter
- agent frontmatter

### Config entrypoints

- `/config`
- `/status`
- `/memory`
- `/hooks`
- `/permissions`
- `/keybindings`
- `/statusline`

### Config loaders

- `--settings`
- `--setting-sources`
- `--append-system-prompt`
- `--append-system-prompt-file`
- `--system-prompt`
- `--system-prompt-file`

### Related entries

- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [built-in-commands](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/README.md)
- [how-claude-remembers-your-project](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/README.md)
- [configure-skills](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/README.md)
- [write-subagent-files](/Users/jakeaaron/Documents/Storie/claude-code/write-subagent-files/README.md)

## Tasks & Scheduling

Use these when you need checklists, task graphs, background tasks, or scheduled prompts.

### Task primitives

- `TaskCreate`
- `TaskGet`
- `TaskList`
- `TaskUpdate`
- `TaskStop`
- `TodoWrite`
- `/tasks`

### Team task controls

- `TaskCreated`
- `TaskCompleted`
- `TeammateIdle`
- shared task list
- task dependencies

### Scheduling primitives

- `/loop`
- natural-language reminders
- `CronCreate`
- `CronList`
- `CronDelete`
- `/schedule` for cloud scheduled tasks

### Related entries

- [run-prompts-on-a-schedule](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/README.md)
- [agent-teams](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/README.md)
- [control-agent-teams](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)

## Output & Formats

Use these when you care about how Claude returns results, structures output, or streams data.

### Print-mode formats

- `--output-format text`
- `--output-format json`
- `--output-format stream-json`
- `--json-schema`
- `--input-format`
- `--include-partial-messages`
- `--include-hook-events`
- `--replay-user-messages`

### Session-side output surfaces

- `/copy`
- `/export`
- `/diff`
- `/context`
- `/cost`
- `/usage`

### Hook output formats

- exit code only
- JSON structured output
- plain stdout context injection
- HTTP 2xx + JSON body

### Related entries

- [run-claude-code-programmatically](/Users/jakeaaron/Documents/Storie/claude-code/run-claude-code-programmatically/README.md)
- [cli-reference](/Users/jakeaaron/Documents/Storie/claude-code/cli-reference/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)
- [built-in-commands](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/README.md)

## Debugging & Logs

Use these when the system is behaving weird and you need observability.

### Built-in diagnostics

- `/doctor`
- `/hooks`
- `/memory`
- `/mcp`
- `/status`
- `/insights`
- `/context`

### Logging and debug flags

- `--debug`
- `--debug-file`
- `CLAUDE_CODE_DEBUG_LOGS_DIR`
- `CLAUDE_CODE_DEBUG_LOG_LEVEL`

### Telemetry and observability

- `CLAUDE_CODE_ENABLE_TELEMETRY`
- OTel exporter variables
- `OTEL_LOG_TOOL_CONTENT`
- `OTEL_LOG_TOOL_DETAILS`
- `OTEL_LOG_USER_PROMPTS`

### Hook-specific observability

- `InstructionsLoaded`
- debug log hook traces
- verbose hook matching

### Related entries

- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)
- [advanced-hooks](/Users/jakeaaron/Documents/Storie/claude-code/advanced-hooks/README.md)
- [environment-variables](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/README.md)
- [built-in-commands](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/README.md)

## Workflow Patterns

Use these as the major building patterns Claude Code gives you.

### Prompt-driven interactive work

- normal session
- `CLAUDE.md`
- `/plan`
- `/rewind`
- `/compact`

### Scripted / SDK workflows

- `claude -p`
- `--bare`
- `--json-schema`
- `--allowedTools`
- `--continue`
- `--resume`

### Policy-enforced workflows

- hooks
- permissions
- `PreToolUse`
- `PermissionRequest`
- path-scoped rules

### Delegated workflows

- subagents
- agent teams
- skills with `context: fork`
- background tasks

### External-event workflows

- channels
- MCP prompts
- HTTP hooks
- remote control

### Safe experimentation workflows

- checkpointing
- worktrees
- forked sessions
- targeted summarize-from-here

### Related entries

- [MACRO_LEDGER.md](/Users/jakeaaron/Documents/Storie/claude-code/MACRO_LEDGER.md)
- [checkpointing](/Users/jakeaaron/Documents/Storie/claude-code/checkpointing/README.md)
- [run-claude-code-programmatically](/Users/jakeaaron/Documents/Storie/claude-code/run-claude-code-programmatically/README.md)
- [agent-teams](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/README.md)
- [hooks-reference](/Users/jakeaaron/Documents/Storie/claude-code/hooks-reference/README.md)

## Best Single-File Handoff

If you want to hand another agent just two files, hand them:

1. [MACRO_LEDGER.md](/Users/jakeaaron/Documents/Storie/claude-code/MACRO_LEDGER.md)
2. [BUILDING_COLOR_PALETTE.md](/Users/jakeaaron/Documents/Storie/claude-code/BUILDING_COLOR_PALETTE.md)

The ledger tells them what exists.

This palette tells them what primitives they have to build with.
