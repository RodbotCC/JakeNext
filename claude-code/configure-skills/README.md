---
name: configure-skills
description: Claude Code reference entry for configuring skills through SKILL.md frontmatter, argument substitution, invocation rules, allowed tools, supporting files, and forked skill execution.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Configure Skills

This is a focused Claude Code reference entry for configuring skills after you have the basic skill directory in place.

## What this entry covers

- skill content types
- frontmatter fields
- string substitutions
- supporting files
- controlling who can invoke a skill
- restricting tool access
- passing arguments to skills

## Core judgment

A strong skill keeps the split clean:
- frontmatter controls invocation and runtime behavior
- markdown body controls what Claude should actually do

If a skill starts feeling crowded, the answer is usually:
- tighten the description
- move reference material into supporting files
- keep `SKILL.md` as the sharp entrypoint

## Two useful skill shapes

### Reference content

Reference skills add knowledge Claude can apply inline to current work.

Example:

```md
---
name: api-conventions
description: API design patterns for this codebase
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
```

Use this shape for:
- conventions
- style guides
- architectural patterns
- domain knowledge

### Task content

Task skills are more like reusable workflows you often invoke directly.

Example:

```md
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

Use this shape for:
- deploy flows
- commit flows
- issue-fixing flows
- operational procedures

## Frontmatter reference

All frontmatter fields are optional, but `description` is strongly recommended.

Example:

```md
---
name: my-skill
description: What this skill does
disable-model-invocation: true
allowed-tools: Read Grep
---

Your skill instructions here...
```

### Core fields

- `name`
  Display name for the skill. If omitted, Claude uses the directory name.

- `description`
  What the skill does and when to use it. Claude uses this to decide when to apply the skill.

- `argument-hint`
  Hint shown in autocomplete, like `[issue-number]` or `[filename] [format]`.

### Invocation control

- `disable-model-invocation`
  Set to `true` when only the user should trigger the skill.

- `user-invocable`
  Set to `false` to hide the skill from the `/` menu and make it Claude-only.

### Tool and runtime control

- `allowed-tools`
  Tools Claude can use without asking permission while the skill is active.

- `model`
  Model to use while the skill is active.

- `effort`
  `low`, `medium`, `high`, or `max`.

- `context`
  Set to `fork` to run in a forked subagent context.

- `agent`
  Which subagent type to use when `context: fork` is set.

- `hooks`
  Hooks scoped to the skill lifecycle.

- `paths`
  Glob patterns limiting when the skill activates automatically.

- `shell`
  Shell for inline `!` commands and fenced `!` blocks. `bash` by default, or `powershell` when supported.

## String substitutions

Skills support dynamic substitutions.

### Arguments

- `$ARGUMENTS`
  All arguments passed to the skill.

- `$ARGUMENTS[N]`
  Specific argument by zero-based index.

- `$N`
  Short form of `$ARGUMENTS[N]`.

### Session and location

- `${CLAUDE_SESSION_ID}`
  Current session ID.

- `${CLAUDE_SKILL_DIR}`
  Directory containing the current `SKILL.md`.

Example:

```md
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

## Supporting files

Skills can include more than `SKILL.md`.

Example layout:

```text
my-skill/
├── SKILL.md
├── reference.md
├── examples.md
└── scripts/
    └── helper.py
```

This is the right move when:
- reference docs are large
- examples would clutter the entrypoint
- scripts are useful but should be executed, not inlined

Reference supporting files from `SKILL.md` so Claude knows what to load and when.

Example:

```md
## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

Practical rule:
- keep `SKILL.md` under 500 lines

## Control who invokes a skill

By default:
- you can invoke the skill
- Claude can invoke the skill

### User-only skills

Use:

```yaml
disable-model-invocation: true
```

This is right for skills with side effects or timing-sensitive actions:
- deploy
- commit
- send-message

### Claude-only skills

Use:

```yaml
user-invocable: false
```

This is right for background knowledge that should inform work but not appear as a user-facing command.

### Invocation behavior summary

- default:
  You can invoke it, Claude can invoke it, description stays in context.

- `disable-model-invocation: true`:
  You can invoke it, Claude cannot, and the description is not kept in context for auto-selection.

- `user-invocable: false`:
  Claude can invoke it, you cannot from the slash menu, and the description stays in context.

## Restrict tool access

Use `allowed-tools` to narrow what Claude can do while the skill is active.

Example:

```md
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read Grep Glob
---
```

This is a clean way to make a skill read-only by design.

## Pass arguments to skills

Both you and Claude can pass arguments to a skill invocation.

Example:

```md
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.

1. Read the issue description
2. Understand the requirements
3. Implement the fix
4. Write tests
5. Create a commit
```

Running:

```text
/fix-issue 123
```

replaces `$ARGUMENTS` with:

```text
123
```

### If `$ARGUMENTS` is missing

If you pass arguments but the skill body does not include `$ARGUMENTS`, Claude Code appends:

```text
ARGUMENTS: <your input>
```

to the end of the skill content.

### Positional arguments

Example:

```md
---
name: migrate-component
description: Migrate a component from one framework to another
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

Running:

```text
/migrate-component SearchBar React Vue
```

produces:
- `$0` → `SearchBar`
- `$1` → `React`
- `$2` → `Vue`

## Practical advice

When configuring a skill:
- make `description` do real routing work
- use `disable-model-invocation` for side-effectful workflows
- use `user-invocable: false` for hidden background knowledge
- keep `SKILL.md` concise and push detail into supporting files
- use argument placeholders intentionally instead of vague freeform prompts

Good skill config makes the skill feel predictable before Claude even starts reasoning.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/manifest.json)
- [examples/api-conventions/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/examples/api-conventions/SKILL.md)
- [examples/deploy/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/examples/deploy/SKILL.md)
- [examples/fix-issue/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/examples/fix-issue/SKILL.md)
- [examples/migrate-component/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/examples/migrate-component/SKILL.md)
- [examples/supporting-files-layout.txt](/Users/jakeaaron/Documents/Storie/claude-code/configure-skills/examples/supporting-files-layout.txt)
