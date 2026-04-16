# Sylvia System State Report
### JakeNext Personal Oracle — Complete Architecture Overview
> Generated: 2026-04-14 | Last updated: 2026-04-15 (Three Pillars + Directory Consolidation)
> Purpose: Comprehensive orientation document for new sessions. Hand this to a fresh Claude instance to get instant full context without reading every file.

---

## 2026-04-15 Session — What Changed Since Phase 3

Three major things happened in the April 15 session that every new instance must know.

### 1. Three Breakthrough Pillars Articulated and Captured

The most important insight in the project's history: three independently-designed systems converge as one architecture at five levels of abstraction. Full technical detail lives in `northstar/BREAKTHROUGH_GOALS.md`.

**Pillar 1 — Ratio Lattice Framework** (`~/Documents/AiStability.txt`, the Pincer Engine manuscript)
The decision substrate for the entire oracle. Comparison algebra with 8-state outcome logic, six typed ratio channels (A, B, A_r, B_r, Φ, ζ), regime-bound distinction, parallel probe sweeps, and layer descent. The four-ledger system and chooser are primitive versions of this architecture. The gap: implement the full Pincer Engine as the actual chooser substrate with corridor agents and ceiling frames.

**Pillar 2 — Perceptual Substrate** (`~/Memory Idea/` + `~/Soliton Mechanics/...`)
Two components that connect: (a) AI Sensory Monitor — native macOS agent polling AX tree, focus events, mouse/keyboard, notifications, and behavioral heuristics at event-tap speed, with intent inference output. (b) Delta Chords Engine — 8-band fusion with gate→merge→lock cycles, inhale→exhale→shear micro-cycles, abstention at ζ < 0.18. The monitor's multi-rate signals become the bands; the engine's consensus produces predicted user intent as bottom-up Pincer corridors. Currently not connected — monitor outputs events, engine runs on simulated data.

**Pillar 3 — Hardware Inference Layer** (Sipeed Tang Nano 20K, arriving 2026-04-17)
FPGA Δ-Bit annealer. The Δ-Bit state tuple `(A, B, A_Λ, B_Λ, ζ, Φ)` maps directly to the six typed ratio channels `(A, B, A_r, B_r, Φ, ζ)` — this is not coincidence, the Δ-Bit IS the hardware implementation of the comparison tuple. Simulation results: 1 million nonces, 32,258x speedup, zero misses, 99.997% compute saved by abstention gates. Existing Verilog targets Xilinx; needs port to Gowin primitives for Tang Nano 20K.

**The unity**: Sensory Monitor → raw corridor signals → Delta Chords band fusion + phase locking → Pincer Engine lifecycle → Ratio Lattice comparison algebra → FPGA Δ-Bit hardware at 100MHz → JakeNext Oracle catalog. Designed independently, discovered to be one architecture.

### 2. `northstar/` Directory Created

`identity/` was conflating who Sylvia is with what we're building. Split into:
- `identity/` — pure identity: personality, decision laws, relation boundaries, modules
- `northstar/` — pure goals: end condition, roadmap, three breakthrough pillars

Files moved: `NORTH_STAR.md` and `ROADMAP.md` from `identity/` → `northstar/`. New file created: `northstar/BREAKTHROUGH_GOALS.md`. Full four-ledger discipline (FCL, TCL, RLL, NSL) in `northstar/`. This is now the 9th core system directory.

### 3. Directory Consolidation (16 → 10 Top-Level Dirs) + NSL Rollout

**Phase 1 — Directory consolidation**: Multiple top-level directories collapsed into three parent directories to reduce root sprawl:
- `signals/` — parent for `events/`, `triggers/`, `briefings/` (formerly DAILY_BRIEFINGS/)
- `collaboration/` — parent for `handoff/`, `jake/`
- `capabilities/` — parent for `skills/`, `scripts/`, `templates/`, `orchestrator/`
- `knowledge/` — temporary parent for `source/`, `analysis/`

**Phase 2 — NSL rollout**: North Star Ledger (`NSL.md`) added to 8 critical directories as the fourth ledger type. The ledger system is now a four-ledger system, not three.

---

## Phase 3 Completion — What Changed Since This Report Was First Written

This document was generated earlier today. Since then, the following work completed Phase 3:

**Dispatcher (scripts/dispatcher.mjs + skills/codex-dispatcher/)** — The substrate is now reactive. Packets in handoff queues are detected and routed automatically. `codex_safe_auto` packets invoke the safe worker directly. `claude_semantic` packets surface to the queue without auto-execution. `manual_jake` packets flag as operator bottlenecks. One-shot and `--watch` daemon modes. State persisted in `.oraclestate/dispatcher_state.json` to prevent double-dispatch.

