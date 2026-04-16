# NSL — Skills
### Jake Personal Oracle Project

> North Star Ledger for the skills directory.
> Last updated: 2026-04-15

---

## North Star

**Sylvia becomes autonomous, event-driven, and self-maintaining.**

---

## How This Directory Advances the North Star

### 1. Skills Enable Autonomous Action

Each skill packages a capability that Sylvia can execute without Jake's intervention:
- `codex-dispatcher/` — autonomous work routing
- `codex-safe-worker/` — autonomous packet execution
- `codex-sylvia-chooser/` — autonomous next-step selection

**Without skills**: Sylvia can only reason, not act. With skills, Sylvia can execute.

**Alignment**: 🟢 **PERFECT** - Autonomous action execution is core to "autonomous."

---

### 2. Ingress Skills Enable External Awareness

Three Phase 3 ingress skills:
- `claude-cowork-slack-ingress/` — Slack signals → event packets
- `claude-cowork-gcal-ingress/` — GCal events → event packets
- `claude-cowork-clickup-ingress/` — ClickUp tasks → event packets

**Without these**: Sylvia is blind to external world. With them, Sylvia is externally aware.

**Alignment**: 🟢 **STRONG** - External awareness enables event-driven behavior.

---

### 3. Maintenance Skills Enable Self-Maintenance

Three maintenance skills:
- `oracle-ledger-update/` — ledger maintenance
- `codex-ledger-drift-repair/` — drift detection and repair
- `shared-skill-audit/` — skill inventory validation

**Without these**: Substrate degrades over time. With them, Sylvia maintains her own health.

**Alignment**: 🟢 **STRONG** - Self-maintenance prevents decay.

---

### 4. Skills-First Architecture Enables Delegation

From AGENTS.md:
- Skills define capability boundaries
- Skills declare their own safety requirements
- Skills can route to appropriate agents (Codex vs Claude Co-Work)

**Without this**: Every capability is ad-hoc. With it, capabilities are modular and auditable.

**Alignment**: 🟢 **MODERATE** - Modularity supports autonomy but isn't autonomy itself.

---

## Current Skills Inventory (15 total)

### Autonomous Operation (3 skills)
- `codex-dispatcher/` ✅ v1
- `codex-safe-worker/` ✅ v1
- `codex-sylvia-chooser/` ✅ v1

### External Awareness (3 skills)
- `claude-cowork-slack-ingress/` ✅ v1
- `claude-cowork-gcal-ingress/` ✅ v1
- `claude-cowork-clickup-ingress/` ✅ v1

### Self-Maintenance (3 skills)
- `oracle-ledger-update/` ✅ Live
- `codex-ledger-drift-repair/` ✅ Live
- `shared-skill-audit/` ✅ Live

### Semantic Processing (3 skills)
- `claude-cowork-semantic-triage/` ✅ Live
- `claude-cowork-canon-evolution/` ✅ Live
- `codex-file-tree-orchestrator/` ✅ Live

### Coordination (3 skills)
- `codex-event-packet-ops/` ✅ Live
- `shared-jake-roadblock-escalation/` ✅ Live
- `shared-module-gap-audit/` ✅ Live

---

## What This Directory IS

Skills is the **capability package layer** that enables Sylvia to DO things, not just think about them.

It's not reasoning (that's in chooser/). It's not state storage (that's in ledgers/). It's executable capabilities.

---

## What This Directory IS NOT

- **Not raw scripts** - Skills are packaged capabilities with SKILL.md frontmatter
- **Not one-off code** - Skills are reusable, auditable, and documented
- **Not passive storage** - Skills actively execute when invoked

---

## Gaps / Risks

1. **Skill proliferation without purpose**: If every small task becomes a skill, the directory becomes cluttered.
   - **Mitigation**: Skills should package meaningful capabilities, not trivial operations.

2. **Skills become stale**: If skills aren't maintained, they break as the system evolves.
   - **Mitigation**: `shared-skill-audit/` should run regularly to detect stale skills.

3. **Missing critical skills**: If key capabilities aren't packaged as skills, Sylvia can't execute them autonomously.
   - **Mitigation**: Roadmap should identify capability gaps and prioritize skill creation.

---

## Verdict

**Strongly aligned** with north star. Skills enable autonomous execution, external awareness, and self-maintenance.

Without skills, Sylvia is a reasoning engine that can't act.
With skills, Sylvia is an agent that can execute.

---

*This directory earns its keep by packaging executable capabilities that enable Sylvia to act autonomously.*
