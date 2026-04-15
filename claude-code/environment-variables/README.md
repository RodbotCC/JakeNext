---
name: environment-variables
description: Claude Code reference entry for environment variables that control authentication, providers, model selection, permissions, memory, MCP, plugins, telemetry, scheduling, and runtime behavior.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Environment Variables

This is a focused Claude Code reference entry for environment variables that control Claude Code behavior.

## What this entry covers

- where env vars fit relative to settings and flags
- the highest-signal environment variable groups
- important precedence and safety gotchas
- common operational patterns

## Core judgment

This env-var surface is huge, but most of it falls into a few real buckets:
- auth and provider routing
- model and runtime behavior
- permissions, memory, and context control
- MCP, plugins, and integrations
- telemetry, networking, and debugging

If you group them that way, the page becomes usable instead of looking like a chemical spill.

## Where env vars fit

You can set these:
- in the shell before launching `claude`
- or in `settings.json` under `env`

That makes env vars the right tool for:
- machine-level defaults
- team rollout
- CI and automation
- provider and gateway routing

## High-signal groups

## Authentication and API routing

### Core auth

- `ANTHROPIC_API_KEY`
  Use an API key instead of subscription auth. In `-p` mode, it always wins when present.

- `ANTHROPIC_AUTH_TOKEN`
  Custom bearer token value for the `Authorization` header.

- `CLAUDE_CODE_OAUTH_TOKEN`
  OAuth access token for Claude.ai auth in automated or SDK environments.

- `CLAUDE_CODE_OAUTH_REFRESH_TOKEN`
  Refresh token for automated Claude.ai auth bootstrap.

- `CLAUDE_CODE_OAUTH_SCOPES`
  Required scopes when using the refresh token path.

### API and gateway endpoints

- `ANTHROPIC_BASE_URL`
  Override the API endpoint, often for proxies or gateways.

- `ANTHROPIC_BEDROCK_BASE_URL`
- `ANTHROPIC_BEDROCK_MANTLE_BASE_URL`
- `ANTHROPIC_VERTEX_BASE_URL`
- `ANTHROPIC_FOUNDRY_BASE_URL`

These override provider-specific endpoints when routing through custom infra.

### Provider toggles

- `CLAUDE_CODE_USE_BEDROCK`
- `CLAUDE_CODE_USE_MANTLE`
- `CLAUDE_CODE_USE_VERTEX`
- `CLAUDE_CODE_USE_FOUNDRY`

These switch Claude Code onto those providers.

### Skip provider auth

- `CLAUDE_CODE_SKIP_BEDROCK_AUTH`
- `CLAUDE_CODE_SKIP_MANTLE_AUTH`
- `CLAUDE_CODE_SKIP_VERTEX_AUTH`
- `CLAUDE_CODE_SKIP_FOUNDRY_AUTH`

Useful when a gateway handles auth instead.

## Model and prompt behavior

### Primary model controls

- `ANTHROPIC_MODEL`
  Select the model setting to use.

- `CLAUDE_CODE_SUBAGENT_MODEL`
  Configure the model used for subagents.

- `CLAUDE_CODE_EFFORT_LEVEL`
  Force the effort level. Takes precedence over `/effort` and settings.

### Pinned/default model overrides

The docs expose environment variables for pinned default model aliases:
- `ANTHROPIC_DEFAULT_SONNET_MODEL`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`

Plus related display metadata:
- `_NAME`
- `_DESCRIPTION`
- `_SUPPORTED_CAPABILITIES`

### Custom model picker entry

- `ANTHROPIC_CUSTOM_MODEL_OPTION`
- `ANTHROPIC_CUSTOM_MODEL_OPTION_NAME`
- `ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION`

Use these to add a gateway-specific or non-standard model into the `/model` picker.

### Thinking and context size

- `MAX_THINKING_TOKENS`
  Override the extended-thinking token budget.

- `CLAUDE_CODE_DISABLE_THINKING`
  Hard-disable extended thinking.

- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING`
  Turn off adaptive reasoning for supported models.

- `CLAUDE_CODE_DISABLE_1M_CONTEXT`
  Remove 1M-context model variants from availability.

### Output sizing

- `CLAUDE_CODE_MAX_OUTPUT_TOKENS`
  Override the max output token target.

- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`
  Increase file read output limits.

## Permissions, memory, and context

### Memory and instruction loading

- `CLAUDE_CODE_DISABLE_AUTO_MEMORY`
  Disable auto memory. `0` can also force it on during rollout.

- `CLAUDE_CODE_DISABLE_CLAUDE_MDS`
  Prevent loading all `CLAUDE.md`-style memory files.

- `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD`
  Load `CLAUDE.md` from `--add-dir` directories when set to `1`.

### Compaction and context pressure

- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`
  Change the percentage at which auto-compaction triggers.

