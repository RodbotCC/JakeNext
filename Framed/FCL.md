# FCL — Framed Directory Contents Ledger

> Visual operating-manual system and glue layer for persistent autonomy.
> Last updated: 2026-04-16

---

## Purpose

Framed is a React/Vite application that builds executable operating manuals from annotated screenshots, labeled coordinates, operator notes, actions, validations, and transitions. It is the visible, inspectable runtime that connects agents, tools, workflows, and application state into one continuous operating system.

This directory contains the full Framed application — source code, build artifacts, and development configuration.

---

## Directory Structure

| Path | Purpose | Status |
|---|---|---|
| `src/` | Application source code | ✅ Live |
| `src/App.jsx` | Top-level app component, state management, tab routing | ✅ Live |
| `src/main.jsx` | Vite entry point | ✅ Live |
| `src/index.css` | Global styles | ✅ Live |
| `src/components/builder/` | Block Builder — canvas-first screenshot annotation, toolbar, element panel, drawers | ✅ Live |
| `src/components/flow/` | Flow Builder — block connections, flow canvas, suggestions | ✅ Live |
| `src/components/manual/` | Manual View — topological-order slide view of workflows | ✅ Live |
| `src/components/stats/` | Statistics — relationship graph, top pairs, transition data | ✅ Live |
| `src/components/settings/` | Settings — AI config, tool colors, annotation sizing | ✅ Live |
| `src/components/layout/` | AppShell and TabNav layout components | ✅ Live |
| `src/components/shared/` | Reusable UI primitives (PillButton, FormField, etc.) | ✅ Live |
| `src/bridge/` | Command bridge — API routes for agent orchestration | ✅ Live |
| `src/hooks/` | React hooks (localStorage, canvas, AI, relationships, command bridge, tools) | ✅ Live |
| `src/utils/` | Utilities (compile, db/IndexedDB, relationships graph, constants, uid) | ✅ Live |
| `src/tokens/` | Design tokens (color values) | ✅ Live |
| `dist/` | Build output | ✅ Built |
| `public/` | Static assets | ✅ Live |
| `node_modules/` | Dependencies | ✅ Installed |
| `package.json` | Project manifest | ✅ Live |
| `vite.config.js` | Vite configuration | ✅ Live |
| `index.html` | HTML entry | ✅ Live |
| `Framed.jsx` | Legacy/alternate entry (root-level) | ⚠️ Review needed |
| `.framed/state/` | Auto-synced JSON state (blocks, flow, relationships, app_index) | ✅ Live |

---

## Key Source Files

### Builder
| File | Purpose |
|---|---|
| `src/components/builder/BlockBuilder.jsx` | Main builder with drawer layout (left library, right panel, backdrop, canvas-first) |
| `src/components/builder/Canvas.jsx` | Screenshot canvas with annotation rendering |
| `src/components/builder/Toolbar.jsx` | Tool selection, scale controls, drawer toggles |
| `src/components/builder/ElementPanel.jsx` | Element editing, notes, AI refinement |
| `src/components/builder/BlockLibrary.jsx` | Block list, create/delete/switch |
| `src/components/builder/BlockMetaForm.jsx` | Block metadata (title, app, screen) |
| `src/components/builder/ActionConfig.jsx` | Action type + payload configuration |
| `src/components/builder/ValidationEditor.jsx` | Success/failure condition editing |
| `src/components/builder/NotesEditor.jsx` | Operator notes + AI refinement |
| `src/components/builder/AnnotationList.jsx` | Annotation inventory |
| `src/components/builder/CompileButton.jsx` | JSON block compilation |

### Flow
| File | Purpose |
|---|---|
| `src/components/flow/FlowBuilder.jsx` | Flow editing with block palette, success/fail recording |
| `src/components/flow/FlowCanvas.jsx` | Visual flow canvas with drag connections |
| `src/components/flow/FlowEdge.jsx` | Edge rendering |
| `src/components/flow/FlowNode.jsx` | Node rendering |
| `src/components/flow/FlowSuggestions.jsx` | Suggestion chips from relationship data |

### Infrastructure
| File | Purpose |
|---|---|
| `src/bridge/viteCommandBridge.js` | Vite middleware: GET /api/state, POST /api/state/sync, POST /api/command, GET /api/commands/pending |
| `src/bridge/commandHandlers.js` | Command execution handlers |
| `src/utils/db.js` | IndexedDB wrapper (images + relationships store, v2) |
| `src/utils/relationships.js` | Block relationship graph (recordFlowRun, recordManualConnection, getSuggestions, getTopPairs, exportGraph) |
| `src/utils/compile.js` | Block → JSON compilation |

---

## Live Capabilities

| Capability | Status |
|---|---|
| Block authoring (screenshot + coordinates + notes + action + validation) | ✅ |
| Canvas-first editing with drawer layout | ✅ |
| Annotation scale controls (S/M/L/XL) | ✅ |
| Flow building with drag connections | ✅ |
| Block relationship graph (IndexedDB v2) | ✅ |
| Manual view (topological-order slides) | ✅ |
| Command bridge (API for agent orchestration) | ✅ |
| Auto-sync to `.framed/state/` as JSON | ✅ |
| Settings page (AI, tools, annotations) | ✅ |
| Statistics (top pairs, transitions) | ✅ |

---

## Immediate Priorities

1. Finish canvas-first builder layout (drawers working, contextual editing next)
2. Make detail editing fully contextual (appear on selection, not permanent)
3. Reduce UI clutter
4. Strengthen application indexing as first-class feature
5. Expand relationship graph (richer weighting, subflow discovery, anomaly detection)

---

## Conventions

- State persisted to localStorage (`framed:*` keys) and IndexedDB
- Command bridge polls every 2 seconds for external commands
- `.framed/state/` contains JSON exports for external consumption
- No git repo inside this directory (versioning managed at JakeNext level)
