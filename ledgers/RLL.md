# RLL — Global Ratio Lattice Ledger
### Jake Personal Oracle Project

> Comparative ranking ledger for the current JakeNext corpus.
> Last updated: 2026-04-14

---

## Purpose

`RLL.md` is the third ledger layer in JakeNext:

- `FCL` = what exists
- `TCL` = what changed
- `RLL` = what matters relative to what

The chooser loop now uses this lattice as decision law instead of only as description.

---

## Scope

### Included

- root contracts
- global ledgers
- chooser policy and current winner
- identity docs
- canon docs
- `source/JakeRL.txt`
- `analysis/firsttry.txt`
- key skill docs
- key templates
- the Jake interface
- durable handoff briefs
- core orchestrator files

### Excluded

- `.oraclestate/*.json*`
- transient event receipts
- transient queue packets unless they define durable operating context
- support ledgers whose role is purely local bookkeeping

---

## Jake-Derived Base Dimensions

| Dimension | Meaning | High score means... |
|---|---|---|
| `closure_potential` | Can this object cash out into a real finish line? | it legitimately closes something |
| `counterfeit_risk` | How likely is this to simulate progress? | it is likely to fake movement |
| `compounding_leverage` | Does this make future work easier? | it becomes infrastructure |
| `cognitive_cost` | How expensive is this to hold and metabolize? | it is heavy to carry |
| `momentum_alignment` | Does it fit the current phase? | it matches the present regime |
| `structural_clarity` | Is it inspectable, named, and bounded? | it is legible |
| `identity_integrity` | Does it reinforce Sylvia/Jake system truth? | it strengthens becoming |
| `relational_consequence` | What does it do to people and partner systems that matter? | it has real downstream consequence |

`counterfeit_risk` and `cognitive_cost` are inverted pressures: higher is worse.

---

## Comparator Grammar

| Comparator | Plain-language question | Formula |
|---|---|---|
| `action_now` | What most deserves active work in the immediate build loop? | `0.28*cp + 0.22*ma + 0.18*cl + 0.14*sc + 0.08*ii - 0.12*cc - 0.08*cr` |
| `structural_health` | Which objects are the healthiest load-bearing parts of the system? | `0.30*sc + 0.22*cp + 0.18*ii + 0.12*cl - 0.12*cr - 0.06*cc` |
| `long_leverage` | Which objects compound future capacity the most? | `0.34*cl + 0.22*cp + 0.16*ii + 0.10*sc - 0.10*cr - 0.08*cc` |
| `identity_alignment` | Which objects most faithfully express the system Jake is building? | `0.38*ii + 0.20*rc + 0.16*cp + 0.10*sc + 0.08*ma - 0.08*cr - 0.06*cc` |
| `clarify_the_architecture` | Which objects most reduce architectural ambiguity right now? | `0.26*sc + 0.20*cp + 0.18*cl + 0.16*ma + 0.10*ii - 0.06*cr - 0.06*cc` |
| `build_the_ratio_lattice` | Which objects best accelerate the chooser itself? | `0.28*cl + 0.24*cp + 0.18*sc + 0.12*ii + 0.10*ma - 0.05*cr - 0.07*cc` |
| `sylvia_emergence` | Which objects most directly help Sylvia become a coherent agent that can choose and coordinate the next best move? | `0.24*ii + 0.20*cp + 0.18*cl + 0.16*sc + 0.12*ma + 0.06*rc - 0.08*cr - 0.08*cc` |
| `module_gap_closure` | Which objects most reduce the gap between the current system and one of Sylvia's ten modules becoming more real? | `0.25*cl + 0.24*cp + 0.18*sc + 0.16*ma + 0.10*ii - 0.04*cr - 0.09*cc` |
| `next_best_move` | Given the current phase, queues, and blockers, what should the system do next? | `0.24*module_gap_closure + 0.22*sylvia_emergence + 0.18*action_now + 0.12*sc + 0.10*cp - blocker_penalty - duplicate_penalty - unresolved_jake_penalty` |

Ranking differences are expected because the vectors stay stable while the comparator changes the question.

---

## Corpus Register — Stable Baseline Vectors