- `CLAUDE_CODE_AUTO_COMPACT_WINDOW`
  Override the token window used for compaction calculations.

- `DISABLE_AUTO_COMPACT`
  Disable automatic compaction only.

- `DISABLE_COMPACT`
  Disable both automatic and manual compaction.

### Bash and subprocess behavior

- `BASH_DEFAULT_TIMEOUT_MS`
- `BASH_MAX_TIMEOUT_MS`
- `BASH_MAX_OUTPUT_LENGTH`

These control bash execution and truncation.

- `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`
  Return to the original working directory after each Bash command.

- `CLAUDE_CODE_SHELL`
  Override shell detection.

- `CLAUDE_CODE_SHELL_PREFIX`
  Wrap all Bash commands with a prefix command.

- `CLAUDE_ENV_FILE`
  Shell script sourced before each Bash command.

### Security posture

- `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`
  Strip provider credentials from subprocess environments.

This is one of the more important hardening controls in the whole list.

## Agent, task, and workflow controls

### Agent teams and backgrounding

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`
  Enable agent teams.

- `CLAUDE_AUTO_BACKGROUND_TASKS`
  Force-enable automatic backgrounding of long-running agent tasks.

- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`
  Disable all background task functionality.

- `CLAUDE_CODE_TEAM_NAME`
  Team name injected into teammate sessions.

### Scheduled tasks

- `CLAUDE_CODE_DISABLE_CRON`
  Disable `/loop` and cron scheduling.

### Task coordination

- `CLAUDE_CODE_ENABLE_TASKS`
  Enable task tracking in `-p` mode.

- `CLAUDE_CODE_TASK_LIST_ID`
  Share a task list across sessions.

### Session flow behavior

- `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY`
  Auto-exit after the query loop becomes idle.

- `CLAUDE_CODE_RESUME_INTERRUPTED_TURN`
  Resume interrupted SDK-mode turns automatically.

## MCP, plugins, and integrations

### MCP behavior

- `ENABLE_CLAUDEAI_MCP_SERVERS`
  Disable claude.ai MCP servers when set to `false`.

- `ENABLE_TOOL_SEARCH`
  Control MCP tool search / deferred tool loading.

- `MCP_TIMEOUT`
  MCP server startup timeout.

- `MCP_TOOL_TIMEOUT`
  MCP tool execution timeout.

- `MAX_MCP_OUTPUT_TOKENS`
  Maximum tokens allowed in MCP tool responses.

- `MCP_CONNECTION_NONBLOCKING`
  Skip MCP connection wait in `-p` mode.

- `MCP_SERVER_CONNECTION_BATCH_SIZE`
- `MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE`

Parallelism controls for local and remote MCP connection startup.

### MCP auth helpers

- `MCP_CLIENT_SECRET`
- `MCP_OAUTH_CALLBACK_PORT`

Useful when pre-configuring OAuth flows.

### Plugin controls

- `CLAUDE_CODE_PLUGIN_CACHE_DIR`
  Override the plugins root directory.

- `CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS`
  Timeout for git plugin install/update operations.

- `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE`
  Keep marketplace cache when updates fail.

- `CLAUDE_CODE_PLUGIN_SEED_DIR`
  Seed pre-populated plugin directories, useful in containers.

- `CLAUDE_CODE_SYNC_PLUGIN_INSTALL`
  Make `-p` mode wait for plugin install before first query.

- `CLAUDE_CODE_SYNC_PLUGIN_INSTALL_TIMEOUT_MS`
  Bound the wait for synchronous plugin installation.

- `CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL`
  Skip official marketplace auto-add on first run.

## IDE, browser, and UI behavior

- `CLAUDE_CODE_AUTO_CONNECT_IDE`
  Override IDE auto-connect behavior.

- `CLAUDE_CODE_IDE_HOST_OVERRIDE`
- `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL`
- `CLAUDE_CODE_IDE_SKIP_VALID_CHECK`

These tune IDE connection and extension behavior.

- `CLAUDE_CODE_USE_POWERSHELL_TOOL`
  Enable PowerShell tool on native Windows.

- `CLAUDE_CODE_GIT_BASH_PATH`
  Windows-only path override for Git Bash.

- `CLAUDE_CODE_DISABLE_MOUSE`
  Disable mouse tracking in fullscreen mode.

- `CLAUDE_CODE_NO_FLICKER`
  Enable fullscreen rendering preview.

- `CLAUDE_CODE_SCROLL_SPEED`
  Adjust wheel scroll speed in fullscreen rendering.

