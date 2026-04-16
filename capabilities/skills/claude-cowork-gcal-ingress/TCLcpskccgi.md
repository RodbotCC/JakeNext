# TCL — claude-cowork-gcal-ingress
### Local Temporal Continuity Ledger

> What changed here, when, and what is now true.
> Last updated: 2026-04-14

---

## Format

```
### [DATE] [APPROX TIME] — [ONE LINE SUMMARY]
**Action**: What happened
**Files**: Files affected
**Outcome**: What is now true
**Notes**: Carry-forward context
```

---

## Log

### 2026-04-14 — Skill directory initialized

**Action**: Created `SKILL.md`, `FCL.md`, and `TCL.md` for the claude-cowork-gcal-ingress skill. This completes the Phase 3 ingress adapter infrastructure for Google Calendar.

**Files**:
- Added `SKILL.md` — skill definition, classification rules, calendar gap logic, event packet format
- Added `FCL.md` — directory contents ledger
- Added `TCL.md` — this file

**Outcome**: The GCal ingress skill package is structurally complete. Claude Co-Work can now run the skill using live MCP tools to pull calendar signals and write event packets to `events/inbox/`.

**Notes**: First live ingress pass should be logged here as the next entry, including event count, classification breakdown, and any proposed calendar gaps surfaced.
