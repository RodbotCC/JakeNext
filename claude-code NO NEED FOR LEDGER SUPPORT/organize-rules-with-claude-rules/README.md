---
name: organize-rules-with-claude-rules
description: Claude Code reference entry for organizing instructions with `.claude/rules/`, including unconditional rules, path-scoped rules, glob patterns, symlinked rule sets, and user-level rule precedence.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Organize Rules With `.claude/rules/`

This is a focused Claude Code reference entry for splitting project instructions into modular rule files.

## What this entry covers

- when to use `.claude/rules/`
- how rule files are discovered
- unconditional vs path-scoped rules
- `paths` frontmatter
- glob pattern behavior
- symlinked shared rule sets
- user-level rules

## Core judgment

Once `CLAUDE.md` starts turning into a junk drawer, move topic-specific guidance into `.claude/rules/`.

That gives you:
- cleaner project memory
- less context noise
- better scoping
- easier maintenance for teams

If instructions should always be present, keep them in `CLAUDE.md` or an unconditional rule.

If instructions only matter for certain files, use path-scoped rules instead of bloating global context.

## When to use rules

Use `.claude/rules/` when a project is large enough that one giant `CLAUDE.md` becomes messy.

Good rule topics:
- code style
- testing
- security
- API conventions
- frontend-specific patterns
- backend-specific requirements

For task-specific instructions that should not sit in context all the time:
- use skills instead

## Basic setup

Place markdown files under:

```text
.claude/rules/
```

Example structure:

```text
your-project/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
```

Rule files are discovered recursively, so subdirectories are fine:

```text
.claude/rules/frontend/
.claude/rules/backend/
```

## Unconditional rules

Rules without a `paths` field load at launch and apply globally for the project.

They have the same priority level as:

```text
.claude/CLAUDE.md
```

This is the right shape for rules that should always be in play.

Example:

```md
# Testing Rules

- Add tests for behavior changes
- Prefer focused unit tests over broad fixture-heavy integration tests
- Run the project test command before finishing
```

## Path-specific rules

Rules can be scoped using YAML frontmatter with `paths`.

Example:

```md
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

### How they load

Path-scoped rules are not loaded on every turn.

They trigger when Claude works with files matching the pattern, especially when it reads files in those paths.

That keeps the always-on context cleaner.

## Glob patterns

Use glob patterns in `paths` to target file groups.

| Pattern | Matches |
|---|---|
| `**/*.ts` | all TypeScript files in any directory |
| `src/**/*` | all files under `src/` |
| `*.md` | markdown files in the project root |
| `src/components/*.tsx` | React components in a specific directory |

You can use multiple patterns:

```md
---
paths:
  - "src/**/*.{ts,tsx}"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

Brace expansion is useful when one rule applies to several related extensions.

## Share rules across projects with symlinks

`.claude/rules/` supports symlinks.

That means you can maintain a shared rule library and link it into multiple repos.

Examples:

```sh
ln -s ~/shared-claude-rules .claude/rules/shared
ln -s ~/company-standards/security.md .claude/rules/security.md
```

Important behavior:
- symlinks are resolved and loaded normally
- circular symlinks are detected and handled gracefully

This is a clean way to share:
- company standards
- security policy
- repeated team conventions

without copy-pasting the same files into every repository.

## User-level rules

You can also define personal rules in:

```text
~/.claude/rules/
```

Example:

```text
~/.claude/rules/
├── preferences.md
└── workflows.md
```

Use these for:
- your personal coding preferences
- your preferred workflows
- defaults that should follow you across projects

### Precedence

User-level rules load before project rules.

That means:
- project rules have higher priority
- project-specific guidance can override your general habits

Which is exactly what you want most of the time.

## Practical advice

The strongest structure for larger projects is usually:
- `CLAUDE.md` for core project truth
- unconditional rules for topic modules that always matter
- path-scoped rules for file-type or directory-specific behavior
- user rules for personal preferences
- symlinked shared rules for reusable org standards

That gives you a memory stack that stays readable instead of turning into a landfill.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/manifest.json)
- [examples/rules-tree.txt](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/rules-tree.txt)
- [examples/testing.md](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/testing.md)
- [examples/api-rule.md](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/api-rule.md)
- [examples/multi-pattern-rule.md](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/multi-pattern-rule.md)
- [examples/symlink-commands.sh](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/symlink-commands.sh)
- [examples/user-rules-tree.txt](/Users/jakeaaron/Documents/Storie/claude-code/organize-rules-with-claude-rules/examples/user-rules-tree.txt)
