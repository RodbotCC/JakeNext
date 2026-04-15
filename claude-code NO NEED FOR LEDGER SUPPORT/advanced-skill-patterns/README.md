---
name: advanced-skill-patterns
description: Claude Code reference entry for advanced skill patterns including shell injection, forked skill execution, skill access control, visual-output skills, and common troubleshooting.
status: draft
source_type: claude-code-docs-derived-entry
entry_type: claude-code-reference
---

# Advanced Skill Patterns

This is a focused Claude Code reference entry for pushing skills past the basic `SKILL.md` pattern.

## What this entry covers

- dynamic context injection with `!` commands
- `context: fork` and running skills in a subagent
- restricting Claude's access to skills
- sharing skills
- bundling scripts for visual output
- common troubleshooting patterns

## Core judgment

The jump from "simple skill" to "seriously useful skill" usually happens in one of three ways:
- inject live context before Claude sees the prompt
- run the skill in an isolated subagent
- bundle a script so the skill can produce real artifacts

That is where skills stop being clever notes and start becoming workflows.

## Inject dynamic context

Use inline shell injection when the skill needs live data at invocation time.

Inline form:

```md
- PR diff: !`gh pr diff`
```

Multi-line form:

````md
## Environment
```!
node --version
npm --version
git status --short
```
````

### What happens

Each shell command runs before the skill content is sent to Claude.

That means:
- the command executes immediately
- its output replaces the placeholder
- Claude receives the rendered prompt, not the command itself

This is preprocessing, not agent reasoning.

### Example

```md
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

### Disable shell execution

To disable shell execution for user, project, plugin, or additional-directory skills, set:

```json
{
  "disableSkillShellExecution": true
}
```

Then each command is replaced with:

```text
[shell command execution disabled by policy]
```

### Extended thinking

To enable extended thinking in a skill, include the word:

```text
ultrathink
```

somewhere in the skill content.

## Run skills in a subagent

Use:

```yaml
context: fork
```

when you want the skill to run in isolation.

In that mode:
- the skill content becomes the task prompt
- the subagent does not inherit your conversation history
- results are summarized back into the main conversation

### Important limitation

`context: fork` only makes sense when the skill actually contains a task.

If the skill body is just guidance like:
- "use these conventions"
- "follow these rules"

then the forked agent has no real assignment and usually returns with very little to show.

### Example

```md
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

### How this differs from subagents using skills

- Skill with `context: fork`:
  You write the task in the skill, and the chosen agent type executes it.

- Subagent with `skills`:
  The subagent owns the main prompt, and the listed skills are preloaded as reference material.

## Restrict Claude's skill access

By default, Claude can invoke any skill unless it is hidden with:

```yaml
disable-model-invocation: true
```

There are three main control levers.

### 1. Deny the Skill tool entirely

Add to deny rules:

```text
Skill
```

### 2. Allow or deny specific skills

Examples:

```text
Skill(commit)
Skill(review-pr *)
```

or:

```text
Skill(deploy *)
```

### 3. Hide a skill from Claude entirely

Use:

```yaml
disable-model-invocation: true
```

Important nuance:
- `user-invocable` controls menu visibility
- it does not block the Skill tool

If you want to block programmatic invocation by Claude, use `disable-model-invocation: true`.

## Share skills

Skills can be shared at different scopes:
- project: commit `.claude/skills/`
- plugin: package a `skills/` directory in the plugin
- managed: deploy organization-wide through managed settings

## Generate visual output

One of the strongest advanced skill patterns is bundling a script that creates an artifact Claude can orchestrate.

That can be:
- HTML explorers
- dependency graphs
- coverage reports
- schema visualizations
- docs outputs

### Example pattern

`codebase-visualizer` uses a bundled Python script to scan a project and generate:

```text
codebase-map.html
```

The skill gives Claude the orchestration instructions, while the script does the heavy lifting.

Example skill frontmatter:

```md
---
name: codebase-visualizer
description: Generate an interactive collapsible tree visualization of your codebase. Use when exploring a new repo, understanding project structure, or identifying large files.
allowed-tools: Bash(python *)
---
```

Example usage instruction:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```

### Why this pattern is strong

It lets Claude:
- choose when to run the workflow
- pass the right target path
- explain the result

while the script:
- scans data
- renders output
- writes the artifact
- optionally opens it

That division of labor is extremely effective.

## Troubleshooting

### Skill not triggering

If Claude does not use the skill:
- make the description use words people would naturally say
- confirm it appears in the available skill list
- try phrasing your request closer to the description
- invoke it directly if it is user-invocable

### Skill triggers too often

If Claude reaches for it too aggressively:
- make the description narrower
- or set `disable-model-invocation: true`

### Skill descriptions are cut short

Skill descriptions live in context so Claude knows what is available.

If you have many skills, descriptions may be shortened to fit the character budget.

Important details:
- all skill names are still included
- descriptions are capped at 250 characters each
- the overall budget scales at about 1% of the context window
- fallback budget is 8,000 characters

To raise the budget, set:

```sh
SLASH_COMMAND_TOOL_CHAR_BUDGET=<value>
```

But the better default is usually:
- front-load the core use case
- cut vague filler
- make the first sentence do the routing work

## Practical advice

Use advanced patterns when they clearly buy something:
- shell injection for live context
- forked execution for isolated research or workflows
- script bundling for artifact generation

If the skill is just reference guidance, keep it simple.

If the skill needs to gather live state or produce a real deliverable, lean into these patterns hard.

## Files

- [manifest.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/manifest.json)
- [examples/pr-summary/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/pr-summary/SKILL.md)
- [examples/deep-research/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/deep-research/SKILL.md)
- [examples/disable-skill-shell-execution.json](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/disable-skill-shell-execution.json)
- [examples/skill-permission-rules.txt](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/skill-permission-rules.txt)
- [examples/codebase-visualizer/SKILL.md](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/codebase-visualizer/SKILL.md)
- [examples/codebase-visualizer/scripts/visualize.py](/Users/jakeaaron/Documents/Storie/claude-code/advanced-skill-patterns/examples/codebase-visualizer/scripts/visualize.py)