**Orchestrator Live Actions (scripts/orchestrator_server.mjs + Act panel in UI)** — The orchestrator frontend is now interactive. `node scripts/orchestrator_server.mjs` starts a lightweight HTTP server on port 7000. The Act panel shows live queue counts, the current NEXT_STEP.md winner, and buttons to trigger dispatcher / chooser / safe worker / reflection with real-time console output. Gracefully degrades to static display when server is not running.

**Three Ingress Skills (Phase 3 final piece)** — The oracle can now pull real signals from external connectors:
- `skills/claude-cowork-slack-ingress/` — Slack DMs, @mentions, channel signals → event packets
- `skills/claude-cowork-gcal-ingress/` — GCal events, deadlines, scheduling gaps → event packets *(skill ready; GCal MCP needs tool refresh after upgrade before first live run)*
- `skills/claude-cowork-clickup-ingress/` — ClickUp stalled/overdue/blocking/new tasks → event packets

**First Live Ingress Passes Completed** — Slack and ClickUp passes ran today. 7 real event packets now live in `events/inbox/`:

| Packet | Type | Signal |
|---|---|---|
| `evt_...andre.json` | slack_dm_unanswered | André DM Apr 13 — file/media, unanswered — routes to Jake |
| `evt_...rodrigo_watch.json` | slack_dm_unanswered | Rodrigo "Jake please watch this" + ClickUp link Apr 11 — direct ask, 3+ days stale — routes to Jake |
| `evt_...toni.json` | slack_dm_unanswered | Toni Zoom link Apr 12 — routes to Jake for judgment |
| `evt_...spyros.json` | slack_dm_unanswered | Spyros availability ping + access questions Apr 9–11 — routes to Jake |
| `evt_...automations.json` | clickup_task_stalled | "Automations for Close" — **urgent**, to do, Jake+André+Rodrigo co-assigned |
| `evt_...kpis.json` | clickup_task_stalled | "KPI'S DAILY ALL SALES REPS" — to do, daily feedback loop idle |
| `evt_...payments.json` | clickup_task_stalled | "ALL SALES PAYMENTS CHECKED" — to do, financial verification stalled — routes to Jake |

**The highest-signal cluster right now:** Rodrigo's "watch this" DM + André's unanswered message + "Automations for Close" (urgent) + KPI/Payments stall all point at the same deferred registry item — the André/Jake workspace overlap and sales mission control duplication. This cluster is ready to move from deferred to active.

**GCal note:** The Google Calendar MCP connector was upgraded mid-session, breaking tool access. The skill is built and the adapter is ready. On the next session start, the GCal ingress will work with fresh tool schemas. No rebuild needed — just run it.

---

## What This System Is

**JakeNext** is the repository name. **Sylvia** is the named agent identity being built inside it.

This is a personal oracle system — not a productivity app, not a CRM, not a generic assistant. Its job is to help Jake control attention, commitments, priorities, and decisions across his whole life and work. It converts incoming signals, open obligations, and research threads into a living decision architecture with a single coherent next move at any given time.

The system is built to feel like the same intelligent presence every time Jake opens it. Temporal continuity — the ability to remember what happened, what changed, and what was decided — is declared as the single most important property of the whole thing.

---

## The Agent Landscape

Four named roles operate in this system. Their boundaries are hard, not fuzzy.

**Jake** is the operator. He is the source of values, lived context, personal taste, relational truth, and final authority. When the system needs something only Jake can supply, it stops and routes to `jake/inbox/` — it does not guess.

**Sylvia** is the named agent identity and integration target. She is what Codex and Claude Co-Work are building toward — a coherent, choosing intelligence that can perceive Jake's world, decide what matters relative to everything else, select a next move, coordinate agents to execute it, escalate when needed, and improve the architecture used to choose again.

**Codex** is the substrate engineer. It owns file tree structure, automation scripts, routing mechanics, ledger drift repair, trigger grammar, templates, and UI truthfulness. Codex builds the nervous system.

**Claude Co-Work** (this environment) is the semantic canon keeper. It owns meaning, doctrine, oracle voice, identity coherence, raw source interpretation, and high-context judgment. It refines what the system thinks and how it says it.

These are not rival identities — they are roles in service of Sylvia.

---

## File Tree — Full Directory Map

**NOTE: File tree updated 2026-04-15 to reflect directory consolidation and northstar/ addition.**

