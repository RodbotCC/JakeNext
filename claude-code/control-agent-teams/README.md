---
name: control-agent-teams
description: Claude Code reference entry for operating agent teams after enablement. Use when choosing teammate display modes, specifying team shape and models, requiring plan approval, directing teammates, coordinating tasks, shutting down teammates, cleaning up teams, or enforcing quality gates.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Control Agent Teams

This is a focused Claude Code reference entry for operating agent teams once they are enabled.

## What this entry covers

- display modes
- specifying teammate count and models
- requiring plan approval
- talking to teammates directly
- assigning and claiming tasks
- shutting down teammates
- cleaning up the team
- quality gates with hooks

## Core judgment

Agent teams work best when you actively shape how the team operates instead of hoping the lead magically improvises the right workflow.

The big control levers are:
- display mode
- team shape
- planning gates
- task discipline
- cleanup discipline

## Choose a display mode

Agent teams support two display modes:

### In-process

All teammates run inside the main terminal.

Properties:
- works in any terminal
- no extra setup required
- use `Shift+Down` to cycle through teammates
- type directly to message them

### Split panes

Each teammate gets its own pane.

Properties:
- you can see all output at once
- you can click into a pane to interact directly
- requires `tmux` or iTerm2

## Default mode

Default is `auto`:
- uses split panes if already inside a tmux session
- otherwise uses in-process

## Configure teammate mode

Set it globally in `~/.claude.json`:

```json
{
  "teammateMode": "in-process"
}
```

Force it for one session:

```sh
claude --teammate-mode in-process
```

## Split-pane requirements

Split-pane mode needs:
- `tmux`
- or iTerm2 with the `it2` CLI

The docs note:
- tmux has known limitations on some operating systems
- it traditionally works best on macOS
- `tmux -CC` in iTerm2 is the suggested entrypoint into tmux

## Specify teammates and models

Claude can decide team size itself, but you can be explicit.

Examples:
- `Create a team with 4 teammates to refactor these modules in parallel.`
- `Use Sonnet for each teammate.`

This is useful when:
- you already know the work partitions
- you want predictable team size
- you want consistent model behavior across workers

## Require plan approval

For risky or complex work, you can require teammates to plan before implementation.

Example:
- `Spawn an architect teammate to refactor the authentication module.`
- `Require plan approval before they make any changes.`

### How it works

The teammate:
- starts in read-only plan mode
- produces a plan
- sends the approval request to the lead

The lead:
- approves
- or rejects with feedback

If rejected:
- the teammate stays in plan mode
- revises
- resubmits

If approved:
- the teammate exits plan mode
- begins implementation

## Influence approval criteria

The lead decides approvals autonomously, so you should give it standards in your prompt.

Examples:
- only approve plans that include test coverage
- reject plans that modify the database schema

## Talk to teammates directly

Each teammate is a full Claude Code session, so you can redirect or refine work directly.

### In-process mode

- `Shift+Down` cycles through teammates
- type to send a message
- `Enter` views a teammate session
- `Escape` interrupts their current turn
- `Ctrl+T` toggles the task list

### Split-pane mode

- click into the teammate pane
- interact with that terminal directly

## Assign and claim tasks

Agent teams coordinate through a shared task list.

Task states:
- pending
- in progress
- completed

Tasks can also have dependencies.

If a task is pending but depends on incomplete work:
- it cannot be claimed yet

### Assignment styles

Lead assigns:
- you tell the lead which task belongs to which teammate

Self-claim:
- teammates pick up the next unassigned, unblocked task on their own

### Race-condition control

Task claiming uses file locking so multiple teammates do not grab the same task at once.

## Shut down teammates

To end a teammate session gracefully, ask the lead to shut it down.

Example:

`Ask the researcher teammate to shut down`

The teammate can:
- approve and exit gracefully
- reject with an explanation

## Clean up the team

When the work is done, ask the lead:

`Clean up the team`

Important rule:
- always use the lead for cleanup

Why:
- the lead checks for active teammates
- cleanup fails if teammates are still running
- teammate-run cleanup can misresolve team context and leave resources messy

So the clean order is:
1. shut down active teammates
2. ask the lead to clean up the team

## Enforce quality gates with hooks

Agent teams support hooks for team-level discipline:

- `TeammateIdle`
- `TaskCreated`
- `TaskCompleted`

### `TeammateIdle`

Runs when a teammate is about to go idle.

Use it when:
- you want feedback before the worker stops
- you want to keep them iterating if the work is not really done

### `TaskCreated`

Runs when a task is being created.

Use it when:
- you want to validate task quality
- enforce naming or structure
- block weak task definitions

### `TaskCompleted`

Runs when a task is being marked complete.

Use it when:
- you want completion gates
- require evidence
- require tests or verification

### Exit code behavior

If these hooks exit with code `2`:
- the action is blocked
- feedback is sent back

This gives you real gates instead of vague hopes.

## Practical operating pattern

A strong default for serious work is:
- explicit teammate roles
- plan approval for risky changes
- direct teammate intervention when drift appears
- strict shutdown before cleanup
- completion gates when correctness matters

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/manifest.json)
- [examples/teammate-mode-config.json](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/examples/teammate-mode-config.json)
- [examples/plan-approval-prompt.txt](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/examples/plan-approval-prompt.txt)
- [examples/task-hooks.json](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/examples/task-hooks.json)
- [examples/team-shutdown-and-cleanup.txt](/Users/jakeaaron/Documents/Storie/claude-code/control-agent-teams/examples/team-shutdown-and-cleanup.txt)
