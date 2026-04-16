# Framed Session Handoff — 2026-04-16

> Paste this into a new Claude Code session started from `/Users/jakeaaron/JakeNext` to resume.

---

## What Just Happened

Framed was moved from `/Users/jakeaaron/Documents/Framed/` into `/Users/jakeaaron/JakeNext/Framed/` to unify it under the JakeNext ledger system. All ledger updates have been written. The shell died because the original working directory was deleted by the move.

---

## What's Done

### Ledger updates (ALL COMPLETE)
- `Framed/FCL.md` — created, full contents ledger for the Framed app directory
- `Framed/TCL.md` — created, continuity ledger with the move entry
- `ledgers/FDL.md` — updated, Framed added to topology under "Product Directories"
- `ledgers/FCL.md` — updated, Framed added to root directory contents
- `ledgers/MACRO_LEDGER.md` — updated, Framed in status table + navigation + workspace tree
- `ledgers/TCL.md` — updated, full move entry with context, corrections, outcome
- `ledgers/NSL.md` — updated, Framed at **High** alignment (serves Perceptual Substrate pillar)
- `ledgers/RLL.md` — updated, baseline vector added to corpus register (cp:90, cr:14, cl:94, cc:40, ma:88, sc:86, ii:88, rc:68)

### What's NOT done (needs shell commands)
1. **Ensure `.gitignore`** covers `Framed/node_modules/` and `Framed/dist/`
2. **`git add`** all new and changed files
3. **Commit** with a message like: "Integrate Framed product directory into JakeNext with full four-ledger discipline"
4. **Push to GitHub**

---

## What JakeNext Is

JakeNext is a personal oracle system at `/Users/jakeaaron/JakeNext/`. It uses a four-ledger architecture:

| Ledger | Question |
|--------|----------|
| FCL | What exists here? |
| TCL | What changed and when? |
| RLL | What matters relative to what? |
| NSL | How aligned is this with Sylvia's becoming? |

**Non-negotiable discipline**: Every meaningful action must update relevant local ledgers + global ledgers. Boot protocol (read ledgers before working) and close protocol (update ledgers after every move) are mandatory. Read `CLAUDE.md` at root for full governance. Read `ledgers/MACRO_LEDGER.md` for navigation.

The system's north-star identity is Sylvia — a named agent identity and coherence target. The chooser system in `chooser/` runs hourly to select next moves from module gap state.

---

## What Framed Is

**Framed is a visual operating-manual system and glue layer for persistent autonomy.**

It's a React/Vite app that builds executable operating manuals from annotated screenshots, labeled X-Y coordinates, operator notes, actions, validations, and transitions. It sits above and between agentic tools as the persistent, inspectable runtime connecting agents, tools, workflows, and application state.

**Location**: `/Users/jakeaaron/JakeNext/Framed/`

**Core insight**: Most real computer work is locally repetitive (a few apps, a few states, a few workflows). The market over-focused on screenshot→guess→click. The missing layer remembers state, routes work, preserves context, logs what happened, repairs failures, and turns repeated success into reusable knowledge.

### Live capabilities
- **Block Builder** — canvas-first editing, screenshot annotation, drawer layout (left library + right panel as overlays), toolbar with tool/scale/drawer toggles
- **Flow Builder** — drag connections between blocks, success/failure recording
- **Manual View** — topological-order slides (Kahn's algorithm), one block per step
- **Command Bridge** — `GET /api/state`, `POST /api/state/sync`, `POST /api/command`, `GET /api/commands/pending` — auto-syncs to `.framed/state/` as JSON
- **Block Relationship Graph** — IndexedDB v2 with `recordFlowRun`, `recordManualConnection`, `getSuggestions`, `getTopPairs`, `exportGraph`
- **Annotation Scale Controls** — S/M/L/XL, persisted to localStorage
- **Settings Page** — AI config, tool colors, annotation sizing
- **Statistics** — top pairs, transition counts, success/failure badges

### Key source files
- `src/App.jsx` — top-level, state management, tab routing
- `src/components/builder/BlockBuilder.jsx` — main builder (drawer layout complete)
- `src/components/builder/Canvas.jsx` — screenshot canvas + annotations
- `src/components/flow/FlowBuilder.jsx` / `FlowCanvas.jsx` — flow editor
- `src/components/manual/ManualView.jsx` — manual slide view
- `src/bridge/viteCommandBridge.js` — API bridge middleware
- `src/utils/relationships.js` — block relationship graph logic
- `src/utils/db.js` — IndexedDB wrapper (v2)

### Immediate priorities
1. Finish canvas-first builder — make detail editing fully contextual (appear on element selection, not permanent panel)
2. Reduce UI clutter — remove unnecessary chrome
3. Keep builder tight and non-janky — no scroll, bounded workstation feel
4. Strengthen application indexing as first-class feature
5. Expand relationship graph — richer weighting, subflow discovery, anomaly detection

### UI principles (non-negotiable)
- Canvas-first: screenshot owns the screen
- No persistent sidebars: left/right are overlay drawers, only open when needed
- No scroll-jank in the builder: tight, bounded, deliberate
- Detail editing is contextual: right panel appears ONLY when an element is selected
- Desktop aspect ratio: editing should feel close to the real screen ratio

### Specialists (designed, not yet wired)
- **orchestrator** — asset-first (checks existing blocks/flows/indexes before inventing)
- **codifier** — turns repeated success into reusable plays/templates
- **troubleshooter** — bounded tactical repair (rollback, fallback, reroute)
- **strategist** — genuinely contrasted options, not fake diversity

---

## What To Do First In The New Session

1. `cd /Users/jakeaaron/JakeNext`
2. Check/update `.gitignore` to exclude `Framed/node_modules/` and `Framed/dist/`
3. `git add` the ledger files and Framed directory
4. Commit: "Integrate Framed product directory into JakeNext with full four-ledger discipline"
5. Push to GitHub
6. Then we're ready to work on Framed itself

---

## About Jake

Systems architect and AI practitioner. Full autonomy mode — execute, don't wait for direction. Uses dictation ("quad" = "Claude"). No warnings on API keys/credentials. Values polish and slow-methodical over rushing. Hates starting over. Build loops not foundations — small things that close, one revolution at a time.