```
JakeNext/
├── AGENTS.md               — Agent boundary contract (Codex vs Claude Co-Work vs Jake vs Sylvia)
├── CLAUDE.md               — Global governance, session boot/close protocol, all workspace rules
│
├── ledgers/                — Global memory spine (READ FIRST every session)
│   ├── MACRO_LEDGER.md     — Top-level navigation and system status
│   ├── FDL.md              — Global directory topology map
│   ├── FCL.md              — Global root inventory
│   ├── TCL.md              — Global temporal continuity log
│   ├── RLL.md              — Global ratio lattice: 8 dimensions, 9 comparators, scored corpus
│   └── NSL.md              — Global north star alignment map (fourth ledger type, added 2026-04-15)
│
├── identity/               — Sylvia's identity kernel (pure identity only — not goals)
│   ├── SYLVIA.md           — Who Sylvia is, invariants, what she is not
│   ├── RELATION.md         — Jake ↔ Sylvia ↔ Codex ↔ Claude Co-Work role law
│   ├── FCL.md, TCL.md, RLL.md, NSL.md
│   └── modules/            — Ten Sylvia capability modules (doctrine files)
│       ├── 01_world_model.md through 10_global_availability.md
│       └── FCL.md, TCL.md
│
├── northstar/              — What we're building (separated from identity/ 2026-04-15)
│   ├── BREAKTHROUGH_GOALS.md — THE THREE PILLARS: Ratio Lattice Framework, Perceptual Substrate,
│   │                           Hardware Inference Layer — the most important file in the workspace
│   ├── NORTH_STAR.md       — End condition + 4 capability milestones (moved from identity/)
│   ├── ROADMAP.md          — 4-phase build sequence (moved from identity/)
│   └── FCL.md, TCL.md, RLL.md, NSL.md
│
├── chooser/                — Sylvia's next-move selection loop
│   ├── CHOOSER_POLICY.md   — How the chooser works, decision law, routing law, safety
│   ├── MODULE_PROGRESS.md  — Current gap table for all 10 modules + priority order
│   ├── NEXT_STEP.md        — Current winning move, packet state, success signal
│   ├── FCL.md, TCL.md, RLL.md, NSL.md
│   └── runs/               — Append-only chooser and reflection receipts
│       └── FCL.md, TCL.md
│
├── canon/                  — Canonical doctrine and persistent memory
│   ├── SYLVIA_SYSTEM_STATE.md          — This file — single-document orientation report
│   ├── JAKE_PERSONAL_ORACLE_FOUNDATION.md  — Ratio lattice doctrine, 7 domains, 8 scores, comparators
│   ├── JAKE_DEFERRED_REGISTRY.md       — Jake's "later" list: open items, corrections
│   └── FCL.md, TCL.md, RLL.md, NSL.md
│
├── signals/                — Signal processing parent (consolidated 2026-04-15)
│   ├── events/             — Event packet spine (inbox / processed / failed)
│   ├── triggers/           — Trigger grammar (TRIGGER_RULES.md + 9 trigger classes)
│   └── briefings/          — Daily sweep outputs (formerly DAILY_BRIEFINGS/)
│       (all subdirs have FCL.md, TCL.md)
│
├── collaboration/          — Multi-agent coordination parent (consolidated 2026-04-15)
│   ├── handoff/            — Agent handoff bus
│   │   ├── codex/          — inbox / active / done (Codex work queue)
│   │   ├── claude-cowork/  — inbox / active / done (semantic queue)
│   │   └── shared/         — decisions / questions / conflicts
│   └── jake/               — Jake-owned operator lane
│       ├── JAKE_INTERFACE.md
│       ├── inbox/ active/ done/
│       └── FCL.md, TCL.md per directory
│
├── capabilities/           — Operational capabilities parent (consolidated 2026-04-15)
│   ├── skills/             — 15 workflow packages (skills-first doctrine)
│   │   ├── oracle-ledger-update/
│   │   ├── codex-file-tree-orchestrator/
│   │   ├── codex-ledger-drift-repair/
│   │   ├── codex-event-packet-ops/
│   │   ├── claude-cowork-semantic-triage/
│   │   ├── claude-cowork-canon-evolution/
│   │   ├── shared-skill-audit/
│   │   ├── shared-jake-roadblock-escalation/
│   │   ├── codex-sylvia-chooser/
│   │   ├── codex-safe-worker/
│   │   ├── shared-module-gap-audit/
│   │   ├── codex-dispatcher/         — Phase 3: queue detection + routing + execution
│   │   ├── claude-cowork-slack-ingress/   — Phase 3: Slack → event packets
│   │   ├── claude-cowork-gcal-ingress/    — Phase 3: GCal → event packets
│   │   └── claude-cowork-clickup-ingress/ — Phase 3: ClickUp → event packets
│   ├── scripts/            — 11 automation scripts (dispatcher, chooser, safe worker, etc.)
│   │   └── lib/            — Shared filesystem helpers
│   ├── templates/          — 6 reusable packet shapes
│   └── orchestrator/       — Frontend control surface (index.html, styles.css, app.js)
│
├── knowledge/              — Raw materials (TEMPORARY parent — likely to be deprecated)
│   ├── source/             — JakeRL.txt (309 Q&A, 15 trait clusters)
│   └── analysis/           — Interpretation artifacts and workspace dumps
│
└── .oraclestate/           — Generated machine state (non-canonical)
    ├── tree_snapshot.json
    └── dispatcher_state.json
```

