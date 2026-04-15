---
name: how-claude-remembers-your-project
description: Claude Code reference entry for persistent project memory through CLAUDE.md files, loading order, imports, AGENTS.md bridging, and loading behavior across nested and additional directories.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# How Claude Remembers Your Project

This is a focused Claude Code reference entry for how persistent project context works across sessions.

## What this entry covers

- `CLAUDE.md` vs auto memory
- where `CLAUDE.md` files live
- writing effective instructions
- imports with `@path`
- using `AGENTS.md`
- load order and directory walking
- additional-directory behavior

## Core judgment

Use `CLAUDE.md` for deliberate, human-authored guidance.

Use auto memory for learned patterns and corrections Claude accumulates over time.

If you want Claude to reliably behave a certain way across sessions, start with a tight `CLAUDE.md` before you start stuffing more clever machinery around it.

## Two memory systems

Claude Code has two complementary mechanisms that carry knowledge across fresh sessions.

| System | Who writes it | What it contains | Scope | Best for |
|---|---|---|---|---|
| `CLAUDE.md` | You | instructions and rules | project, user, or org | standards, workflows, architecture |
| auto memory | Claude | learnings and patterns | per working tree | discovered commands, debugging notes, preferences |

Important behavior:
- both are loaded at session start
- both are treated as context, not hard enforcement
- concise, specific instructions work better than vague prose

## Where `CLAUDE.md` files live

`CLAUDE.md` can exist at several scopes.

| Scope | Location | Purpose |
|---|---|---|
| Managed policy | platform-specific managed location | organization-wide instructions |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | team-shared project rules |
| User | `~/.claude/CLAUDE.md` | your personal global preferences |
| Local | `./CLAUDE.local.md` | your personal project-specific notes |

### What each is for

- managed policy:
  company-wide standards, compliance, security rules

- project:
  architecture, build/test commands, team conventions

- user:
  your personal preferences across projects

- local:
  personal project notes that should not be committed

## Set up a project `CLAUDE.md`

Project instructions can live in either:
- `./CLAUDE.md`
- `./.claude/CLAUDE.md`

Good project content includes:
- build and test commands
- coding standards
- architectural decisions
- naming conventions
- common workflows

### `/init`

You can bootstrap this with:

```text
/init
```

Claude analyzes the codebase and proposes a starting `CLAUDE.md`.

If a file already exists:
- `/init` suggests improvements instead of overwriting it

### New init flow

Set:

```sh
CLAUDE_CODE_NEW_INIT=1
```

to enable the multi-phase flow where `/init` can also help set up:
- `CLAUDE.md`
- skills
- hooks

## Write effective instructions

`CLAUDE.md` lives in the startup context window, so quality matters more than volume.

### Size

Target:
- under 200 lines per file

If it grows too large:
- split by topic
- import supporting files
- move scoped guidance into `.claude/rules/`

### Structure

Use:
- headers
- bullets
- short sections

Dense walls of prose are weaker than organized instructions.

### Specificity

Prefer:
- "Use 2-space indentation"
- "Run npm test before committing"
- "API handlers live in src/api/handlers/"

over vague instructions like:
- "Format code properly"
- "Test your changes"
- "Keep files organized"

### Consistency

If your instructions conflict:
- Claude may follow one arbitrarily

Review:
- root `CLAUDE.md`
- nested `CLAUDE.md`
- `.claude/rules/`

to keep the rule set coherent.

## Import additional files

`CLAUDE.md` files can import other files using:

```text
@path/to/file
```

Example:

```md
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

### Import rules

- relative paths resolve relative to the file containing the import
- absolute paths are allowed
- imports can recurse up to five hops deep

### Personal per-project preferences

For private notes that should not go into version control, use:

```text
CLAUDE.local.md
```

and add it to `.gitignore`.

If you need personal instructions shared across multiple worktrees, import from your home directory instead:

```md
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

### External import approval

The first time Claude Code encounters external imports in a project, it shows an approval dialog listing those files.

If you decline:
- imports remain disabled
- the dialog does not keep reappearing

## `AGENTS.md`

Claude Code reads `CLAUDE.md`, not `AGENTS.md`.

If the repo already uses `AGENTS.md` for other agents, the clean bridge is:

```md
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```

This avoids duplicating instructions while still giving Claude-specific guidance.

## How loading works

Claude Code walks up the directory tree from the current working directory, looking for:
- `CLAUDE.md`
- `CLAUDE.local.md`

If you start in `foo/bar/`, Claude can load:
- `foo/bar/CLAUDE.md`
- `foo/bar/CLAUDE.local.md`
- `foo/CLAUDE.md`
- `foo/CLAUDE.local.md`

### Important behavior

- discovered files are concatenated, not overridden
- within a directory, `CLAUDE.local.md` is appended after `CLAUDE.md`
- when instructions conflict at the same level, local notes are later in the stream

### Subdirectories

Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` in subdirectories below the current working directory.

Those do not load at launch.

Instead:
- they load on demand when Claude reads files in those subdirectories

### Maintainer comments

Block HTML comments are stripped before content is injected:

```html
<!-- maintainer notes -->
```

That means you can leave human notes without spending context tokens.

Inside code blocks, comments are preserved.

If Claude opens the file directly with the Read tool, comments remain visible there.

## Loading from additional directories

`--add-dir` gives file access to additional directories outside the main working tree.

By default:
- `CLAUDE.md` from added directories is not loaded

To load it, set:

```sh
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

This enables loading from added directories for:
- `CLAUDE.md`
- `.claude/CLAUDE.md`
- `.claude/rules/*.md`

Important limitation:
- `CLAUDE.local.md` from additional directories is not loaded

## Practical advice

The strongest pattern is:
- keep project truth in project `CLAUDE.md`
- keep your personal style in `~/.claude/CLAUDE.md`
- keep project-private personal quirks in `CLAUDE.local.md`
- import large or specialized docs instead of bloating the root file

If Claude is acting weird across sessions, the first place to look is not the model. It is usually the instruction stack.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/manifest.json)
- [examples/project-claude-md.md](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/examples/project-claude-md.md)
- [examples/claude-local-md.md](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/examples/claude-local-md.md)
- [examples/claude-imports.md](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/examples/claude-imports.md)
- [examples/agents-bridge.md](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/examples/agents-bridge.md)
- [examples/load-additional-directories.sh](/Users/jakeaaron/Documents/Storie/claude-code/how-claude-remembers-your-project/examples/load-additional-directories.sh)