- `CLAUDE_CODE_ACCESSIBILITY`
  Keep native terminal cursor visible for accessibility tools.

- `CLAUDE_CODE_DISABLE_TERMINAL_TITLE`
  Turn off automatic terminal title updates.

- `CLAUDE_CODE_SYNTAX_HIGHLIGHT`
  Set to `false` to disable diff syntax highlighting.

### Chrome and remote control

- `CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX`
  Prefix for auto-generated remote-control session names.

## Networking and proxies

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `NO_PROXY`

Standard proxy controls.

- `CLAUDE_CODE_PROXY_RESOLVES_HOSTS`
  Allow the proxy to perform DNS resolution.

- `API_TIMEOUT_MS`
  API request timeout.

- `CLAUDE_ENABLE_STREAM_WATCHDOG`
  Abort streams stalled for too long.

- `CLAUDE_STREAM_IDLE_TIMEOUT_MS`
  Set the stream watchdog timeout.

### TLS / mTLS

- `CLAUDE_CODE_CLIENT_CERT`
- `CLAUDE_CODE_CLIENT_KEY`
- `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE`

Use these for mTLS setups.

## Telemetry, logging, and observability

### Debug logging

- `CLAUDE_CODE_DEBUG_LOGS_DIR`
  Despite the name, this is a file path.

- `CLAUDE_CODE_DEBUG_LOG_LEVEL`
  `verbose`, `debug`, `info`, `warn`, or `error`

### Telemetry toggles

- `CLAUDE_CODE_ENABLE_TELEMETRY`
  Turn on OpenTelemetry collection.

- `DISABLE_TELEMETRY`
  Disable Statsig telemetry.

- `DISABLE_ERROR_REPORTING`
  Disable Sentry reporting.

- `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY`
  Disable the session quality survey.

- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`
  Bundle-disable several nonessential network features.

### OTel content logging

- `OTEL_LOG_TOOL_CONTENT`
- `OTEL_LOG_TOOL_DETAILS`
- `OTEL_LOG_USER_PROMPTS`

These are high-sensitivity toggles and should be treated carefully.

### OTel metrics configuration

- `OTEL_METRICS_INCLUDE_ACCOUNT_UUID`
- `OTEL_METRICS_INCLUDE_SESSION_ID`
- `OTEL_METRICS_INCLUDE_VERSION`

And Claude Code also supports the usual OpenTelemetry exporter variables.

## Disable and feature-toggle variables

Claude Code has a large family of "turn this feature off" env vars.

High-signal examples:
- `CLAUDE_CODE_DISABLE_FAST_MODE`
- `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING`
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`
- `CLAUDE_CODE_DISABLE_ATTACHMENTS`
- `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK`
- `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`
- `DISABLE_AUTOUPDATER`
- `DISABLE_DOCTOR_COMMAND`
- `DISABLE_FEEDBACK_COMMAND`
- `DISABLE_INSTALL_GITHUB_APP_COMMAND`
- `DISABLE_LOGIN_COMMAND`
- `DISABLE_LOGOUT_COMMAND`
- `DISABLE_UPGRADE_COMMAND`

This is one of the places where env vars are clearly being used as fleet-policy levers, not just local preferences.

## Practical patterns

## Use Claude.ai subscription, not an API key

If `ANTHROPIC_API_KEY` is set, it can override subscription-backed auth.

To return to subscription auth:

```sh
unset ANTHROPIC_API_KEY
```

## Make scripted runs deterministic

Combine:
- `CLAUDE_CODE_SIMPLE=1`
- explicit flags like `--mcp-config`
- or just `--bare`

when you want reproducible scripted behavior.

## Harden subprocesses

Set:

```sh
CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1
```

to reduce the blast radius of prompt-injection attempts trying to exfiltrate credentials via subprocesses.

## Control memory aggressively

If you need a truly memory-light environment:

```sh
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
CLAUDE_CODE_DISABLE_CLAUDE_MDS=1
```

## Debug weird network hangs

Reach for:
- `API_TIMEOUT_MS`
- `CLAUDE_ENABLE_STREAM_WATCHDOG=1`
- `CLAUDE_STREAM_IDLE_TIMEOUT_MS`

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/manifest.json)
- [examples/auth-and-provider.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/auth-and-provider.env)
- [examples/memory-and-context.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/memory-and-context.env)
- [examples/mcp-and-plugins.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/mcp-and-plugins.env)
- [examples/debug-and-telemetry.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/debug-and-telemetry.env)
- [examples/security-hardening.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/security-hardening.env)
- [examples/ui-and-runtime.env](/Users/jakeaaron/Documents/Storie/claude-code/environment-variables/examples/ui-and-runtime.env)