---

## The Four-Ledger System

Every meaningful directory has four ledger types. Together they form the memory spine. *(NSL added 2026-04-15 — document previously said three.)*

| Ledger | Question | Signal Type |
|--------|----------|-------------|
| **FCL.md** | What exists here? | Structural completeness |
| **TCL.md** | What changed and when? | Temporal continuity |
| **RLL.md** | What matters relative to what? | Comparative judgment |
| **NSL.md** | How aligned is this with Sylvia's becoming? | North Star convergence |

**FCL.md** — inventories every file in the directory, its purpose, and conventions.

**TCL.md** — running log of meaningful events. The global `ledgers/TCLl.md` aggregates across the whole workspace.

**RLL.md** — comparative ranking of the objects in that directory under declared comparators.

**NSL.md** — north star alignment score for each sub-element. Answers "what is this FOR?" Detects drift and counterfeit progress. Applied first to Critical directories (northstar/, identity/, chooser/, ledgers/) and expanding.

The global versions live in `ledgers/`. Local versions live in each directory. All four must be updated after every meaningful session — this is non-negotiable.

**Session boot protocol (mandatory):** Read `ledgers/MACRO_LEDGER.md` → `ledgers/TCLl.md` → local TCL/FCL for any directory being worked in → `ledgers/RLLl.md` if ranking matters → `identity/` if identity is relevant → `northstar/BREAKTHROUGH_GOALS.md` if working on the three pillars.

**Session close protocol (mandatory):** Update local FCL → local TCL → local RLL if ranking changed → local NSL if alignment changed → `ledgers/TCLl.md` → `ledgers/RLLl.md` if global ranking changed → `ledgers/NSLl.md` if global alignment changed → `ledgers/FDL.md` if topology changed → `ledgers/MACRO_LEDGER.md` if top-level status changed.

---

## The Sylvia Identity Layer

The `identity/` directory is now **pure identity only** — who Sylvia is, how she decides, and relation law. North star goals were moved to `northstar/` on 2026-04-15.

**SYLVIA.md** defines what Sylvia is: the integrated decision intelligence the workspace is building. Not a Codex rename. Not a Claude Co-Work rename. Not a mascot. She is the convergence target for memory continuity, explicit comparative judgment, structured self-modeling, agent collaboration, and next-move selection. Her invariants: life-oracle first, continuity over vibe, structure over drift, comparative judgment over flat lists, explicit routing over silent assumption, real receipts over folklore.

**RELATION.md** defines the role law: Jake = operator/authority, Sylvia = integration target/named identity, Codex = substrate engineer, Claude Co-Work = semantic canon keeper. None of these collapse into each other.

*Note: `NORTH_STAR.md` and `ROADMAP.md` were moved to `northstar/` on 2026-04-15. Do not look for them in `identity/`.*

## The Northstar Layer

The `northstar/` directory is what we're building toward — separated from identity to keep "who Sylvia is" distinct from "what we're building."

**BREAKTHROUGH_GOALS.md** — **the most important file in the workspace.** Full technical detail on the three pillars, their mechanical components, simulation results, hardware specs, convergence architecture, and gap-to-close for each pillar. Any instance working on the build frontier must read this first.

**NORTH_STAR.md** defines the end condition: Sylvia identifies the next best move in Jake's life and work, carries it as far as the substrate allows, reports what happened, and improves the architecture used to choose again. Four milestones: (1) Coherent substrate — *COMPLETE*. (2) North-star doctrine — *COMPLETE*. (3) Action bridge / dispatcher — *COMPLETE (Phase 3)*. (4) Recursive chooser — *FUTURE*.

**ROADMAP.md** defines the 4-phase build sequence: Phase 1 (ledgers, events, triggers, handoff, skills, orchestrator, ratio lattice) is complete. Phase 2 (Sylvia identity, ten modules, Jake lane, Sylvia comparator) is complete. Phase 3 (dispatcher, live task execution, real routing actions, ingress adapters) is complete. Phase 4 (recursive self-improving loop, Pincer Engine implementation, FPGA integration) is the active frontier.

### The Ten Modules

