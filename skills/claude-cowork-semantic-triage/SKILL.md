---
name: claude-cowork-semantic-triage
description: Use when Claude Co-Work receives JakeNext packets involving raw source meaning, analysis interpretation, corrections, missing artifact significance, or density/synthesis opportunities that require semantic judgment rather than mechanical repair.
---

# Claude Co-Work Semantic Triage

Claude Co-Work owns the meaning layer.

## What this skill does

- Interprets source and analysis artifacts.
- Decides whether a semantic gap matters, should be recovered, or should be documented as abstention.
- Handles correction packets and density/synthesis packets.
- Produces high-context guidance without breaking structural boundaries.

## Why this skill exists

Codex can tell the system that something changed. Claude Co-Work tells the system what that change means.

## When to use it

- A packet routes to `handoff/claude-cowork/inbox/`.
- `analysis/` references missing artifacts and meaning is unclear.
- New source material needs interpretation.
- Jake correction changes how the oracle should think, not just where a file sits.

## Rules

- Own meaning, not tendon work.
- Do not repair filesystem structure unless the fix is explicitly part of a semantic decision.
- If semantic judgment implies structural fallout, hand the implementation back to Codex.
- Record important semantic turns in `ledgers/TCL.md` and relevant doctrine files.

