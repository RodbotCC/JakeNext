# TCL — Skills
### Jake Personal Oracle Project

> Local continuity ledger for the `skills/` directory.
> Last updated: 2026-04-14

---

## Log

### 2026-04-14 ~01:28 EDT — Skills TCL initialized

**Action**: Added a local temporal ledger for skill creation, revision, and audit history.

**Outcome**: Skills are now continuity-tracked locally, not just globally.

### 2026-04-14 ~02:12 EDT — Skills RLL baseline installed

**Action**: Added `skills/RLL.md` and ranked current skill packages, with the Codex file tree orchestrator skill winning the first pass.

### 2026-04-14 ~03:05 EDT — Jake roadblock escalation skill added

**Action**: Added `skills/shared-jake-roadblock-escalation/` so Jake-specific blockers have an explicit shared escalation protocol.

### 2026-04-14 — Codex dispatcher skill added (Phase 3)

**Action**: Created `skills/codex-dispatcher/` with SKILL.md, FCL.md, and TCL.md. This is the Phase 3 skill — the dispatcher bridges packet detection to execution. Supporting script: `scripts/dispatcher.mjs`.

**Outcome**: The dispatcher now has explicit skill ownership. Skills layer reflects Phase 3 entry.

### 2026-04-14 ~04:20 EDT — Chooser and safe-worker skills added

**Action**: Added `skills/codex-sylvia-chooser/`, `skills/codex-safe-worker/`, and `skills/shared-module-gap-audit/` so the chooser loop, safe execution lane, and module gap auditing all have explicit skill ownership.

### 2026-04-14 ~20:00 EDT — Phase 3 ingress skills installed and first live passes executed

**Action**: Created three new ingress skill packages: `claude-cowork-slack-ingress/`, `claude-cowork-gcal-ingress/`, and `claude-cowork-clickup-ingress/`. Each has SKILL.md, FCL.md, and TCL.md. Then executed the first live ingress passes for Slack and ClickUp. GCal MCP was unavailable due to a tool upgrade requiring session reload — logged as a system gap, not a blocker.

**Signals found**:
- Slack: 4 unanswered DMs (André, Rodrigo, Toni, Spyros) spanning Apr 9–13
- ClickUp: 3 stalled tasks (Automations for Close [urgent], KPI Daily, Payments Checked)
- GCal: blocked by MCP upgrade — needs fresh session to run

**Outcome**: Phase 3 ingress adapters are live. The oracle now has its first real external-signal event packets beyond the daily substrate sweep. Skills directory now contains 15 skill packages total.