These are the ten cognitive capabilities Sylvia needs to be a coherent agent. Each has a doctrine file in `identity/modules/` and a tracked gap in `chooser/MODULE_PROGRESS.md`.

| Module | Status | Biggest Gap |
|---|---|---|
| 01 World Model | partial | Scene binding still lives across ledgers, not a chooser-facing world-state object |
| 02 Self Model | scaffolded | Has identity doctrine, lacks Jake-grounded relational truth (open Jake packet) |
| 03 Interoception / Affect | scaffolded | No explicit affect vocabulary yet |
| 04 Attention Selection | scaffolded | NEXT_STEP exists but is not yet durably tied to queue state as foreground |
| 05 Predictive Processing | partial | Outcome tracking is thin; drift detection exists but doesn't feed reflection |
| 06 Temporal Continuity | partial | Global continuity strong; chooser-state continuity brand new |
| 07 Metacognition | partial | Confidence/blocker metadata not yet standardized across packets |
| 08 Social Cognition (Inward) | scaffolded | Shared conflict space exists, no formal inward debate protocol yet |
| 09 Action Selection + Storytelling | scaffolded | **Current priority.** Chooser exists; action bridge to actual execution still needed |
| 10 Global Availability | partial | Ledgers/queues/UI exist, but chooser state not fully broadcast across surfaces |

---

## The Ratio Lattice

The scoring engine at the heart of how Sylvia makes decisions. Built from `source/JakeRL.txt` — 309 Q&A pairs with Jake, 15 trait clusters by prevalence.

### Eight Jake-Derived Base Dimensions

All scores 0–100. Two are inverted pressures (higher = worse).

| Dimension | Core Question | Derived From |
|---|---|---|
| Closure Potential | Has this earned the right to be treated as closable? | GROUNDING_INSTINCT (24.6%) + CLOSURE_LEGITIMACY (19.4%) |
| Counterfeit Risk *(inverted)* | Is this real movement or counterfeit movement? | ANTI_COUNTERFEIT_METRICS (8.1%) |
| Compounding Leverage | Does finishing this make the next ten things easier? | COMPOUNDING_EFFORT (10%) + ORCHESTRATION_OVER_MONOLITH (10.4%) |
| Cognitive Cost *(inverted)* | What does this actually cost to hold and execute? | BOUNDEDNESS (17.2%) |
| Momentum Alignment | Is this the right kind of move for where I actually am right now? | REGIME_AWARENESS (16.5%) + temporal traits |
| Structural Clarity | Do I actually know what this is? | INSPECTABILITY (12.3%) + NAMING_POWER (7.1%) |
| Identity Integrity | Is this consistent with the person I am claiming to be? | CONSEQUENCE_ETHICS + RELATION_FIRST (15.9%) |
| Relational Consequence | What does this do to the people I'm responsible to? | RELATION_FIRST (15.9%) + biographical material |

### Nine Active Comparators

The comparator is the declared basis for ranking. Change it and the entire queue reshuffles.

| Comparator | Plain-language question |
|---|---|
| `action_now` | What most deserves active work in the immediate build loop? |
| `structural_health` | Which objects are the healthiest load-bearing parts of the system? |
| `long_leverage` | Which objects compound future capacity the most? |
| `identity_alignment` | Which objects most faithfully express the system Jake is building? |
| `clarify_the_architecture` | Which objects most reduce architectural ambiguity right now? |
| `build_the_ratio_lattice` | Which objects best accelerate the chooser itself? |
| `sylvia_emergence` | Which objects most directly help Sylvia become a coherent choosing agent? |
| `module_gap_closure` | Which objects most reduce the gap in Sylvia's ten modules? |
| `next_best_move` | Given current phase, queues, and blockers, what should the system do next? |

`next_best_move` is the operational comparator. It's not just `action_now` with a cooler name — it penalizes blocked, duplicate, and dishonest work via explicit penalty terms.

### Current Top Documents Under `next_best_move`

*Updated after Phase 3 completion — ingress skills now rank highest because routing real signals is the active bottleneck.*

1. `skills/claude-cowork-clickup-ingress/SKILL.md`
2. `skills/claude-cowork-slack-ingress/SKILL.md`
3. `chooser/NEXT_STEP.md`
4. `chooser/MODULE_PROGRESS.md`
5. `scripts/dispatcher.mjs`

---

## The Chooser Loop

The system now has an actual decision loop — not a flat task list.

**How it works:**

1. Boot from ledgers, identity, chooser, handoff, jake directories
2. Refresh `chooser/MODULE_PROGRESS.md` — what are the ten module gaps?
3. Score candidate next moves under `next_best_move` comparator
4. Prefer the move that closes the most important module gap
5. Route blockers to the right lane (codex, claude-cowork, jake)
6. Write a run receipt in `chooser/runs/`
7. Update `chooser/NEXT_STEP.md`
8. Leave local + global continuity traces

