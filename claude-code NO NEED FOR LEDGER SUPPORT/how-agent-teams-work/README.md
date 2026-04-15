---
name: how-agent-teams-work
description: Claude Code reference entry for agent team architecture, runtime mechanics, teammate context and communication, best practices, troubleshooting, and current limitations. Use when you need to understand how agent teams behave under the hood and how to run them well.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# How Agent Teams Work

This is a focused Claude Code reference entry for the architecture and mechanics behind agent teams.

## What this entry covers

- how teams get started
- architecture and local storage
- how subagent definitions apply to teammates
- permissions inheritance
- teammate context and communication
- token usage realities
- strong use-case patterns
- best practices
- troubleshooting
- current limitations

## Core judgment

Agent teams are powerful because each teammate gets a real independent context window and can coordinate with peers.

They are expensive because each teammate is a real independent context window and can coordinate with peers.

That means the win condition is not "more agents." The win condition is:
- good decomposition
- enough independence
- active steering
- disciplined cleanup

## How teams get started

There are two start paths:

### 1. You request a team

You explicitly ask Claude to create one for a task that benefits from parallel work.

### 2. Claude proposes a team

Claude may suggest a team if it judges that parallel work would help.

In both cases:
- you approve before the team is created

Claude does not silently spin up a team without your consent.

## Architecture

An agent team has four key parts:

| Component | Role |
| --- | --- |
| Team lead | Main Claude Code session that creates the team and coordinates work |
| Teammates | Separate Claude Code instances working assigned tasks |
| Task list | Shared work list that teammates claim and complete |
| Mailbox | Messaging system for communication between agents |

## Automatic dependency behavior

The system manages task dependencies automatically.

When a teammate completes a task:
- dependent blocked tasks can unblock without manual intervention

## Local storage

Teams and tasks are stored locally.

Team config:

`~/.claude/teams/{team-name}/config.json`

Task list:

`~/.claude/tasks/{team-name}/`

Important warning:
- do not hand-edit the generated team config
- Claude Code overwrites it during runtime state updates

The team config holds runtime state like:
- session IDs
- tmux pane IDs
- member information

If you want reusable roles, define subagents instead of trying to pre-author team config files.

## Use subagent definitions for teammates

Teammates can be spawned using subagent definitions from any supported subagent scope:
- project
- user
- plugin
- CLI-defined

This is useful because one role definition can serve two jobs:
- reusable subagent
- reusable teammate type

Example natural-language instruction:

`Spawn a teammate using the security-reviewer agent type to audit the auth module.`

### What carries over

When used as a teammate, the subagent definition contributes:
- tool allowlist
- model
- body content appended as additional instructions

### What does not carry over

When used as a teammate, these frontmatter fields are **not** applied:
- `skills`
- `mcpServers`

Teammates instead load:
- project settings
- user settings
- project/user MCP servers and skills

### Team tools exception

Even if the subagent restricts tools, teammates still get team coordination tools such as:
- `SendMessage`
- task-management tools

## Permissions

Teammates start with the lead's permission settings.

Important rule:
- if the lead runs with `--dangerously-skip-permissions`, all teammates do too

After spawn:
- you can change individual teammate modes

At spawn time:
- you cannot set per-teammate modes

## Context and communication

Each teammate has its own context window.

When spawned, it loads the same project context as a regular session:
- `CLAUDE.md`
- MCP servers
- skills

It also receives:
- the spawn prompt from the lead

It does **not** receive:
- the lead's conversation history

### How teammates share information

- automatic message delivery
- idle notifications back to the lead
- shared task list visibility

### Messaging modes

`message`
- send to one specific teammate

`broadcast`
- send to all teammates

Use `broadcast` sparingly, because the cost scales with team size.

### Naming teammates

The lead assigns teammate names when spawning them.

If you want predictable references later:
- tell the lead what to call each teammate in your prompt

## Token usage

Agent teams are significantly more expensive than a single session.

Why:
- each teammate has its own context window
- token usage scales with the number of active teammates

This cost is usually worth it for:
- research
- review
- new feature design or architecture work

It is often not worth it for:
- routine tasks
- tightly coupled edits
- quick sequential work

## Use-case patterns

### Parallel code review

This works well when you want distinct review lenses running simultaneously.

Example structure:
- one teammate for security
- one for performance
- one for test coverage

The lead then synthesizes findings across the perspectives.

### Competing hypotheses

This is one of the strongest patterns in the whole page.

Instead of letting one agent anchor on the first plausible theory, you:
- spawn multiple investigators
- give them different hypotheses
- let them challenge each other

That reduces anchoring and can converge on the real root cause faster.

## Best practices

### Give teammates enough context

They get project context automatically, but not the lead's conversation history.

So include task-specific details in the spawn prompt:
- exact module or path
- what lens to use
- what to report
- any constraints or domain specifics

### Choose team size carefully

There is no hard limit, but practical limits absolutely exist.

Good default:
- start with 3 to 5 teammates

Reason:
- manageable coordination
- good parallelism
- lower chaos than oversized teams

The docs also suggest roughly:
- 5 to 6 tasks per teammate

If you have 15 independent tasks:
- 3 teammates is a good starting point

### Size tasks well

Too small:
- coordination cost dominates

Too large:
- teammates wander too long without feedback

Good size:
- self-contained unit with a clear deliverable

Examples:
- a function
- a test file
- a review pass

### Wait for teammates to finish

Sometimes the lead starts doing the work itself too early.

If that happens, explicitly tell it:
- wait for teammates to complete before proceeding

### Start with research and review

If you are new to teams, use them first for:
- review
- research
- investigation

These show the value of parallel exploration without the file-conflict pain of simultaneous implementation.

### Avoid file conflicts

Do not let two teammates own the same file if you can avoid it.

Break work so each teammate owns:
- different files
- or clearly separated areas

### Monitor and steer

Do not let the team run unattended forever.

Check in, redirect, and synthesize as results arrive.

## Troubleshooting

### Teammates not appearing

Check:
- in-process mode may already have them running; use `Shift+Down`
- the task may not be complex enough to warrant a team
- if split panes were requested, verify `tmux` is installed with `which tmux`
- for iTerm2, verify the `it2` CLI and Python API setup

### Too many permission prompts

Pre-approve common operations before spawning teammates to reduce lead-side interruption.

### Teammates stopping on errors

Inspect their output and then either:
- give them more instructions directly
- or spawn a replacement teammate

### Lead stops too early

If the lead declares victory too soon:
- tell it to keep going
- or tell it explicitly to wait for teammates to finish before proceeding

### Orphaned tmux sessions

If cleanup fails cleanly, you may need:

```sh
tmux ls
tmux kill-session -t <session-name>
```

## Limitations

Current limitations called out in the docs:

- no session resumption for in-process teammates via `/resume` or `/rewind`
- task status can lag
- shutdown can be slow
- one team per session
- no nested teams
- lead is fixed for the lifetime of the team
- permissions are inherited at spawn
- split panes require `tmux` or iTerm2
- split-pane mode is not supported in VS Code integrated terminal, Windows Terminal, or Ghostty

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/manifest.json)
- [examples/parallel-code-review.txt](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/examples/parallel-code-review.txt)
- [examples/competing-hypotheses.txt](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/examples/competing-hypotheses.txt)
- [examples/context-rich-spawn-prompt.txt](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/examples/context-rich-spawn-prompt.txt)
- [examples/team-storage-paths.md](/Users/jakeaaron/Documents/Storie/claude-code/how-agent-teams-work/examples/team-storage-paths.md)
