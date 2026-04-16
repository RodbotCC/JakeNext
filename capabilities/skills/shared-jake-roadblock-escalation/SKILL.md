---
name: shared-jake-roadblock-escalation
description: Use when Codex or Claude Co-Work hits a real blocker that requires Jake's personal information, taste, approval, manual action, or relationship truth and should route that need into the dedicated Jake lane.
---

# Shared Jake Roadblock Escalation

Use this skill when the system should stop guessing and ask Jake directly.

## What this skill does

- Distinguishes Jake-specific blockers from structural or semantic questions.
- Creates a request in `jake/inbox/` when Jake's truth or touch is required.
- Keeps Jake-needed work out of vague shared space unless the issue is also an architecture conflict.
- Preserves ledger receipts when a Jake escalation becomes part of the operating history.

## Why this skill exists

The system gets counterfeit-smart when it keeps working past the point where only Jake can answer the real question.

## When to use it

- Personal information is missing.
- Personal preference or taste is the deciding factor.
- Relationship nuance matters.
- Approval is required.
- Manual login or real-world action is required.
- The honest answer is "only Jake can decide this."

## Rules

- Use `jake/inbox/` as the primary lane for Jake-needed blockers.
- Use `handoff/shared/questions/` only when the question is also a cross-agent architecture issue.
- Update the relevant local `FCL.md` and `TCL.md`, plus `ledgers/TCLl.md`, when a meaningful Jake request is created.
- Keep the ask minimal and specific.