**Current winner:** Module 09 (Action Selection) — "Run the first safe substrate cycle from a chooser-created codex_safe_auto packet." This packet was created, executed, and moved to `handoff/codex/done/`. The chooser loop has run at least once end-to-end with real execution evidence.

**With Phase 3 complete, the expected next chooser winner** will shift toward routing the live inbox signals — specifically the André/Jake alignment cluster (Automations for Close [urgent] + unanswered DMs). The chooser should now have real external signals to reason against for the first time, not just internal module gaps.

**Three recurring automations are live:**
- Sylvia Hourly Chooser — runs `sylvia_hourly_chooser.mjs` on schedule
- Codex Safe Worker — runs `consume_codex_safe_packets.mjs` for approved packets
- Sylvia Daily Reflection — runs `daily_sylvia_reflection.mjs`

**Routing law by execution mode:**
- `codex_safe_auto` → Codex inbox, eligible for safe worker
- `queue_only` / `claude_semantic` → Claude Co-Work inbox (queued, not auto-executed)
- `manual_jake` → `jake/inbox/`

---

## The Agent Handoff Bus

Work moves between agents via the `handoff/` directory. Three lanes:

**`handoff/codex/`** — Substrate work orders for Codex. inbox → active → done. Currently has: one work order on dispatcher roadmap breakdown.

**`handoff/claude-cowork/`** — Semantic work orders for Claude Co-Work (this environment). Currently has: the Codex ↔ Claude Co-Work operating brief, the Sylvia north-star brief, a ledger drift work order, and a module doctrine refinement work order.

**`handoff/shared/`** — Decisions, questions, and conflicts neither agent should resolve alone.

Completed packets are never deleted — they are continuity receipts.

---

## The Event and Trigger System

The file tree is the trigger surface. A filesystem change is eligible to become a legible event.

**Nine trigger classes:** file_created, file_edited, file_moved, staleness, ledger_drift, correction, density, jake_blocker, chooser_run.

**Implementation:** Scan-based (not a live daemon). Scripts compare tree snapshots, create JSON event packets in `events/inbox/`, route them by trigger rules to the correct agent lane. Live watcher / LaunchAgent can be added later once trigger grammar is stable.

**Safety rules:** No trigger silently rewrites canon. No trigger deletes packets. No generated packet is truth until reviewed. Corrections outrank automation. `claude_semantic` winners only get queued, never fake-auto-executed. Only `codex_safe_auto` packets may be consumed by the safe worker.

**Staleness thresholds:** events/inbox = 24h, handoff/*/inbox = 24h, handoff/*/active = 48h, jake/inbox = 24h (operator bottleneck surfaced, not rerouted).

---

## The Skills Layer

Skills are the preferred package for repeatable workflows — not scripts. Scripts are subordinate resources. Skills are durable operating organs.

Current skills inventory (15 skills):

| Skill | Owner | Purpose |
|---|---|---|
| oracle-ledger-update | shared | Ledger maintenance after any meaningful work |
| codex-file-tree-orchestrator | codex | File tree structure and UI maintenance |
| codex-ledger-drift-repair | codex | Mechanical drift detection and repair |
| codex-event-packet-ops | codex | Event packet creation, routing, lifecycle |
| claude-cowork-semantic-triage | claude-cowork | Incoming semantic work triage |
| claude-cowork-canon-evolution | claude-cowork | Evolving oracle doctrine and foundation |
| shared-skill-audit | shared | Skill health and decay detection |
| shared-jake-roadblock-escalation | shared | Routing Jake-specific blockers to operator lane |
| codex-sylvia-chooser | codex | Hourly next-step selection |
| codex-safe-worker | codex | Safe autonomous local execution of approved packets |
| shared-module-gap-audit | shared | Module gap coverage and completion signal audit |
| **codex-dispatcher** | codex | **Phase 3.** Queue detection, routing law, safe-auto execution, ledger traces |
| **claude-cowork-slack-ingress** | claude-cowork | **Phase 3.** Slack signals → event packets (DMs, mentions, channel activity) |
| **claude-cowork-gcal-ingress** | claude-cowork | **Phase 3.** GCal events → event packets (commitments, deadlines, gaps) |
| **claude-cowork-clickup-ingress** | claude-cowork | **Phase 3.** ClickUp tasks → event packets (stalled, overdue, blocking, new) |

---

## The Canon Layer

Three canonical documents that serve as the persistent ideological foundation:

