---
name: shared-skill-audit
description: Use when JakeNext needs to audit whether workflows are properly captured as skills, whether ledgers describe those skills accurately, and whether skill boundaries, deliverables, and update history remain explicit over time.
---

# Shared Skill Audit

Use this skill to prevent skill rot.

## What this skill does

- Reviews whether important workflows are represented by explicit skills.
- Checks whether skill descriptions still match actual behavior.
- Verifies that ledgers say what each skill does, why it exists, when to use it, and what rules govern it.
- Verifies that Jake-specific blockers are routed into `jake/inbox/` instead of being guessed past or hidden in shared fog.
- Creates follow-up packets when a skill or ledger has gone stale.

## Why this skill exists

The failure mode is laziness. Once the agents stop updating the skills and ledgers, the system turns into folklore and collapses.

## When to use it

- After major architectural work.
- When a workflow is being repeated without a clear skill.
- During periodic maintenance or end-of-day review.
- When the team suspects the ledgers are no longer telling the full truth about capabilities.

## Rules

- Audit both skills and the ledgers that describe them.
- If a workflow exists more than once, prefer turning it into or attaching it to a skill.
- Record meaningful skill creation or skill refactor work in `ledgers/TCLl.md`.
- Shared audit findings can route to Codex or Claude Co-Work depending on whether the problem is structural or semantic.
