---
name: agent-teams
description: Claude Code reference entry for enabling and using agent teams. Use when coordinating multiple Claude Code instances that need independent context, shared task coordination, and direct teammate-to-teammate communication.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Agent Teams

This is a focused Claude Code reference entry for agent teams.

## What this entry covers

- what agent teams are
- when to use them
- how they compare with subagents
- how to enable them
- how to start a team in natural language
- how teammates are controlled at a high level

## Core judgment

Agent teams are worth it when parallel work needs:
- independent context windows
- real collaboration between workers
- direct teammate communication

They are not the default answer.

Use them when the coordination overhead buys something real. Otherwise, use a single session or subagents.

## What agent teams are

Agent teams let one Claude Code session act as the lead while multiple teammates work independently in their own contexts.

Important difference from subagents:
- subagents only report back to the main agent
- teammates can communicate directly with each other

You can also interact with individual teammates directly instead of always routing through the lead.

## Version requirement

Agent teams require Claude Code `v2.1.32` or later.

Check with:

```sh
claude --version
```

## When to use agent teams

The strongest use cases are:

- research and review across multiple perspectives
- new modules or features with separable ownership
- debugging with competing hypotheses
- cross-layer work spanning frontend, backend, and tests

## When not to use them

Agent teams add:
- coordination overhead
- significantly higher token cost

They are weaker for:
- sequential tasks
- same-file edits
- tightly coupled work with lots of dependencies

In those cases:
- a single session
- or subagents

is usually the better move.

## Compare with subagents

Use subagents when:
- only the result matters
- the work is focused
- the main agent should stay the sole coordinator

Use agent teams when:
- workers need to communicate
- workers need to challenge each other's findings
- the task benefits from self-coordination and shared ownership

### Summary comparison

Subagents:
- own context window
- report back only to the caller
- lower token cost
- best for focused workers

Agent teams:
- own context window
- communicate directly with each other
- coordinate through a shared task list
- higher token cost
- best for collaborative parallel work

## Enable agent teams

Agent teams are disabled by default.

Enable them with:

`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

You can set that in `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## Start your first team

Once enabled, ask Claude in natural language to create a team and describe the structure you want.

Example:

```text
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles: one
teammate on UX, one on technical architecture, one playing devil's advocate.
```

Why this example works:
- each role is independent
- the work can proceed in parallel
- synthesis benefits from multiple viewpoints

## What happens next

Claude can:
- create the team
- spawn teammates
- assign work
- synthesize findings
- clean up the team when finished

The lead terminal shows:
- teammates
- their current tasks

## Interacting with teammates

You can cycle through teammates in the terminal.

The docs call out:
- `Shift+Down` cycles through teammates
- after the last teammate, it wraps back to the lead

You can also message teammates directly.

## Practical guidance

The real key is independence.

If teammates can each take an area and run without waiting:
- agent teams shine

If everyone is blocked on one evolving thread:
- you’re paying extra tokens for theater

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/manifest.json)
- [examples/enable-agent-teams-settings.json](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/examples/enable-agent-teams-settings.json)
- [examples/first-team-prompt.txt](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/examples/first-team-prompt.txt)
- [examples/subagents-vs-agent-teams.md](/Users/jakeaaron/Documents/Storie/claude-code/agent-teams/examples/subagents-vs-agent-teams.md)