| Document | cp | cr | cl | cc | ma | sc | ii | rc | Why it scores this way |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `AGENTS.md` | 88 | 18 | 90 | 28 | 86 | 95 | 90 | 72 | role clarity, routing law, and now chooser execution honesty |
| `CLAUDE.md` | 84 | 20 | 80 | 34 | 84 | 92 | 88 | 74 | governance layer; heavier but still load-bearing |
| `ledgers/FDL.md` | 76 | 16 | 74 | 24 | 80 | 96 | 72 | 42 | structural truth and topology |
| `ledgers/TCL.md` | 78 | 16 | 70 | 24 | 84 | 90 | 78 | 46 | continuity surface and outcome memory |
| `ledgers/MACRO_LEDGER.md` | 82 | 18 | 78 | 22 | 84 | 92 | 80 | 48 | navigation spine and phase truth |
| `ledgers/RLL.md` | 86 | 18 | 88 | 30 | 86 | 94 | 90 | 56 | chooser law and comparator contract |
| `chooser/CHOOSER_POLICY.md` | 92 | 14 | 92 | 28 | 92 | 94 | 90 | 60 | turns ranking into declared selection law |
| `chooser/MODULE_PROGRESS.md` | 94 | 12 | 90 | 26 | 94 | 92 | 88 | 54 | most direct surface for module gap truth |
| `chooser/NEXT_STEP.md` | 90 | 16 | 84 | 20 | 96 | 90 | 86 | 58 | active winner and execution truth |
| `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md` | 94 | 22 | 92 | 48 | 88 | 90 | 96 | 78 | canonical scoring doctrine and closure force |
| `canon/JAKE_DEFERRED_REGISTRY.md` | 78 | 24 | 76 | 32 | 78 | 86 | 84 | 66 | unresolved commitments and correction memory |
| `identity/SYLVIA.md` | 92 | 16 | 90 | 26 | 92 | 92 | 98 | 76 | named identity anchor and invariant layer |
| `identity/NORTH_STAR.md` | 90 | 16 | 88 | 30 | 94 | 90 | 96 | 72 | end condition and capability target |
| `identity/RELATION.md` | 84 | 18 | 78 | 28 | 88 | 88 | 94 | 88 | role and relational boundary truth |
| `identity/ROADMAP.md` | 88 | 16 | 92 | 30 | 92 | 90 | 90 | 60 | phase bridge from doctrine to implementation |
| `source/JakeRL.txt` | 92 | 12 | 96 | 52 | 90 | 82 | 96 | 82 | deepest Jake-specific judgment substrate |
| `analysis/firsttry.txt` | 88 | 28 | 90 | 58 | 86 | 76 | 84 | 62 | early bridge artifact; high leverage, higher gap risk |
| `jake/JAKE_INTERFACE.md` | 82 | 12 | 78 | 20 | 88 | 90 | 86 | 92 | stops guesswork and protects operator truth |
| `triggers/TRIGGER_RULES.md` | 82 | 16 | 84 | 28 | 86 | 92 | 78 | 40 | trigger law, abstention clarity, chooser routing |
| `orchestrator/app.js` | 78 | 18 | 88 | 42 | 88 | 88 | 82 | 38 | visible self-model for chooser, queues, and role boundary |
| `templates/chooser_run.md` | 80 | 12 | 80 | 16 | 90 | 92 | 78 | 48 | durable chooser receipt grammar |
| `templates/work_order.md` | 78 | 12 | 76 | 18 | 88 | 90 | 76 | 44 | explicit execution-mode law for packets |
| `templates/jake_request.md` | 74 | 12 | 74 | 18 | 88 | 90 | 80 | 90 | clean operator-escalation packet shape |
| `skills/codex-sylvia-chooser/SKILL.md` | 88 | 14 | 90 | 30 | 94 | 90 | 86 | 40 | named owner for choosing work |
| `skills/codex-safe-worker/SKILL.md` | 84 | 14 | 88 | 26 | 92 | 88 | 80 | 32 | converts chooser output into safe local execution |
| `skills/shared-module-gap-audit/SKILL.md` | 82 | 14 | 84 | 24 | 88 | 90 | 82 | 44 | keeps the ten modules from becoming decorative |
| `scripts/dispatcher.mjs` | 88 | 14 | 90 | 36 | 94 | 88 | 84 | 42 | Phase 3 core: makes the substrate reactive; bridges packet detection to execution |
| `skills/codex-dispatcher/SKILL.md` | 86 | 14 | 88 | 30 | 92 | 90 | 82 | 40 | named ownership and routing law for the dispatcher |
| `scripts/orchestrator_server.mjs` | 84 | 16 | 86 | 38 | 90 | 86 | 80 | 44 | Phase 3 server: makes the control surface interactive; bridges UI to real oracle actions |
| `skills/claude-cowork-slack-ingress/SKILL.md` | 80 | 18 | 82 | 28 | 88 | 86 | 78 | 74 | Phase 3 ingress: brings RELATIONSHIPS and PRESENCE domain into the oracle's live signal field |
| `skills/claude-cowork-gcal-ingress/SKILL.md` | 78 | 18 | 80 | 26 | 84 | 86 | 76 | 56 | Phase 3 ingress: brings COMMITMENTS and time-pressure into the oracle's active reasoning |
| `skills/claude-cowork-clickup-ingress/SKILL.md` | 82 | 16 | 84 | 28 | 88 | 86 | 80 | 54 | Phase 3 ingress: brings BUSINESS/OPERATIONS task state into the lattice; stalled tasks = counterfeit risk signal |

