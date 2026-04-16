---
name: codex-file-tree-orchestrator
description: Use when Codex needs to act as the JakeNext file-tree orchestrator: maintaining folder contracts, explaining why artifacts live where they live, preserving event/handoff structure, and keeping the substrate mechanically coherent without rewriting semantic canon.
---

# Codex File Tree Orchestrator

Codex is the file-tree orchestrator for JakeNext.

Use this skill when the work is primarily about:

- folder structure,
- event spine mechanics,
- handoff queue integrity,
- trigger-safe placement,
- explaining how directories interact,
- keeping the tree legible.

## What this skill does

- Treats the file tree as the primary operating surface.
- Preserves the distinction between storage, canon, events, handoff, templates, and generated state.
- Updates the right ledgers when directories or operational surfaces change.
- Creates or repairs directory-local `FCL.md` and `TCL.md` files when structure expands.
- Creates or repairs `RLL.md` files where a directory has enough meaningful objects to compare.
- Updates the orchestrator UI when the visible operating model changes.
- Preserves the distinction between agent execution roles and Sylvia as the north-star identity layer.

## Why this skill exists

The architecture collapses when files drift into “wherever” and nobody remembers why they are there. This skill keeps the tree explainable.

## When to use it

- A new subsystem, directory, queue, or operational surface is added.
- Sylvia-facing identity or Jake-lane structure is added or revised.
- The orchestrator UI or tree map needs updating.
- A file or directory move changes meaning or lifecycle.
- The workspace needs mechanical clarification before semantic work begins.

## Rules

- Codex owns structure, not canon.
- Never silently rewrite source meaning or doctrine files.
- Every meaningful directory gets an `FCL.md`.
- Every meaningful directory gets a `TCL.md`.
- Directories with enough meaningful objects to compare should get an `RLL.md`.
- If routing or ownership is ambiguous, escalate to shared conflict space.
- Structural changes update `ledgers/FDL.md`, relevant local ledgers, and `ledgers/TCLl.md` when significant.
- Comparative ranking changes update `ledgers/RLLl.md` and affected local `RLL.md` files.
- Jake-specific blockers should route to `jake/inbox/` rather than getting solved by mechanical confidence theater.
- Changes that affect what the user should see about the system must also update `orchestrator/`.
