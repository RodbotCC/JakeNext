---
name: codex-ledger-drift-repair
description: Use when filesystem truth and ledger claims need to be compared and repaired mechanically: stale paths, missing FCL files, outdated directory maps, queue topology mismatches, and other non-semantic drift in JakeNext.
---

# Codex Ledger Drift Repair

Use this skill when ledgers and filesystem reality disagree in a mechanical way.

## What this skill does

- Runs or interprets drift checks.
- Repairs stale paths, missing FCL stubs, outdated directory map entries, and queue topology mismatches.
- Separates mechanical drift from semantic drift.
- Creates packets for Claude Co-Work when the gap is about meaning rather than structure.

## Why this skill exists

The ledgers are the memory spine. If they drift from actual reality, the oracle starts hallucinating its own body.

## When to use it

- `detect_ledger_drift.mjs` reports findings.
- A path or directory exists but the ledgers do not know it.
- A ledger claims a thing exists here when it actually lives elsewhere.
- The system needs a mechanical integrity pass.

## Rules

- Fix structure directly when the repair is unambiguous.
- Do not “solve” semantic/source gaps by fabricating missing meaning.
- If a drift item changes doctrine or interpretation, route it to Claude Co-Work.
- Append `ledgers/TCLl.md` when the repair is significant.

