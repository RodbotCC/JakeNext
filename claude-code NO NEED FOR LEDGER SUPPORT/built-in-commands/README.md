---
name: built-in-commands
description: Claude Code reference entry for built-in slash commands, including session, config, memory, plugin, planning, review, remote, and platform-specific commands, plus MCP prompt command behavior.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Built-in Commands

This is a focused Claude Code reference entry for the built-in slash commands available inside Claude Code.

## What this entry covers

- built-in slash commands
- command categories
- commands with platform, plan, or version limits
- deprecated and removed commands
- MCP prompt commands

## Core judgment

The `/` menu is really a mixed surface:
- true built-in commands
- bundled skills that behave like commands
- MCP prompts discovered dynamically

Keeping those three mentally separate makes the command list much easier to navigate.

## How command discovery works

Type:

```text
/
```

to see available commands.

Type:

```text
/<letters>
```

to filter the list.

Important caveat:
- not every command is visible to every user
- visibility can depend on platform, plan, version, or environment

Examples:
- `/desktop` only appears on macOS and Windows
- `/upgrade` and `/privacy-settings` are only for Pro and Max plans
- `/terminal-setup` is hidden if the terminal already supports the needed keybindings

## Built-in commands vs bundled skills

Claude Code also ships bundled skills such as:
- `/simplify`
- `/batch`
- `/debug`
- `/loop`

Those appear alongside built-in commands in the `/` menu, but they are skills rather than core built-ins.

If you want to create your own command-like entries:
- use skills

## Argument notation

In command docs:
- `<arg>` means required
- `[arg]` means optional

## High-signal command groups

## Session and conversation control

- `/clear`
  Clear conversation history and free up context. Aliases: `/reset`, `/new`

- `/compact [instructions]`
  Compact the conversation, optionally with focus guidance

- `/resume [session]`
  Resume a session by ID or name. Alias: `/continue`

- `/rename [name]`
  Rename the current session

- `/branch [name]`
  Branch the current conversation. Alias: `/fork`

- `/rewind`
  Rewind conversation and/or code state. Alias: `/checkpoint`

- `/exit`
  Exit the CLI. Alias: `/quit`

## Quick interaction and inspection

- `/btw <question>`
  Ask a side question without adding it to the conversation

- `/help`
  Show help and available commands

- `/copy [N]`
  Copy the last assistant response, or the Nth-latest one

- `/export [filename]`
  Export the conversation as plain text

- `/context`
  Visualize current context usage

- `/diff`
  Open the interactive diff viewer

## Configuration and status

- `/config`
  Open the settings interface. Alias: `/settings`

- `/status`
  Open the status tab of settings

- `/theme`
  Change the theme

- `/color [color|default]`
  Change prompt bar color for the current session

- `/effort [low|medium|high|max|auto]`
  Set model effort level

- `/model [model]`
  Change the active model

- `/fast [on|off]`
  Toggle fast mode

- `/statusline`
  Configure the status line

- `/keybindings`
  Open or create the keybindings config

## Permissions, memory, hooks, and tools

- `/permissions`
  Manage allow/ask/deny permission rules. Alias: `/allowed-tools`

- `/memory`
  Edit `CLAUDE.md`, toggle auto memory, and view memory entries

- `/hooks`
  View hook configuration

- `/mcp`
  Manage MCP servers and auth

- `/agents`
  Manage agent configurations

- `/plugin`
  Manage plugins

- `/reload-plugins`
  Reload active plugins without restarting

- `/skills`
  List available skills

## Planning, review, and workflow commands

- `/plan [description]`
  Enter plan mode, optionally with a task

- `/security-review`
  Review current branch changes for security issues

- `/schedule [description]`
  Create, update, list, or run Cloud scheduled tasks

- `/ultraplan <prompt>`
  Draft a plan in an ultraplan session and review it in the browser

- `/tasks`
  List and manage background tasks. Also available as `/bashes`

- `/init`
  Initialize project guidance with `CLAUDE.md`

- `/insights`
  Generate a report about Claude Code sessions and friction points

- `/powerup`
  Interactive feature lessons with demos

## Auth, install, and account commands

- `/login`
  Sign in

- `/logout`
  Sign out

- `/usage`
  Show usage limits and rate limit status

- `/cost`
  Show token usage stats

- `/extra-usage`
  Configure extra usage behavior

- `/install-github-app`
  Set up Claude GitHub Actions app for a repository

- `/install-slack-app`
  Install the Claude Slack app

- `/upgrade`
  Open the upgrade page

- `/privacy-settings`
  View or update privacy settings

- `/passes`
  Share a free week of Claude Code if eligible

- `/stickers`
  Order stickers

- `/feedback [report]`
  Submit feedback. Alias: `/bug`

## Device, terminal, and remote commands

- `/desktop`
  Continue the session in the desktop app. Alias: `/app`

- `/mobile`
  Show QR code for the mobile app. Aliases: `/ios`, `/android`

- `/voice`
  Toggle push-to-talk voice dictation

- `/remote-control`
  Make the current session available for remote control. Alias: `/rc`

- `/remote-env`
  Configure the default remote environment for web sessions

- `/chrome`
  Configure Claude in Chrome settings

- `/ide`
  Manage IDE integrations and status

- `/sandbox`
  Toggle sandbox mode on supported platforms

- `/terminal-setup`
  Configure terminal keybindings in terminals that need it

## Version-gated, deprecated, and removed commands

Some commands are gone or have been replaced.

### Removed or deprecated examples

- `/pr-comments [PR]`
  Removed in `v2.1.91`. Users should ask Claude directly to inspect PR comments.

- `/review`
  Deprecated. The docs recommend installing the `code-review` plugin instead.

- `/vim`
  Removed in `v2.1.92`. Vim mode is now configured through `/config`.

This is worth capturing because old screenshots or old habits will absolutely keep surfacing.

## Platform and plan caveats

Important examples:
- `/desktop` is macOS and Windows only
- `/privacy-settings` and `/upgrade` are only on Pro and Max plans
- `/setup-bedrock` appears only when `CLAUDE_CODE_USE_BEDROCK=1` is set
- `/terminal-setup` only appears in terminals that need it

## MCP prompts

MCP servers can expose prompts that appear as commands using this format:

```text
/mcp__<server>__<prompt>
```

These are:
- discovered dynamically from connected MCP servers
- not part of the fixed built-in command set

That distinction matters when debugging why a command does or does not show up.

## Practical advice

The cleanest way to think about the slash surface is:
- built-ins for session control and product features
- bundled skills for reusable workflows
- MCP prompts for external server-provided commands

If a command is missing, check:
- platform
- plan
- version
- environment variable gates
- whether it is actually a skill or MCP prompt instead of a built-in

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/manifest.json)
- [examples/session-and-context.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/session-and-context.txt)
- [examples/config-and-status.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/config-and-status.txt)
- [examples/memory-permissions-hooks.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/memory-permissions-hooks.txt)
- [examples/planning-and-workflow.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/planning-and-workflow.txt)
- [examples/remote-and-device.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/remote-and-device.txt)
- [examples/deprecated-and-removed.txt](/Users/jakeaaron/Documents/Storie/claude-code/built-in-commands/examples/deprecated-and-removed.txt)