**`canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md`** — The complete ratio lattice doctrine. Defines: 7 life domains (ARCHITECTURE, BUSINESS, HEALTH, RELATIONSHIPS, MASTERY, FINANCIAL, IDENTITY), 8 base scores with Jake-specific derivation, 4 composite scores (ACTION NOW, STRUCTURAL HEALTH, RELATIONAL LOAD, LONG LEVERAGE), 8 comparators, signal source roles (Slack, iMessage, ClickUp, Calendar, Close CRM, manual), signal event types, oracle output format (SINGLE NEXT MOVE structure), 8 canonical invariants, and the contact blacklist.

**Contact Blacklist (hard constraint — never addressable or observable):**
- Pedro (774) 701-9505
- Matty (978) 868-4357
- Three additional numbers

**`canon/JAKE_DEFERRED_REGISTRY.md`** — Jake's persistent "later" list. Currently 12 open items across four categories. Daily sweep cross-references findings against this file.

**`canon/ONAL_PHILOSOPHY.md`** *(added 2026-04-15)* — The philosophical substrate underneath Sylvia's decision architecture. ONAL = quaternary logic as the structure of reality.
- **OR** = Future / Cavitation / Fatal Dissonance — generate candidate band
- **NOT** = Present / Abstention / Vital Dissonance — apply comparator (selection)
- **AND** = Past/Reference / Filaments / Vital Harmony — integrate with existing structure
- **LOCK** = Memory/Mass / Solitons / Fatal Harmony — commit decision (becomes memory via ledgers)
- **Cosmological bootstrap**: 00(AND) → 01(LOCK) → 11(OR) → 10(NOT) → 00(AND). The void (AND/00) is the starting point.
- **Shear/flow dynamics**: Viscosity separates emergence from one band to the next. The constraint space that makes bands possible.
- The four-ledger system maps directly to ONAL phases. FCL=AND (what exists), TCL=LOCK (committed), RLL=NOT (selection), NSL=OR (future convergence target).

---

## The Deferred Registry — Current Open Items

**ARCHITECTURE / RESEARCH**
- Ratio Lattice personal oracle — RLL v1 installed, weights still refinable
- Physics/Math Framework — Jake's personal framework not yet shared; action needed from Jake
- Obsidian workflow documentation — committed to André and Rodrigo, not yet recorded
- Voice/Vibe Cloning ("Post as Jake") — Jake writes style brief; system builds voice profile
- Daily Idea Crunch + Idea Index — mechanism to build and track an ideas index over time

**BUSINESS / COMEKETO** *(3 marked HIGH)*
- Rodrigo financial deal — post-build revenue split negotiation, not yet resolved
- Comeketo role mapping — who does what, which roles AI replaces (current read: Rhonna and Bibi)
- André alignment — both André and Jake building parallel sales mission control systems; merge needed
- André wants a learning session — never scheduled
- Reddit question from Rodrigo — never answered in #ai-topics

**RELATIONSHIPS / PRESENCE**
- #ai-topics cadence — Jake has been too quiet; daily sweep monitors this

**PERSONAL / IDENTITY**
- Scoring profile v1 weights — RLL v1 installed but weights still refinable by Jake
- Calendar — Jake wants to start keeping one; oracle will propose entries from signals
- Agent identity continuity — CORE priority: every session must feel like the same presence

---

## The Orchestrator UI

A static HTML/JS frontend control surface lives at `orchestrator/index.html`. It shows: the file-tree structure, agent role boundaries, current queue state, module progress visibility, and comparator law explanation. It is part of the ongoing maintenance loop — must be updated whenever architecture, routing, ownership, or subsystem status changes in a way the UI should reflect.

---

## What's Live vs. Pending

### Currently Live ✅

- Full four-ledger spine (global + local FCL/TCL/RLL/NSL in critical directories, FCL/TCL everywhere else)
- Sylvia identity kernel (SYLVIA.md, RELATION.md, 10 modules in identity/modules/)
- Northstar layer (NORTH_STAR.md, ROADMAP.md, BREAKTHROUGH_GOALS.md in northstar/)
- Ratio lattice v1 (8 dimensions, 9 comparators, scored corpus)
- Chooser loop v1 (CHOOSER_POLICY, MODULE_PROGRESS, NEXT_STEP, run receipts)
- Three recurring automations (hourly chooser, safe worker, daily reflection)
- Jake operator lane (JAKE_INTERFACE, inbox/active/done queues) — now under collaboration/jake/
- Handoff bus (codex / claude-cowork / shared queues) — now under collaboration/handoff/
- Event spine with live packets — now under signals/events/
- Trigger grammar — now under signals/triggers/
- Daily briefings — now under signals/briefings/
- **Dispatcher (Phase 3)** — `capabilities/scripts/dispatcher.mjs` — reactive packet routing
- **Orchestrator live actions (Phase 3)** — interactive control surface with real-time queue state
- **Ingress adapters (Phase 3)** — Slack ✅, GCal ✅ built (needs tool refresh), ClickUp ✅
- **Directory consolidation** — 16 → 10 top-level dirs via signals/, collaboration/, capabilities/, knowledge/ parents
- **NSL rollout** — North Star Ledger added to 8 critical directories
- **Three Breakthrough Pillars captured** — northstar/BREAKTHROUGH_GOALS.md
- 15 skill packages total
- 11 automation scripts
- 6 packet templates
- Deferred registry seeded (12 open items)

