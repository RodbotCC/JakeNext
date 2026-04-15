---
name: channels
description: Claude Code reference entry for channels, the research-preview feature that pushes external events into a running session. Use when wiring Telegram, Discord, iMessage, or demo/localhost channel plugins into an active Claude Code session.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Channels

This is a focused Claude Code reference entry for channels.

## What this entry covers

- what channels are
- prerequisites and preview status
- supported channels and plugin flow
- fakechat quickstart
- sender allowlists and pairing
- Team and Enterprise controls
- how channels compare with web sessions, Slack, MCP, and Remote Control

## Core judgment

Channels are for pushing events into the Claude Code session you already have open.

That is the key distinction.

They are best when:
- Claude should react in your live local session
- your files and current working context matter
- events arrive while you are away from the terminal

They are not the same as:
- spawning a fresh cloud session
- polling an MCP server
- or just remotely controlling the terminal UI

## What channels are

A channel is an MCP server that pushes events into a running Claude Code session.

That lets Claude:
- receive chat messages
- receive alerts and webhook-like events
- react inside the live session that already has your files and local context

Channels can also be two-way:
- Claude reads the inbound event
- Claude replies back through the same channel

Important behavior:
- events only arrive while the session is open
- for always-on use, run Claude in a background process or persistent terminal

## Research preview status

Channels are:
- research preview
- available in Claude Code `v2.1.80` or later

They also require:
- `claude.ai` login

They do **not** support:
- console authentication
- API key authentication

For Team and Enterprise:
- orgs must explicitly enable them

## Supported channels

The research preview includes:
- Telegram
- Discord
- iMessage

These are installed as plugins and require:
- Bun

The docs also include:
- `fakechat`, an officially supported localhost demo channel

## Basic operating model

Typical flow:

1. install a channel plugin
2. enable Claude Code with `--channels`
3. configure credentials if needed
4. pair the sender identity
5. messages begin arriving in the running session

When Claude replies:
- the terminal shows the tool call and a confirmation like `sent`
- the actual reply text appears on the other platform

## Fakechat quickstart

`fakechat` is the easiest way to understand channels before using a real messaging platform.

### Requirements

- Claude Code installed and authenticated with a `claude.ai` account
- Bun installed
- Team/Enterprise org enabled for channels if applicable

### Install

```sh
/plugin install fakechat@claude-plugins-official
```

If the marketplace is missing or stale:
- `/plugin marketplace update claude-plugins-official`
- or `/plugin marketplace add anthropics/claude-plugins-official`

### Start with channels enabled

```sh
claude --channels plugin:fakechat@claude-plugins-official
```

### Use it

Open:

`http://localhost:8787`

Type a message there and it arrives in the running Claude Code session as a channel event.

This is the cleanest mental model demo for the whole feature.

## Telegram setup shape

Telegram shows the real plugin flow clearly:

1. create a bot with BotFather
2. install the Telegram plugin
3. configure the bot token
4. restart Claude with `--channels`
5. pair your Telegram account
6. switch policy to allowlist

Key commands called out in the docs:

```sh
/plugin install telegram@claude-plugins-official
/reload-plugins
/telegram:configure <token>
claude --channels plugin:telegram@claude-plugins-official
/telegram:access pair <code>
/telegram:access policy allowlist
```

## Sender allowlists and pairing

Every approved channel plugin maintains a sender allowlist.

Only allowlisted senders can push messages.
Everyone else is silently dropped.

### Telegram and Discord

These bootstrap via pairing:
- send the bot any message
- bot replies with pairing code
- approve the code in Claude Code
- sender ID is added to allowlist

### iMessage

iMessage is different:
- texting yourself bypasses the gate automatically
- other contacts are added with `/imessage:access allow`

## Security model

There are multiple gates:

### Session gate

A server must be named in:
- `--channels`

Being present in `.mcp.json` is not enough.

### Sender gate

Only allowlisted senders can push through the channel.

### Org gate

For Team and Enterprise:
- `channelsEnabled` must allow the feature

### Permission relay warning

If a channel supports permission relay, then anyone who can reply through that channel may be able to approve or deny tool use in your session.

So:
- only allowlist people you trust with that authority

## Enterprise controls

Team and Enterprise orgs control channels with managed settings.

### `channelsEnabled`

Master switch.

If off or unset:
- channel messages are blocked

### `allowedChannelPlugins`

Defines which channel plugins are allowed.

If set:
- it replaces the Anthropic-maintained default allowlist entirely

Example:

```json
{
  "channelsEnabled": true,
  "allowedChannelPlugins": [
    { "marketplace": "claude-plugins-official", "plugin": "telegram" },
    { "marketplace": "claude-plugins-official", "plugin": "discord" },
    { "marketplace": "acme-corp-plugins", "plugin": "internal-alerts" }
  ]
}
```

Important detail:
- an empty array blocks all channel plugins from the allowlist
- `channelsEnabled` unset blocks channels entirely, including the development bypass route mentioned in the docs

## Research preview constraints

During preview:
- `--channels` only accepts plugins on the effective allowlist
- syntax and protocol may change

If a plugin is not approved:
- Claude Code starts normally
- the channel does not register
- startup notices explain why

## How channels compare

This is one of the most valuable parts of the page.

### Claude Code on the web

Use when:
- you want a fresh cloud sandbox
- work is self-contained
- you will check back later

### Claude in Slack

Use when:
- work starts directly from team conversation context

### Standard MCP server

Use when:
- Claude should query it on demand
- nothing needs to be pushed into the session

### Remote Control

Use when:
- you want to steer your existing session from Claude apps remotely

### Channels

Use when:
- non-Claude sources need to push into your already-running local session

The two main patterns called out are:
- chat bridge
- webhook receiver

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/channels/manifest.json)
- [examples/fakechat-quickstart.txt](/Users/jakeaaron/Documents/Storie/claude-code/channels/examples/fakechat-quickstart.txt)
- [examples/telegram-setup.txt](/Users/jakeaaron/Documents/Storie/claude-code/channels/examples/telegram-setup.txt)
- [examples/channels-enabled-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/channels/examples/channels-enabled-settings.json)
- [examples/allowed-channel-plugins.json](/Users/jakeaaron/Documents/Storie/claude-code/channels/examples/allowed-channel-plugins.json)
- [examples/channels-vs-other-features.md](/Users/jakeaaron/Documents/Storie/claude-code/channels/examples/channels-vs-other-features.md)
