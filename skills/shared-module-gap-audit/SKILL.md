---
name: shared-module-gap-audit
description: Use when JakeNext needs to verify that Sylvia's ten modules each have a declared gap, next move, owning lane, and completion signal.
---

# Shared Module Gap Audit

Use this skill to stop the module map from becoming decorative.

## What this skill does

- Audits all ten Sylvia modules for progress completeness.
- Checks that each module has:
  - a status,
  - a current gap,
  - a best next move,
  - a queue owner,
  - and a completion signal.
- Creates follow-up packets or ledger corrections when a module goes fuzzy.

## Why this skill exists

If the module map stops driving actual work, it becomes a pretty theory and the bootstrap loop collapses back into vibes.

## Rule

Every module should be actionable enough that the chooser can name what would make it more real next.