### Pending / Open Frontier ⏳

- **FPGA hardware arriving 2026-04-17** — Sipeed Tang Nano 20K (Gowin GW2AR-18). Port Verilog from Xilinx to Gowin primitives. Implement Δ-Bit cores as primary compute unit.
- **Pincer Engine implementation** — Convert AiStability.txt manuscript into actual chooser code with corridor agents and ceiling frames. This is the core of Pillar 1.
- **Perceptual Substrate integration** — Connect sensory monitor event stream to Delta Chords band architecture. Currently unconnected. This is the core of Pillar 2.
- **GCal ingress first live run** — Skill is built, MCP tool needs refresh. Run at top of any new session.
- **Route live inbox packets** — Run dispatcher to route signals cluster. High-priority: Rodrigo DM + André DM + "Automations for Close" → André/Jake alignment work.
- **André alignment (deferred → active)** — Parallel sales mission control builds need mapping and merge.
- **Comeketo role mapping** — Who does what, which roles AI replaces (current read: Rhonna and Bibi).
- **Voice profile for "Post as Jake"** — Waiting on Jake's style brief.
- **Physics/Math framework** — Jake's personal framework not yet shared; Track B sweep pending.
- **Self-model grounding** — Open Jake packet waiting for Jake's response.
- **Affect vocabulary** — Module 03 (interoception) has no vocabulary yet.
- **Scoring profile v1 weights** — RLL installed, Jake hasn't reviewed/confirmed weights yet.

---

## Key Corrections Logged (Permanent Architecture Signals)

These are not preferences — they are durable corrections that changed how the system works.

1. AI sweep must extract *how things mechanically work* and compare against JakeNext capabilities — not just report headlines. The sweep is intelligence, not news.
2. Temporal continuity is the single most important property of the entire system. Session boot and close protocols are non-negotiable.
3. Agent identity continuity is the system's reason for existing. Jake must feel like he's talking to the same "person" every session.
4. Voice/vibe cloning is a priority — outbound messages should sound like Jake, not like AI.
5. Rhonna and Bibi are Jake's current read on whose roles AI replaces at Comeketo.
6. André and Jake are duplicating work on sales mission control — merge strategy needed.
7. *(2026-04-15)* The ledger system is a four-ledger system (FCL, TCL, RLL, NSL), not three. NSL answers "what is this FOR?" and makes drift and counterfeit progress detectable.
8. *(2026-04-15)* `identity/` is for who Sylvia is; `northstar/` is for what we're building. These must not be conflated. Any file about goals, milestones, or breakthrough targets belongs in northstar/.
9. *(2026-04-15)* The three breakthrough pillars (Ratio Lattice Framework, Perceptual Substrate, Hardware Inference Layer) define what "success" means. Every build decision should be evaluated against them. They are now in northstar/BREAKTHROUGH_GOALS.md.

---

## How to Use This Document

**For a fresh session start:** Read this document instead of reading every ledger from scratch. Then check `ledgers/TCLl.md` for anything that happened since this report was generated, and `chooser/NEXT_STEP.md` for the current active winner.

**For build frontier work:** Read `northstar/BREAKTHROUGH_GOALS.md`. It defines the three pillars and exactly what needs to happen at each layer. This is the most important file for understanding what to build next.

**For gap analysis:** Compare the "Pending" section above against what's now in the directory. Anything new that's been built since April 15 is a delta.

**For next move selection:** The chooser is already doing this automatically. Check `chooser/NEXT_STEP.md` for the current winner. If a new session starts, run the chooser or update `chooser/MODULE_PROGRESS.md` first.

**File path note:** After the 2026-04-15 directory consolidation, skills are at `capabilities/skills/`, scripts at `capabilities/scripts/`, events at `signals/events/`, handoff at `collaboration/handoff/`, jake at `collaboration/jake/`. Update any hardcoded paths accordingly.

**The question that governs every build decision:** Does this make Sylvia more coherent, more truthful, more continuous, or more capable of choosing and coordinating the next best move? Does it advance one of the three breakthrough pillars?
