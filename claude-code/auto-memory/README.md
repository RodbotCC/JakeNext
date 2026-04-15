---
name: auto-memory
description: Claude Code reference entry for auto memory, including enablement, storage layout, startup loading behavior, MEMORY.md structure, /memory workflow, and common troubleshooting.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Auto Memory

This is a focused Claude Code reference entry for how Claude accumulates project knowledge automatically across sessions.

## What this entry covers

- what auto memory is
- how to enable or disable it
- where memory is stored
- how startup loading works
- auditing and editing memory
- common troubleshooting patterns

## Core judgment

Use auto memory for things Claude should learn.

Use `CLAUDE.md` for things you want to state explicitly.

If a rule matters every time and you care about wording, put it in `CLAUDE.md`. If it is a useful pattern Claude can accumulate over time, let auto memory carry it.

## What auto memory is

Auto memory lets Claude write notes for itself as it works.

Typical things it may save:
- build commands
- debugging insights
- architecture notes
- code style preferences
- workflow habits

Important behavior:
- Claude does not save something every session
- it decides what is worth remembering for future work

Auto memory requires Claude Code `v2.1.59` or later.

## Enable or disable auto memory

Auto memory is on by default.

### Toggle it in the UI

Use:

```text
/memory
```

and flip the auto memory toggle.

### Project setting

You can disable it in settings with:

```json
{
  "autoMemoryEnabled": false
}
```

### Environment variable

To disable it through the environment:

```sh
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

## Storage location

Each project gets its own memory directory:

```text
~/.claude/projects/<project>/memory/
```

The `<project>` path is derived from the git repository, so:
- all worktrees in the same repo share one auto memory directory
- all subdirectories in the same repo share it too

Outside a git repo, Claude uses the project root instead.

### Custom location

You can redirect memory storage with:

```json
{
  "autoMemoryDirectory": "~/my-custom-memory-dir"
}
```

Important restriction:
- this is allowed from policy, local, and user settings
- it is not allowed from project settings

That prevents shared projects from redirecting memory writes somewhere sketchy.

## Memory directory layout

Typical structure:

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md
├── debugging.md
├── api-conventions.md
└── ...
```

### `MEMORY.md`

`MEMORY.md` is the entrypoint.

It acts like:
- an index
- a summary
- a routing layer for deeper topic files

### Topic files

Claude can create separate files for more detailed notes:
- `debugging.md`
- `api-conventions.md`
- other focused topic files

Auto memory is machine-local:
- not shared across machines
- not shared with cloud environments

## How startup loading works

At session start, Claude loads:
- the first 200 lines of `MEMORY.md`
- or the first 25KB
- whichever comes first

Everything beyond that threshold is skipped at startup.

That limit applies only to:
- `MEMORY.md`

It does not apply to:
- `CLAUDE.md`

### Why this matters

`MEMORY.md` should stay concise.

Detailed notes belong in topic files, because:
- topic files are not loaded automatically at startup
- Claude reads them on demand when needed

### On-demand memory reads

During a session, Claude may read and write memory files directly.

When the interface shows:
- “Writing memory”
- “Recalled memory”

Claude is actively using files in the memory directory.

## Audit and edit your memory

Auto memory files are plain markdown.

You can:
- read them
- edit them
- delete them

at any time.

### `/memory`

Run:

```text
/memory
```

This lets you:
- browse `CLAUDE.md`, `CLAUDE.local.md`, and rules files loaded in the current session
- toggle auto memory on or off
- open the auto memory folder

If you want Claude to remember something, you can tell it directly:
- “always use pnpm, not npm”
- “remember that API tests require local Redis”

If you want something added to `CLAUDE.md` instead, say that explicitly.

## Troubleshooting

### Claude is not following `CLAUDE.md`

Important detail:
- `CLAUDE.md` is delivered as a user message after the system prompt
- it is not part of the system prompt itself

That means it guides behavior, but does not enforce it perfectly.

Debug steps:
- run `/memory` and confirm the file is loaded
- verify the file is in a loadable location
- make instructions more specific
- look for conflicts across `CLAUDE.md`, `CLAUDE.local.md`, and rules files

If you need system-prompt-level instructions for automation, use:

```text
--append-system-prompt
```

### You do not know what auto memory saved

Use:

```text
/memory
```

then open the auto memory folder and inspect the markdown files directly.

### `CLAUDE.md` is too large

If a file grows past about 200 lines:
- split it
- move topic-specific content into imported files
- or move scoped guidance into `.claude/rules/`

### Instructions seem lost after `/compact`

`CLAUDE.md` survives compaction.

After `/compact`, Claude re-reads it from disk and injects it again.

If an instruction vanished after compaction, it means:
- it lived only in conversation
- it was not written to `CLAUDE.md`

Write it to disk if you want it to persist.

### Log instruction loading

The `InstructionsLoaded` hook is useful for debugging:
- which instruction files loaded
- when they loaded
- why they loaded

That is especially helpful for path-specific rules and lazy-loaded subdirectory instructions.

## Practical advice

The clean model is:
- `CLAUDE.md` for explicit, durable instructions
- auto memory for learned patterns and useful discoveries
- `/memory` for inspection and cleanup

If Claude keeps forgetting something important, stop hoping auto memory will infer your intent and put the instruction in `CLAUDE.md`.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/manifest.json)
- [examples/auto-memory-disabled.json](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/examples/auto-memory-disabled.json)
- [examples/custom-memory-directory.json](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/examples/custom-memory-directory.json)
- [examples/memory-tree.txt](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/examples/memory-tree.txt)
- [examples/disable-auto-memory.sh](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/examples/disable-auto-memory.sh)
- [examples/memory-requests.txt](/Users/jakeaaron/Documents/Storie/claude-code/auto-memory/examples/memory-requests.txt)
