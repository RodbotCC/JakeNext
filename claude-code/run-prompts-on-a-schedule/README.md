---
name: run-prompts-on-a-schedule
description: Claude Code reference entry for session-scoped scheduled prompts using /loop and cron tools. Use when polling within an active session, setting one-time reminders, or managing short-lived recurring tasks tied to the current Claude Code process.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Run Prompts On A Schedule

This is a focused Claude Code reference entry for scheduled prompts inside a live session.

## What this entry covers

- when scheduled tasks are useful
- how `/loop` works
- interval parsing
- one-time reminders
- the underlying cron tools
- task runtime behavior
- jitter
- seven-day expiry
- cron syntax limits
- when to use Cloud or Desktop scheduling instead

## Core judgment

Use session-scoped scheduling when you want lightweight polling or reminders while Claude Code is already open.

Do not use it when you need:
- persistence across restarts
- guaranteed unattended execution
- durable long-running automation

For those, use:
- Cloud scheduled tasks
- Desktop scheduled tasks
- or GitHub Actions

## Version requirement

Scheduled tasks require Claude Code `v2.1.72` or later.

Check with:

```sh
claude --version
```

## What scheduled tasks are

Scheduled tasks let Claude re-run a prompt automatically on an interval inside the current session.

Good fit:
- poll a deployment
- babysit a PR
- check on a long-running build
- remind yourself later in the session

Important limitation:
- tasks are session-scoped
- when the session exits, the tasks are gone

## Compare scheduling options

Claude Code exposes three scheduling modes:

### Cloud

Use when:
- your machine should not have to stay on
- persistence matters
- fresh cloud execution is acceptable

### Desktop

Use when:
- local files and tools matter
- persistence across local restarts matters

### `/loop`

Use when:
- the current session is already open
- quick polling is enough
- session-scoped scheduling is fine

## Schedule a recurring prompt with `/loop`

The fastest path is:

```text
/loop 5m check if the deployment finished and tell me what happened
```

Claude:
- parses the interval
- converts it to cron
- creates the scheduled task
- confirms cadence and job ID

## Interval syntax

Intervals can be:
- leading
- trailing
- omitted

### Leading token

```text
/loop 30m check the build
```

### Trailing every clause

```text
/loop check the build every 2 hours
```

### No interval

```text
/loop check the build
```

Default:
- every 10 minutes

### Units

Supported:
- `s`
- `m`
- `h`
- `d`

Seconds are rounded up to the nearest minute because cron uses minute granularity.

Intervals that do not divide cleanly into their unit are rounded to a clean interval and Claude tells you what it chose.

## Loop over another command

The scheduled prompt can itself be another command or skill.

Example:

```text
/loop 20m /review-pr 1234
```

Each time the job fires, Claude runs that command as if you had typed it.

## Set a one-time reminder

For a single fire, just describe it naturally.

Examples:
- `remind me at 3pm to push the release branch`
- `in 45 minutes, check whether the integration tests passed`

Claude:
- pins the time to a specific minute/hour
- schedules the task
- confirms when it will fire

## Manage scheduled tasks

You can ask in natural language:
- `what scheduled tasks do I have?`
- `cancel the deploy check job`

Under the hood, Claude uses:

| Tool | Purpose |
| --- | --- |
| `CronCreate` | Create a task |
| `CronList` | List current tasks |
| `CronDelete` | Delete a task by ID |

Important detail:
- each task has an 8-character ID
- a session can hold up to 50 scheduled tasks

## How scheduled tasks run

The scheduler:
- checks every second for due tasks
- enqueues them at low priority

A task fires:
- between turns
- not in the middle of Claude already responding

If Claude is busy when a task becomes due:
- it waits until the current turn ends

## Timezone behavior

All times use your local timezone.

So:

`0 9 * * *`

means 9am wherever Claude Code is running, not UTC.

## Jitter

The scheduler adds deterministic jitter to avoid synchronized API spikes.

### Recurring tasks

They can fire:
- up to 10% of their period late
- capped at 15 minutes

Example:
- an hourly job may fire between `:00` and `:06`

### One-shot tasks

If scheduled at:
- top of hour
- or bottom of hour

they can fire:
- up to 90 seconds early

### Determinism

The offset is derived from the task ID, so the same task always gets the same offset.

### Timing tip

If exact timing matters, avoid `:00` and `:30`.

Example:
- use `3 9 * * *`
- instead of `0 9 * * *`

## Seven-day expiry

Recurring tasks automatically expire 7 days after creation.

Behavior:
- the task fires one final time
- then deletes itself

This keeps forgotten loops from running forever.

If you need longer-lived recurring work:
- recreate it before expiry
- or move to Cloud/Desktop scheduled tasks

## Cron expression reference

`CronCreate` accepts standard 5-field cron:

- minute
- hour
- day-of-month
- month
- day-of-week

Supported syntax:
- `*`
- single values
- steps
- ranges
- comma-separated lists

Examples:

| Expression | Meaning |
| --- | --- |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour on the hour |
| `7 * * * *` | Every hour at 7 minutes past |
| `0 9 * * *` | Every day at 9am |
| `0 9 * * 1-5` | Weekdays at 9am |
| `30 14 15 3 *` | March 15 at 2:30pm |

### Notes

- day-of-week uses `0` or `7` for Sunday through `6` for Saturday
- aliases like `MON` or `JAN` are not supported
- extended syntax like `L`, `W`, and `?` is not supported
- if both day-of-month and day-of-week are constrained, either match is enough

## Disable scheduled tasks

Disable the scheduler entirely with:

`CLAUDE_CODE_DISABLE_CRON=1`

When disabled:
- `/loop` is unavailable
- cron tools are unavailable
- already-scheduled tasks stop firing

## Key limitations

### Session-scoped only

Tasks only fire while Claude Code is:
- running
- and able to process them

### No persistence across restarts

Restarting Claude Code clears session-scoped tasks.

### No catch-up for missed fires

If Claude is busy during multiple scheduled intervals:
- it does not replay every missed run
- it fires once when Claude becomes idle

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/manifest.json)
- [examples/loop-deploy-check.txt](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/examples/loop-deploy-check.txt)
- [examples/loop-review-pr.txt](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/examples/loop-review-pr.txt)
- [examples/one-time-reminder.txt](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/examples/one-time-reminder.txt)
- [examples/cron-reference.md](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/examples/cron-reference.md)
- [examples/disable-cron.sh](/Users/jakeaaron/Documents/Storie/claude-code/run-prompts-on-a-schedule/examples/disable-cron.sh)
