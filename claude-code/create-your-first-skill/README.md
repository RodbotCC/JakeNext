---
name: create-your-first-skill
description: Claude Code reference entry for creating a first skill with SKILL.md, frontmatter, automatic invocation behavior, and skill directory placement across personal, project, enterprise, plugin, and nested directory scopes.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Create Your First Skill

This is a focused Claude Code reference entry for creating a first skill.

## What this entry covers

- creating the skill directory
- writing `SKILL.md`
- skill frontmatter and body structure
- automatic and direct invocation
- where skills live
- nested discovery behavior
- the `--add-dir` skill exception

## Core judgment

The clean default for a first skill is:
- one skill directory
- one `SKILL.md`
- a sharp description that tells Claude when to use it
- a body that gives a simple, repeatable behavior pattern

Do not overbuild the first version. Make the skill obvious, testable, and easy to invoke.

## First skill flow

### 1. Create the directory

Personal skills live in:

```sh
mkdir -p ~/.claude/skills/explain-code
```

This makes the skill available across all your projects.

### 2. Write `SKILL.md`

Every skill needs a `SKILL.md` file with:
- YAML frontmatter between `---` markers
- Markdown instructions below it

Example:

```md
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.
```

## What the frontmatter does

The frontmatter tells Claude:
- the skill name
- when it should be loaded automatically

### `name`

The `name` becomes the slash command:

```text
/explain-code
```

### `description`

The `description` helps Claude decide when to invoke the skill automatically.

This is the most important line to get right.

Good descriptions are:
- concrete
- usage-oriented
- written in terms of user intent

## What the body does

The Markdown body tells Claude how to behave when the skill is invoked.

Put the operating pattern there:
- what to include
- what order to follow
- what style to use
- what to emphasize

## How to test the skill

You can test it two ways.

### Automatic invocation

Ask for something that matches the description:

```text
How does this code work?
```

### Direct invocation

Invoke it directly:

```text
/explain-code src/auth/login.ts
```

If the skill is wired correctly, Claude should follow the instructions in the skill body.

## Where skills live

Skill location controls scope.

| Location | Path | Applies to |
|---|---|---|
| Enterprise | managed settings | all users in the organization |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | all your projects |
| Project | `.claude/skills/<skill-name>/SKILL.md` | current project only |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | where the plugin is enabled |

### Priority

When skills share the same name, higher-priority locations win:
- enterprise
- personal
- project

Plugin skills use a namespaced form like:
- `plugin-name:skill-name`

So they do not collide with the other scopes.

### Skills vs commands

Files in `.claude/commands/` still work, but skills are the preferred format because they support supporting files.

If a skill and a command share the same name:
- the skill wins

## Nested discovery

Claude Code can discover skills from nested directories.

Example:
- if you are working in `packages/frontend/`
- Claude Code can also load skills from `packages/frontend/.claude/skills/`

This is especially useful in monorepos where packages need their own local behaviors.

## Skill directory shape

Each skill is a directory with `SKILL.md` as the entrypoint:

```text
my-skill/
├── SKILL.md
├── template.md
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```

Only `SKILL.md` is required.

Other files are optional and useful for:
- templates
- examples
- scripts
- reference material

Reference those files from `SKILL.md` so Claude knows when to load them.

## `--add-dir` behavior

`--add-dir` normally grants file access, not configuration discovery.

Skills are the exception.

If an added directory contains:

```text
.claude/skills/
```

those skills are loaded automatically and picked up by live change detection.

Important limitation:
- other `.claude/` config from added directories is not loaded the same way

### `CLAUDE.md` in added directories

`CLAUDE.md` files from `--add-dir` directories are not loaded by default.

To load them, set:

```sh
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1
```

## Practical advice

For a first skill:
- make the description trigger-friendly
- keep the instructions procedural
- test both auto-loading and slash invocation
- add supporting files only when they make the skill noticeably better

Start small and make it crisp. Skills get powerful fast once the entrypoint is clean.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/create-your-first-skill/manifest.json)
- [examples/explain-code/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/create-your-first-skill/examples/explain-code/SKILL.md)
- [examples/skill-directory-layout.txt](/Users/jakeaaron/Documents/Storie/claude-code/create-your-first-skill/examples/skill-directory-layout.txt)
- [examples/project-skill-location.txt](/Users/jakeaaron/Documents/Storie/claude-code/create-your-first-skill/examples/project-skill-location.txt)
- [examples/add-dir-skill-note.txt](/Users/jakeaaron/Documents/Storie/claude-code/create-your-first-skill/examples/add-dir-skill-note.txt)
