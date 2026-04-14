# Ledger Reconciliation Packet

Owner: `codex`
Status: `inbox`
Created: `YYYY-MM-DDTHH:MM:SSZ`

## Drift Summary

Describe the mismatch between actual filesystem truth and ledger claims.

## Filesystem Truth

List actual paths observed by scan.

## Ledger Claim

List the claim, reference, or stale path found in the ledger.

## Recommended Repair

State the mechanical repair. If semantic meaning is unclear, route to `handoff/shared/conflicts/`.

## Ledgers To Update

- `ledgers/FDL.md`
- root or directory `FCL.md`
- `ledgers/MACRO_LEDGER.md`
- `ledgers/TCL.md`

## Verification

Run `node scripts/detect_ledger_drift.mjs` after repair.

