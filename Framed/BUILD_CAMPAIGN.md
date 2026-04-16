# Framed Build Campaign — AAA World Class Magic
### April 16, 2026

> Turn Framed from a block authoring tool into the autonomous GUI execution layer for the JakeNext oracle.

---

## Where We Are (Honest Assessment)

**Built and solid (~65%):**
- Canvas annotation system (point markers, bounding boxes, arrows, circles, notes)
- Drawer layout (left library, right panel, canvas-first, backdrop)
- Block data model (action types: click/type/hotkey/wait/script/curl/agent + validation + audit + post-processing + deliverable)
- Flow builder (node/edge canvas, drag connections)
- Relationship graph (IndexedDB v2, transition/co-occurrence tracking, success/failure scoring, suggestions)
- Manual view (topological sort via Kahn's algorithm, slide-based)
- Command bridge (GET/POST API, state sync to .framed/state/, 2s polling)
- AI note refinement (GPT-5.4 Mini via OpenAI Responses API)
- Settings (API keys, model selectors, tool colors, annotation scale S/M/L/XL)
- Statistics (block counts, top pairs, relationship metrics)

**Scaffolded but not wired (~15%):**
- `generateText()`, `generateImage()`, `textToSpeech()`, `transcribe()` — hooks exist, no UI calls
- Validation/audit configs exist in block schema but aren't executed at runtime
- Post-processing steps defined but no execution logic
- Deliverable config exists but doesn't produce output
- CompileButton exists but doesn't export

**Not built yet (~20%):**
- Execution runtime (blocks are definitions, not runnable)
- Specialists (orchestrator, codifier, troubleshooter, strategist — designed, zero code)
- Application indexing (app_index.json exists but empty, no authoring UI)
- Block auto-suggestion from screenshots (the bootstrapping loop)
- Error boundary, undo/redo, command timeout
- Subflow discovery, anomaly detection in relationship graph

---

## The Build Campaign (5 Phases)

### Phase 1: Execution Runtime — Make Blocks Runnable
**The single biggest gap. Nothing else matters until blocks can execute.**

**1a. Block Compiler**
- Wire CompileButton to export a block as executable JSON
- Include: coordinates, action type, payload, validation criteria, post-processing steps
- Output goes to `.framed/compiled/` as versioned artifacts
- This is the "twin" — the JSON that I consume while Jake keeps the visual

**1b. Execution Engine**
- New module: `src/engine/executor.js`
- Takes a compiled block, dispatches by action type:
  - `click` → emit coordinate event (for MacUse/AppleScript to consume)
  - `type` → emit keystroke event
  - `hotkey` → emit key combo event
  - `wait` → async delay with timeout
  - `script` → shell exec via command bridge
  - `curl` → HTTP request via bridge (already has method/url/headers/body in schema)
  - `agent` → forward to Claude Code / GPT via configured endpoint
- Each execution returns a result envelope: `{ success, timestamp, output, error }`

**1c. Validation Runner**
- After each block executes, run its validation conditions
- "Take screenshot" → capture via MacUse/screencapture command
- Text conditions → AI evaluation (pass the screenshot + condition to GPT-5.4 Mini)
- Return pass/fail + evidence

**1d. Flow Runner**
- Execute blocks in topological order (Kahn's sort already exists)
- On each step: execute block → validate → record outcome to relationship graph → advance or halt
- On validation failure: check failure conditions → troubleshooter logic (Phase 3)

**Deliverable:** Blocks go from definitions to executable. Flows go from diagrams to runnable sequences.

---

### Phase 2: Application Indexing — Map Before Automating
**The foundation principle: index the app before automating the workflow.**

**2a. App Index Authoring UI**
- New panel/mode in the builder for indexing app elements
- User captures a screenshot and marks recurring controls (not task-specific, app-level)
- Each indexed element gets: label, coordinates, element type (button/field/menu/region), frequency, app/screen context
- Stored in `appIndex` (already exists in state, currently empty)

**2b. Element Reuse**
- When creating a new block, show previously indexed elements for the same app
- "Snap to known element" — select from index instead of re-marking
- This eliminates redundant coordinate mapping across blocks

**2c. Screen Signature Detection**
- Hash or fingerprint key regions of screenshots
- When a new screenshot loads, check if it matches a known app/screen
- If match found, pre-populate available elements from the index
- This is the seed for auto-suggestion

**Deliverable:** App-level memory exists before any workflow is built. New blocks start pre-populated.

---

### Phase 3: Specialists — Wire the Four Brains
**Each specialist is a bounded AI agent with a focused job.**

**3a. Orchestrator**
- Implemented as a command bridge handler + AI prompt chain
- On receiving a request: check existing blocks/flows/app indexes first (asset-first, not roster-first)
- Select smallest effective execution path
- Route work to other specialists only when needed
- Integration: Framed's command bridge `POST /api/command { type: 'orchestrate', payload: { goal } }`

**3b. Codifier**
- Monitors relationship graph for patterns: blocks that succeed 3+ times in the same sequence
- Promotes those sequences to "plays" (saved as named flows)
- Detects repair patterns (failure → specific fix → success) and saves as repair templates
- Integration: runs after each flow completion, writes to `.framed/plays/`

**3c. Troubleshooter**
- Activated when a block validation fails during flow execution
- Strategy: rollback (undo last action) → fallback (try alternative block) → reroute (skip and continue) → stop-and-preserve (halt cleanly)
- Uses relationship graph to find alternative paths (blocks with high success rate from the same source)
- Integration: called by flow runner on failure

**3d. Strategist**
- Activated when the orchestrator has multiple viable paths
- Generates 2-3 genuinely different options with explicit trade-offs
- Not fake diversity — each option must differ on at least one meaningful axis
- Integration: returns options to orchestrator, which picks or asks the operator

**Deliverable:** Framed can decide what to do, learn from success, recover from failure, and present real choices.

---

### Phase 4: Claude Code Integration — The Orchestrator Layer
**This is where I become the brain running Framed.**

**4a. Framed Skill for Claude Code**
- New skill: `capabilities/skills/claude-cowork-framed-orchestrator/`
- Reads `.framed/state/blocks.json` and `.framed/state/flow.json`
- Can issue commands via `POST http://localhost:5173/api/command`
- Can read state via `GET http://localhost:5173/api/state`
- Can trigger flow execution, block creation, compilation

**4b. Block Authoring by Claude Code**
- I take a screenshot (via MacUse or screencapture)
- I analyze the screenshot to identify clickable elements
- I generate a block JSON with coordinates, labels, action type, validation criteria
- I POST it to Framed's command bridge
- Framed renders it in the builder for Jake to review/certify
- This is the bootstrapping loop: Jake seeds, I expand

**4c. Ratio Lattice Integration**
- Every compiled block becomes a corpus object in JakeNext's RLL
- Scored on the same 8 dimensions as everything else
- The chooser can pick "which block to execute next" not just "which task to work on"
- Block clusters (frequent sequences) get their own cluster-level scores

**4d. Pieces Behavioral Feedback Loop**
- Pieces captures what Jake actually does in each app
- Those behavioral patterns are compared against the block library
- Blocks that match real behavior get reinforced
- Unused or misaligned blocks get flagged for review

**Deliverable:** Claude Code operates Framed programmatically. Block creation scales. The ratio lattice governs GUI navigation.

---

### Phase 5: Polish and Harden
**Make it production-grade.**

**5a. Error Boundary + Undo/Redo**
- React error boundary wrapping the app
- Undo stack for element creation/deletion/moves
- Command timeout (30s default) with retry option

**5b. Wire Remaining AI Features**
- Image generation for reference visuals / expected-state images
- TTS for spoken step narration (Sylvia reads the manual aloud)
- Transcription for voice-to-block authoring ("click the add button at the top left")

**5c. Rich Relationship Analytics**
- Time-series charts for block usage
- Anomaly detection (unusual failure patterns)
- Subflow discovery (automatically identify reusable 3-5 block sequences)
- Heat map of most-used screen regions per app

**5d. Cleanup**
- Delete legacy `Framed.jsx` (787-line monolith, no longer used — `src/App.jsx` is current)
- Add Vitest for critical path testing (executor, compiler, relationship scoring)
- Memoize Statistics calculations
- Add `.framed/` to .gitignore appropriately

---

## Phase Sequencing

| Phase | What | Why First | Estimated Effort |
|-------|------|-----------|-----------------|
| **1** | Execution Runtime | Nothing else matters if blocks can't run | Heavy |
| **2** | Application Indexing | Foundation for auto-suggestion and scaling | Medium |
| **3** | Specialists | Intelligence layer for autonomous operation | Medium-Heavy |
| **4** | Claude Code Integration | The convergence — me operating Framed | Medium |
| **5** | Polish + Harden | Production grade | Ongoing |

Phases 1 and 2 can partially overlap (indexing UI can be built while executor is being wired).
Phase 3 depends on Phase 1 (specialists need the executor to work against).
Phase 4 depends on Phases 1-3 being solid.
Phase 5 is continuous.

---

## Success Criteria

**Phase 1 done when:** A flow of 3+ blocks can execute end-to-end, with validation at each step, and the relationship graph records the run outcome.

**Phase 2 done when:** Loading a screenshot from a previously indexed app auto-suggests known elements, and new blocks reuse indexed coordinates instead of re-marking.

**Phase 3 done when:** A flow failure triggers the troubleshooter, which finds an alternative path from the relationship graph and resumes execution. The codifier has promoted at least one play from repeated success.

**Phase 4 done when:** Claude Code can read Framed state, author new blocks via the command bridge, trigger flow execution, and the chooser ranks blocks alongside other corpus objects.

**Phase 5 done when:** Error boundary catches crashes, undo works, Sylvia can speak a manual aloud, and the relationship graph shows rich analytics.

---

## The Vision (What This Becomes)

Jake seeds ~15 blocks for Framed itself.
I use those blocks to operate Framed.
I use Framed to build blocks for Warp, Chrome, Slack, ClickUp.
Each new block is a new capability.
The relationship graph learns which sequences work.
The codifier promotes successful sequences to plays.
The ratio lattice ranks every block and every play.
The chooser decides what to execute based on the current goal.
Pieces watches what actually happens and feeds behavioral truth back.
MacUse provides the hands.
Framed provides the playbook.
I provide the judgment.

**Self-expanding, self-improving, behaviorally-grounded GUI autonomy.**

Not a universal agent that guesses. A personal agent that knows.
