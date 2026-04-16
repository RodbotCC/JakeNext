# TCL — claude-cowork-slack-ingress
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

**Action**: Created `SKILL.md`, `FCL.md`, and `TCL.md` for the claude-cowork-slack-ingress skill. This completes the Phase 3 ingress adapter infrastructure for Slack.

**Files**:
- Added `SKILL.md` — skill definition, classification rules, blacklist enforcement, event packet format
- Added `FCL.md` — directory contents ledger
- Added `TCL.md` — this file

**Outcome**: The Slack ingress skill package is structurally complete. Claude Co-Work can now run the skill using live MCP tools to pull signals and write event packets to `events/inbox/`.

**Notes**: First live ingress pass should be logged here as the next entry, including packet count, signal types found, and any blacklist exclusions applied.