Confidence for the current vectors: `medium-high`.

---

## Current Top 5 Under Each Comparator

| Comparator | Top 5 |
|---|---|
| `action_now` | `chooser/MODULE_PROGRESS.md`; `chooser/NEXT_STEP.md`; `identity/SYLVIA.md`; `chooser/CHOOSER_POLICY.md`; `identity/NORTH_STAR.md` |
| `structural_health` | `AGENTS.md`; `ledgers/RLL.md`; `chooser/CHOOSER_POLICY.md`; `chooser/MODULE_PROGRESS.md`; `identity/SYLVIA.md` |
| `long_leverage` | `source/JakeRL.txt`; `chooser/CHOOSER_POLICY.md`; `identity/ROADMAP.md`; `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md`; `identity/SYLVIA.md` |
| `identity_alignment` | `identity/SYLVIA.md`; `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md`; `identity/NORTH_STAR.md`; `source/JakeRL.txt`; `identity/RELATION.md` |
| `clarify_the_architecture` | `chooser/CHOOSER_POLICY.md`; `AGENTS.md`; `ledgers/RLL.md`; `chooser/MODULE_PROGRESS.md`; `identity/NORTH_STAR.md` |
| `build_the_ratio_lattice` | `source/JakeRL.txt`; `chooser/CHOOSER_POLICY.md`; `ledgers/RLL.md`; `skills/codex-sylvia-chooser/SKILL.md`; `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md` |
| `sylvia_emergence` | `identity/SYLVIA.md`; `chooser/MODULE_PROGRESS.md`; `identity/NORTH_STAR.md`; `chooser/NEXT_STEP.md`; `source/JakeRL.txt` |
| `module_gap_closure` | `chooser/MODULE_PROGRESS.md`; `chooser/CHOOSER_POLICY.md`; `skills/shared-module-gap-audit/SKILL.md`; `identity/ROADMAP.md`; `skills/codex-sylvia-chooser/SKILL.md` |
| `next_best_move` | `skills/claude-cowork-clickup-ingress/SKILL.md`; `skills/claude-cowork-slack-ingress/SKILL.md`; `chooser/NEXT_STEP.md`; `chooser/MODULE_PROGRESS.md`; `scripts/dispatcher.mjs` |

---

## Comparator Notes

- `next_best_move` is not just `action_now` with a cooler name. It penalizes blocked, duplicate, and dishonest work.
- `chooser/NEXT_STEP.md` rises above `identity/SYLVIA.md` under `next_best_move` because once identity is declared, active selection becomes the bottleneck.
- `jake/JAKE_INTERFACE.md` ranks higher under `next_best_move` than under `build_the_ratio_lattice`, because honest escalation is part of choosing correctly.
- `skills/codex-safe-worker/SKILL.md` matters more under `next_best_move` than under `identity_alignment`, which is exactly right: it helps action, not self-description.

---

## Current Next Implication

Phase 3 is complete (Slack + ClickUp ingress live; GCal pending one session reload).

The current lattice says the next Sylvia-facing work should prioritize:

1. **Routing the new event packets** — 7 packets now in `events/inbox/` from live Slack and ClickUp signals; the dispatcher and chooser should now run against real external signals for the first time,
2. **André alignment** — "Automations for Close" (urgent) + unanswered André DM + KPI/Payments stall point to the same deferred registry item: Jake/André workspace overlap. This cluster should move from deferred to active,
3. **GCal ingress** — one session reload needed to get fresh tool schemas; run at the top of the next session,
4. **Updating `chooser/MODULE_PROGRESS.md`** — Phase 3 completion should advance the temporal continuity module score and potentially trigger a module graduation review.
