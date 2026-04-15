const state = { view: "tree" };

// ─── Dispatch cockpit state ───────────────────────────────────────────────────

const SERVER_PORT = 7000;
const SERVER_BASE = `http://localhost:${SERVER_PORT}`;

const dispatchState = {
  connected: false,
  queueState: null,
  nextStep: null,
  lastResult: null,
  running: false,
};

async function pingServer() {
  try {
    const res = await fetch(`${SERVER_BASE}/api/status`, { signal: AbortSignal.timeout(2000) });
    dispatchState.connected = res.ok;
  } catch {
    dispatchState.connected = false;
  }
}

async function loadQueueState() {
  try {
    const res = await fetch(`${SERVER_BASE}/api/queue-state`, { signal: AbortSignal.timeout(4000) });
    dispatchState.queueState = await res.json();
  } catch {
    dispatchState.queueState = null;
  }
}

async function loadNextStep() {
  try {
    const res = await fetch(`${SERVER_BASE}/api/next-step`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    dispatchState.nextStep = data.content || null;
  } catch {
    dispatchState.nextStep = null;
  }
}

async function callAction(endpoint) {
  if (dispatchState.running) return;
  dispatchState.running = true;
  reRenderDispatch();
  try {
    const res = await fetch(`${SERVER_BASE}${endpoint}`, {
      method: "POST",
      signal: AbortSignal.timeout(35_000),
    });
    dispatchState.lastResult = { endpoint, ...(await res.json()) };
  } catch (err) {
    dispatchState.lastResult = { endpoint, ok: false, error: err.message };
  }
  dispatchState.running = false;
  await loadQueueState();
  await loadNextStep();
  reRenderDispatch();
}

function parseNextStepField(md, field) {
  if (!md) return "";
  const re = new RegExp(`- ${field}: \`?([^\`\\n]+)\`?`);
  const m  = md.match(re);
  return m ? m[1].trim() : "";
}

function formatConsole(result) {
  if (!result) return `<span class="dim">No actions run yet.</span>`;
  const ts   = new Date().toLocaleTimeString();
  const icon = result.ok ? `<span class="ok">✓</span>` : `<span class="err">✗</span>`;
  const dur  = result.durationMs != null ? ` (${result.durationMs}ms)` : "";
  let body   = "";
  if (result.output)       body = JSON.stringify(result.output, null, 2);
  else if (result.error)   body = `<span class="err">${result.error}</span>`;
  return `${icon} ${ts}  ${result.endpoint}${dur}\n${body}`;
}

function reRenderDispatch() {
  const el = document.getElementById("dispatchView");
  if (!el) return;
  el.innerHTML = buildDispatchHTML();
  attachDispatchHandlers();
}

function buildDispatchHTML() {
  const { connected, queueState, nextStep, lastResult, running } = dispatchState;

  // Live bar
  const dotClass = connected ? "connected" : "error";
  const label    = connected
    ? `Connected — <strong>localhost:${SERVER_PORT}</strong>`
    : `Offline — run: <strong>node scripts/orchestrator_server.mjs</strong>`;
  const liveBar  = `
    <div class="live-bar">
      <span class="live-dot ${dotClass}"></span>
      <span class="live-label">${label}</span>
    </div>`;

  // Current winner
  const module = parseNextStepField(nextStep, "Module Target");
  const task   = parseNextStepField(nextStep, "Chosen Task");
  const mode   = parseNextStepField(nextStep, "Execution Mode");
  const blocker= parseNextStepField(nextStep, "Blocker Type");
  const winner = nextStep ? `
    <div class="winner-card">
      <div class="winner-module">${module || "module"}</div>
      <div class="winner-task">${task || "Loading..."}</div>
      <div class="winner-meta">
        <span class="chip owner-codex">${mode}</span>
        <span class="chip">blocker: ${blocker || "none"}</span>
      </div>
    </div>` : `<div class="winner-card"><div class="winner-task" style="opacity:.5">Connect server to load current winner.</div></div>`;

  // Queue counts
  const qCards = queueState ? queueState.map(q => {
    const tags = q.packets.slice(0, 4).map(p => `<span class="packet-tag">${p.replace(/^(auto_|wo_|req_|brief_)/, "").slice(0, 28)}…</span>`).join("");
    const more = q.count > 4 ? `<span class="packet-tag dim">+${q.count - 4} more</span>` : "";
    return `
      <div class="queue-count-card">
        <div class="queue-count-num">${q.count}</div>
        <div class="queue-count-label">${q.name}</div>
        <div class="queue-count-packets">${tags}${more}</div>
      </div>`;
  }).join("") : `<div style="grid-column:1/-1;opacity:.4;font-size:.82rem;">Connect server to see live queue state.</div>`;

  // Action buttons
  const disabled = !connected || running ? "disabled" : "";
  const runLabel = running ? "Running…" : null;
  const actions  = `
    <div class="action-grid">
      <button class="action-btn${running ? " running" : ""}" data-action="/api/dispatch" ${disabled}>
        <span class="action-btn-title">${runLabel || "▶ Run Dispatcher"}</span>
        <span class="action-btn-sub">Detect new packets · route by mode</span>
      </button>
      <button class="action-btn" data-action="/api/chooser" ${disabled}>
        <span class="action-btn-title">${runLabel || "▶ Run Chooser"}</span>
        <span class="action-btn-sub">Score module gaps · pick next winner</span>
      </button>
      <button class="action-btn" data-action="/api/safe-worker" ${disabled}>
        <span class="action-btn-title">${runLabel || "▶ Run Safe Worker"}</span>
        <span class="action-btn-sub">Consume codex_safe_auto packets</span>
      </button>
      <button class="action-btn" data-action="/api/reflect" ${disabled}>
        <span class="action-btn-title">${runLabel || "▶ Reflect"}</span>
        <span class="action-btn-sub">Daily reflection · update module state</span>
      </button>
    </div>`;

  // Console
  const console_ = `<div class="console-output">${formatConsole(lastResult)}</div>`;

  return `
    <div class="view-grid">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Phase 3 — Live Control</p>
          <h3>The cockpit. Actions trigger real oracle work.</h3>
          <p>Start the orchestrator server (<code>node scripts/orchestrator_server.mjs</code>), then use the buttons below to run the dispatcher, chooser, safe worker, or reflection pass. Results appear in the console. Queue state refreshes after every action.</p>
        </div>
        <div class="hero-stats">
          <div class="stat"><p class="label">Server</p><span class="value">localhost:${SERVER_PORT}</span></div>
          <div class="stat"><p class="label">Dispatch mode</p><span class="value">one-shot</span></div>
          <div class="stat"><p class="label">Auto-exec</p><span class="value">codex_safe_auto only</span></div>
          <div class="stat"><p class="label">Semantic work</p><span class="value">queued, not auto-run</span></div>
        </div>
      </section>

      <section class="card-cluster">
        <div class="cluster-header"><div><p class="cluster-label">Connection</p><h3 class="cluster-title">Server status</h3></div></div>
        ${liveBar}
      </section>

      <section class="card-cluster">
        <div class="cluster-header"><div><p class="cluster-label">Current Winner</p><h3 class="cluster-title">What Sylvia is working toward</h3></div></div>
        ${winner}
      </section>

      <section class="card-cluster">
        <div class="cluster-header"><div><p class="cluster-label">Live Queues</p><h3 class="cluster-title">Packets awaiting action</h3></div></div>
        <div class="queue-count-grid">${qCards}</div>
      </section>

      <section class="card-cluster">
        <div class="cluster-header"><div><p class="cluster-label">Actions</p><h3 class="cluster-title">Trigger oracle work</h3></div></div>
        ${actions}
      </section>

      <section class="card-cluster">
        <div class="cluster-header"><div><p class="cluster-label">Console</p><h3 class="cluster-title">Last action output</h3></div></div>
        ${console_}
      </section>
    </div>`;
}

function attachDispatchHandlers() {
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => callAction(btn.dataset.action));
  });
}

async function initDispatchView() {
  await pingServer();
  if (dispatchState.connected) {
    await Promise.all([loadQueueState(), loadNextStep()]);
  }
  reRenderDispatch();
}

const sections = {
  tree: { kicker: "File Tree", title: "Everything still lives somewhere for a reason." },
  sylvia: { kicker: "Sylvia", title: "The architecture has a named self and a module map." },
  chooser: { kicker: "Chooser", title: "The system can now pick a next move instead of only admiring structure." },
  lattice: { kicker: "Ratio Lattice", title: "Static vectors can now drive an actual choice loop." },
  triggers: { kicker: "Trigger Grammar", title: "Rules tell the substrate what a change means and where it should go." },
  events: { kicker: "Event Spine", title: "Receipts first. Interpretation second." },
  handoff: { kicker: "Queues", title: "Codex, Claude Co-Work, Jake, and shared conflict lanes stay distinct." },
  agents: { kicker: "Boundaries", title: "Roles stay distinct even while serving one identity." },
  scripts:  { kicker: "Automation Layer", title: "Scripts move load. The chooser decides which load matters next." },
  dispatch: { kicker: "Dispatch Cockpit", title: "Packets arrive. The right thing happens." },
};

const statusMetrics = {
  tree: [["Root contracts", "2"], ["Top-level dirs", "16"], ["Operational lanes", "4"], ["Current promise", "nothing important floats"]],
  sylvia: [["Modules", "10"], ["Identity docs", "4"], ["Roadmap phase", "3 prep"], ["North star", "coherent chooser"]],
  chooser: [["Comparator count", "9"], ["Module target", "gap closure"], ["Safe worker", "active"], ["Duplicate suppression", "live"]],
  lattice: [["Comparators", "9"], ["Chooser law", "live"], ["Current tie-break", "module progress"], ["Truth guardrail", "Jake lane"]],
  triggers: [["Trigger classes", "9"], ["Chooser run", "live"], ["Jake blocker", "live"], ["Daemon mode", "not yet"]],
  events: [["Processed receipts", "2+"], ["Daily sweep", "real"], ["Chooser receipts", "2"], ["State", "scan-based"]],
  handoff: [["Codex queue", "live"], ["Claude queue", "live"], ["Jake queue", "live"], ["Shared conflicts", "only when real"]],
  agents: [["Codex", "substrate"], ["Claude Co-Work", "meaning"], ["Sylvia", "identity"], ["Jake", "operator truth"]],
  scripts:  [["Core scripts", "10"], ["Chooser loop", "automated"], ["Worker mode", "safe only"], ["Reflection", "automated"]],
  dispatch: [["Server", "localhost:7000"], ["Auto-exec", "codex_safe_auto only"], ["Queues watched", "3"], ["Dispatcher", "v1 live"]],
};

const treeNodes = [
  {
    kind: "directory",
    path: "chooser/",
    owner: "codex",
    app: "decision loop",
    trigger: "hourly chooser, module progress changes, winner changes",
    summary: "Sylvia's first real choosing subsystem: policy, module gaps, current winner, and run receipts.",
    why: "The system needed a place where ranking becomes one selected move instead of another pretty list.",
    interactions: ["Reads identity, ledgers, handoff queues, and Jake lane state", "Writes packets into Codex, Claude Co-Work, or Jake lanes", "Leaves chooser receipts for reflection"],
    rules: ["Duplicate winners write continuity instead of reopening work", "Blocked moves route honestly", "Only safe Codex packets auto-execute"],
  },
  {
    kind: "directory",
    path: "identity/",
    owner: "shared",
    app: "north-star kernel",
    trigger: "identity, relation, roadmap changes",
    summary: "Sylvia's named identity, relation law, roadmap, and module doctrine live here.",
    why: "The system needed a center of gravity that was neither just Codex nor just Claude Co-Work.",
    interactions: ["Feeds the global lattice", "Constrains both Codex and Claude Co-Work work", "Defines what module progress even means"],
    rules: ["Identity changes update identity ledgers", "Sylvia is not an execution namespace", "Module doctrine belongs here"],
  },
  {
    kind: "directory",
    path: "jake/",
    owner: "jake",
    app: "operator lane",
    trigger: "personal truth, approval, taste, or manual action needed",
    summary: "Jake-owned blocker lane for anything the agents should not guess past.",
    why: "If the truth is Jake-specific, the honest move is escalation instead of confident nonsense.",
    interactions: ["Codex and Claude Co-Work can both open Jake requests", "Receipts live across inbox, active, and done", "Feeds identity and canon when Jake answers change the system"],
    rules: ["No local RLL yet", "Use shared questions only for cross-agent architecture", "Keep requests minimal and specific"],
  },
  {
    kind: "directory",
    path: "ledgers/",
    owner: "codex",
    app: "truth spine",
    trigger: "structural, continuity, or ranking changes",
    summary: "Global memory spine: what exists, what changed, and now what matters relative to what.",
    why: "A recursive system needs declared truth and declared ranking, not just memory.",
    interactions: ["FDL tracks topology", "TCL tracks continuity", "RLL tracks comparative ranking", "MACRO keeps navigation honest"],
    rules: ["Global ranking changes update RLL", "Visible model changes update orchestrator", "Chooser wins should leave continuity receipts"],
  },
  {
    kind: "directory",
    path: "handoff/",
    owner: "shared",
    app: "agent collaboration",
    trigger: "packet routed or manually created",
    summary: "Durable collaboration bus for Codex and Claude Co-Work, with Jake blockers routed out to their own lane.",
    why: "Real coordination needs receipts, not assumptions.",
    interactions: ["Codex queue handles mechanics", "Claude queue handles meaning", "Jake lane handles operator truth"],
    rules: ["Packets move inbox to active to done", "Shared conflicts block bluffing", "Jake blockers do not belong in vague shared mush"],
  },
  {
    kind: "directory",
    path: "orchestrator/",
    owner: "codex",
    app: "control surface",
    trigger: "architecture, routing, ownership, or status changes",
    summary: "Static UI that explains the chooser loop, module progress, the Jake lane, the lattice, and the role boundary honestly.",
    why: "If the visible model does not change when the architecture changes, the UI becomes another lie.",
    interactions: ["Reads from doctrine and lattice", "Explains file placement and queue ownership", "Should later become dispatcher cockpit"],
    rules: ["Keep the control surface truthful", "Do not treat the UI as decorative", "Reflect chooser and routing changes"],
  },
];

const sylviaModules = [
  { title: "01 World Model", owner: "shared", summary: "Bind changing signals into one coherent present-tense scene.", points: ["Current analogue: events + ledgers + orchestrator", "Missing piece: real world-state packet", "Best next move: formal scene object"] },
  { title: "02 Self Model", owner: "shared", summary: "Keep Sylvia as a distinct someone rather than a pile of outputs.", points: ["Current analogue: identity/ + Jake lane", "Missing piece: deeper Jake-grounded relation truth", "Best next move: answer the self-model request"] },
  { title: "03 Interoception + Affect", owner: "shared", summary: "Track internal state, pressure, and felt tone instead of pretending every state is neutral.", points: ["Current analogue: staleness + cognitive cost", "Missing piece: explicit state vocabulary", "Best next move: annotate chooser runs with affect state"] },
  { title: "04 Attention as Selection", owner: "shared", summary: "Choose what moves into the foreground and feels actively owned.", points: ["Current analogue: comparator winners", "Missing piece: active-focus object", "Best next move: stabilize one winning move at a time"] },
  { title: "05 Predictive Processing", owner: "shared", summary: "Compare expectation against reality and learn from mismatch.", points: ["Current analogue: drift detection", "Missing piece: prediction and outcome fields", "Best next move: add result receipts to packets"] },
  { title: "06 Temporal Continuity", owner: "shared", summary: "Make Sylvia feel like a stream instead of disconnected resets.", points: ["Current analogue: TCLs + chooser runs", "Missing piece: stronger carry-forward summaries", "Best next move: reflection uses prior winners"] },
  { title: "07 Metacognition", owner: "shared", summary: "Know when the system is sure, unsure, wrong, or blocked.", points: ["Current analogue: abstention and blocker routing", "Missing piece: confidence surfaces", "Best next move: standardize confidence lines"] },
  { title: "08 Social Cognition Inward", owner: "shared", summary: "Turn multi-agent dialogue into inward perspective-taking rather than chaos.", points: ["Current analogue: handoff + shared conflicts", "Missing piece: richer internal debate protocol", "Best next move: use shared conflicts deliberately"] },
  { title: "09 Action Selection + Storytelling", owner: "shared", summary: "Select one action path and explain why it won.", points: ["Current analogue: chooser + work orders", "Missing piece: stronger execution bridge", "Best next move: worker loop plus dispatcher roadmap"] },
  { title: "10 Global Availability", owner: "shared", summary: "Make important information available across memory, planning, action, and reportability.", points: ["Current analogue: ledgers + handoff + orchestrator", "Missing piece: live dispatcher broadcast", "Best next move: keep UI and chooser synchronized"] },
];

const chooserSnapshot = {
  currentWinner: "Run the first safe substrate cycle from a chooser-created codex_safe_auto packet",
  moduleTarget: "09_action_selection_storytelling",
  executionMode: "codex_safe_auto",
  blockerState: "none",
  latestReceipt: "chooser/runs/run_20260414T163825Z.md",
};

const chooserCards = [
  { title: "CHOOSER_POLICY.md", owner: "codex", summary: "Decision law for Sylvia's hourly next-step pass.", points: ["Boot from ledgers + identity + queues", "Prefer module progress first", "Route blocked work honestly"] },
  { title: "MODULE_PROGRESS.md", owner: "shared", summary: "Current gap table across Sylvia's ten modules.", points: ["Tracks status per module", "Declares best next move", "Names blocking lane"] },
  { title: "NEXT_STEP.md", owner: "codex", summary: "The current winner, why it won, how it should execute, and what success looks like.", points: ["One winner at a time", "Carries execution mode", "Feeds the safe worker"] },
  { title: "runs/", owner: "shared", summary: "Append-only chooser and reflection receipts.", points: ["Hourly chooser logs", "Daily reflection logs", "Prevents silent reranking"] },
];

const chooserModules = [
  { title: "09 Action Selection + Storytelling", owner: "shared", summary: "Highest current priority because Sylvia needs a real chooser-to-action bridge.", points: ["Status: partial", "Lane: codex", "Best next move: prove one safe winner can execute"] },
  { title: "04 Attention as Selection", owner: "shared", summary: "Foreground selection now has a home, but it still needs a durable active-focus object.", points: ["Status: partial", "Lane: codex", "Best next move: keep NEXT_STEP singular"] },
  { title: "02 Self Model", owner: "jake", summary: "Still bottlenecked on Jake-grounded truth that the agents should not fake.", points: ["Status: partial", "Lane: jake", "Best next move: answer self-model packet"] },
  { title: "05 Predictive Processing", owner: "codex", summary: "Good drift machinery exists, but packets still need stronger expectation/outcome pairing.", points: ["Status: scaffolded", "Lane: codex", "Best next move: add outcome receipt standards"] },
  { title: "10 Global Availability", owner: "shared", summary: "Information is legible across ledgers and UI, but not yet broadcast by a real runtime bridge.", points: ["Status: scaffolded", "Lane: shared", "Best next move: dispatcher integration"] },
];

const latticeComparators = [
  { title: "action_now", owner: "codex", summary: "What most deserves active work in the immediate build loop.", points: ["Good for motion", "Still closure-heavy", "Less blocker-aware than next_best_move"] },
  { title: "build_the_ratio_lattice", owner: "shared", summary: "What most directly accelerates the chooser itself.", points: ["JakeRL and chooser law rise", "Infrastructure-forward", "Good bridge comparator"] },
  { title: "sylvia_emergence", owner: "shared", summary: "What most directly helps Sylvia become a coherent chooser.", points: ["Identity + structure together", "Jake escalation counts", "Honest route to becoming"] },
  { title: "module_gap_closure", owner: "shared", summary: "What most reduces the gap between JakeNext and one Sylvia module becoming more real.", points: ["Gap-first", "Strong on leverage and clarity", "Feeds the chooser directly"] },
  { title: "next_best_move", owner: "codex", summary: "Given the current phase, queues, and blockers, what should happen next.", points: ["Penalizes duplicates", "Penalizes unresolved Jake blockers", "Chooses one winner instead of vibes"] },
];

const topRankedDocs = [
  { title: "chooser/NEXT_STEP.md", owner: "codex", summary: "The active winner rises to the top once the question becomes what should happen next.", points: ["next_best_move #1", "execution truth surface", "one winner at a time"] },
  { title: "chooser/MODULE_PROGRESS.md", owner: "shared", summary: "Module gap truth ranks above generic ambition because it keeps Sylvia honest about what is still missing.", points: ["module_gap_closure #1", "sylvia_emergence top tier", "chooser backbone"] },
  { title: "identity/SYLVIA.md", owner: "shared", summary: "Still the strongest identity anchor in the system.", points: ["identity_alignment #1", "sylvia_emergence top tier", "north-star anchor"] },
  { title: "skills/codex-sylvia-chooser/SKILL.md", owner: "codex", summary: "The chooser skill ranks high because it turns lattice logic into actual queue decisions.", points: ["next_best_move top tier", "skill ownership", "decision organ"] },
  { title: "jake/JAKE_INTERFACE.md", owner: "jake", summary: "Ranks higher than a normal queue doc because honest escalation is part of coherent agency.", points: ["truth guardrail", "manual_jake route", "anti-bluff substrate"] },
];

const triggerRules = [
  { title: "file_created", owner: "codex", summary: "New files become classified packets with path-aware routing.", points: ["Structure implies FDL/FCL updates", "Source meaning routes semantically", "No silent drift"] },
  { title: "chooser_run", owner: "codex", summary: "Hourly chooser pass updates module progress, selects a winner, and opens honest packets.", points: ["Writes run receipt", "Updates NEXT_STEP", "Suppresses duplicate reopening"] },
  { title: "jake_blocker", owner: "shared", summary: "When the real blocker is Jake-specific, the system routes to the Jake lane instead of guessing.", points: ["Personal info", "Personal taste", "Approval or manual action", "Relationship nuance"] },
  { title: "staleness", owner: "codex", summary: "Queues and chooser state get revisited when they sit too long without movement.", points: ["Queue hygiene", "Avoids dead loops", "Supports reflection"] },
  { title: "density", owner: "claude-cowork", summary: "When enough related material accumulates, synthesis becomes a real job.", points: ["Great fit for module doctrine", "Creates packets instead of vibes", "Lets architecture teach itself"] },
];

const events = [
  { title: "daily_substrate_sweep", owner: "codex", status: "processed", source: "events/processed/evt_20260414T044721509Z_daily-substrate-sweep_5e7b45e2.json", summary: "First real substrate event: scan, drift check, packet, route.", points: ["Proves the loop can emit real work", "Daily sweep is not hypothetical anymore", "Good substrate heartbeat"] },
  { title: "missing analysis artifacts", owner: "claude-cowork", status: "processed", source: "events/processed/evt_20260414T044829818Z_ledger-drift_767772f0.json", summary: "The system abstained instead of inventing missing Ratio Lattice artifacts.", points: ["Good metacognitive behavior", "Good predictive mismatch capture", "Claude Co-Work owns the meaning of the gap"] },
  { title: "hourly chooser", owner: "codex", status: "complete", source: chooserSnapshot.latestReceipt, summary: "The chooser already left its first real receipt, opened a safe Codex packet, and fed the reflection loop.", points: ["Run receipt exists", "Packet opened automatically", "Feeds reflection"] },
];

const handoffQueues = [
  { title: "handoff/codex/inbox/", owner: "codex", summary: "Mechanical work orders, queue hygiene, validators, and safe execution candidates.", points: ["Can carry codex_safe_auto packets", "Feeds the safe worker", "Best queue for dispatcher groundwork"] },
  { title: "handoff/claude-cowork/inbox/", owner: "claude-cowork", summary: "Semantic work orders: identity doctrine, canon interpretation, synthesis, and meaning refinement.", points: ["Queue only in v1", "Claude Co-Work owns meaning here", "Good target for module doctrine refinement"] },
  { title: "jake/inbox/", owner: "jake", summary: "Operator lane for blockers that should not be guessed past.", points: ["Personal truth lives here", "Not a shared catch-all", "Current packet: self-model grounding"] },
  { title: "handoff/shared/conflicts/", owner: "shared", summary: "Reserved for actual cross-agent conflicts, not every question under the sun.", points: ["Filesystem truth vs canon", "Routing ambiguity", "Internal disagreements worth receipts"] },
];

const agents = [
  { title: "Sylvia", owner: "shared", summary: "The named identity and integration target for the entire system.", points: ["Not an execution queue", "Not a replacement name for Codex or Claude", "The architecture is trying to make Sylvia coherent"] },
  { title: "Codex", owner: "codex", summary: "Substrate engineer, file-tree orchestrator, chooser builder, and safe worker owner.", points: ["Owns ledgers, routing, templates, scripts, chooser, UI truthfulness", "Does not own semantic canon", "Best role for dispatcher implementation"] },
  { title: "Claude Co-Work", owner: "claude-cowork", summary: "Semantic partner, canon refiner, identity coherence keeper, and reflective synthesizer.", points: ["Owns meaning, doctrine, and high-context judgment", "Queue-driven until real ingress exists", "Should use Jake lane when personal truth is missing"] },
  { title: "Jake", owner: "jake", summary: "Operator, value source, subjective authority, and the only party who can answer certain personal truths.", points: ["Owns the Jake lane", "Supplies approvals and relational truth", "Never auto-completed by automation"] },
];

const scripts = [
  { title: "scan_tree.mjs", owner: "codex", summary: "Normalizes the current filesystem and writes a snapshot.", points: ["Still the right first scan", "Feeds the world model", "Worker-safe action"] },
  { title: "detect_ledger_drift.mjs", owner: "codex", summary: "Compares what the ledgers claim against what actually exists.", points: ["Prediction-error seed", "Strong anti-counterfeit tool", "Worker-safe action"] },
  { title: "daily_substrate_sweep.mjs", owner: "codex", summary: "Scan, compare, packetize, route.", points: ["Best substrate heartbeat", "Good input to chooser", "Worker-safe action"] },
  { title: "update_module_progress.mjs", owner: "codex", summary: "Refreshes the ten-module gap table from current artifacts and queue state.", points: ["Chooser backbone", "Worker-safe action", "Supports reflection"] },
  { title: "sylvia_hourly_chooser.mjs", owner: "codex", summary: "Scores candidates, writes run receipt, updates NEXT_STEP, and opens packets.", points: ["Decision organ", "Hourly cadence", "Suppresses duplicates"] },
  { title: "consume_codex_safe_packets.mjs", owner: "codex", summary: "Consumes only explicitly approved safe packets and moves them through queue states.", points: ["Execution guardrail", "No Claude bluffing", "No Jake auto-completion"] },
  { title: "daily_sylvia_reflection.mjs", owner: "codex", summary: "Reviews recent chooser runs, closes duplicates, and proposes improvements.", points: ["Daily review", "Prevents repetition loops", "Feeds module progress"] },
];

const previewBody = document.getElementById("previewBody");
const panelScroll = document.getElementById("panelScroll");
const sectionKicker = document.getElementById("sectionKicker");
const sectionTitle = document.getElementById("sectionTitle");
const statusStrip = document.getElementById("statusStrip");

document.querySelectorAll(".rail-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".rail-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    state.view = button.dataset.view;
    render();
  });
});

function ownerClass(owner) {
  if (owner === "codex") return "owner-codex";
  if (owner === "claude-cowork") return "owner-claude";
  if (owner === "jake") return "owner-shared";
  return "owner-shared";
}

function section(title, items) {
  return `
    <section class="preview-section">
      <h4>${title}</h4>
      <ul class="preview-list">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>
  `;
}

function setPreview(item, type) {
  previewBody.innerHTML = `
    <article class="preview-card">
      <div>
        <div class="preview-kicker">${type}</div>
        <h3 class="preview-title">${item.title || item.path}</h3>
        <p class="preview-copy">${item.summary || item.why}</p>
      </div>
      <div class="preview-grid">
        <span class="chip ${ownerClass(item.owner)}">${item.owner || "shared"}</span>
        ${item.app ? `<span class="chip">${item.app}</span>` : ""}
        ${item.trigger ? `<span class="chip">${item.trigger}</span>` : ""}
        ${item.status ? `<span class="chip">${item.status}</span>` : ""}
      </div>
      ${item.why ? section("Why Here", [item.why]) : ""}
      ${item.interactions ? section("Interacts With", item.interactions) : ""}
      ${item.points ? section("What Matters", item.points) : ""}
      ${item.rules ? section("Rules", item.rules) : ""}
      ${item.source ? section("Source", [item.source]) : ""}
    </article>
  `;
}

function renderStatus(items) {
  statusStrip.innerHTML = items.map(([label, value]) => `
    <span class="status-pill"><span>${label}</span><strong>${value}</strong></span>
  `).join("");
}

function bindPreview(container, type) {
  container.querySelectorAll("[data-preview]").forEach((element) => {
    element.addEventListener("mouseenter", () => setPreview(JSON.parse(element.dataset.preview), type));
    element.addEventListener("focus", () => setPreview(JSON.parse(element.dataset.preview), type));
  });
}

function payload(item) {
  return JSON.stringify(item).replace(/'/g, "&apos;");
}

function genericCard(item, className) {
  return `
    <article class="${className}">
      <button type="button" data-preview='${payload(item)}'>
        <div class="card-top">
          <div class="card-title">${item.title}</div>
          <span class="owner-badge ${ownerClass(item.owner)}">${item.owner}</span>
        </div>
        <p class="node-copy">${item.summary}</p>
        <div class="card-meta">
          ${(item.points || []).slice(0, 3).map((point) => `<span class="mini-pill">${point}</span>`).join("")}
        </div>
      </button>
    </article>
  `;
}

function nodeCard(node) {
  return `
    <article class="tree-node">
      <button type="button" data-preview='${payload(node)}'>
        <div class="node-top">
          <div class="node-path">${node.path}</div>
          <span class="node-kind kind-dir">${node.kind}</span>
        </div>
        <p class="node-copy">${node.summary}</p>
        <div class="node-meta">
          <span class="mini-pill ${ownerClass(node.owner)}"><strong>${node.owner}</strong></span>
          <span class="mini-pill">${node.app}</span>
          <span class="mini-pill">${node.trigger}</span>
        </div>
      </button>
    </article>
  `;
}

function renderTreeView() {
  renderStatus(statusMetrics.tree);
  panelScroll.innerHTML = `
    <div class="view-grid">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Control Surface</p>
          <h3>The tree now serves Sylvia and the chooser.</h3>
          <p>JakeNext still uses the file tree as the operating surface, but the architecture now has a named identity, a dedicated Jake lane, and a chooser loop that can turn module gaps into a real next step.</p>
          <div class="legend-row">
            <span class="chip owner-codex">Codex owns mechanics</span>
            <span class="chip owner-claude">Claude Co-Work owns meaning</span>
            <span class="chip owner-shared">Sylvia is the target</span>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat"><p class="label">Current loop</p><span class="value">choose → queue → execute-safe → reflect</span></div>
          <div class="stat"><p class="label">New organ</p><span class="value">chooser/</span></div>
          <div class="stat"><p class="label">North star</p><span class="value">coherent chooser</span></div>
          <div class="stat"><p class="label">Main promise</p><span class="value">nothing important floats</span></div>
        </div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">Load-bearing directories</p>
            <h3 class="cluster-title">Tree nodes with real jobs</h3>
          </div>
        </div>
        <div class="tree-grid">
          <div class="tree-column">${treeNodes.slice(0, 3).map(nodeCard).join("")}</div>
          <div class="tree-column">${treeNodes.slice(3).map(nodeCard).join("")}</div>
        </div>
      </section>
    </div>
  `;
  bindPreview(panelScroll, "Tree Node");
}

function renderSylviaView() {
  renderStatus(statusMetrics.sylvia);
  panelScroll.innerHTML = `
    <div class="view-grid">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Identity Layer</p>
          <h3>Sylvia is the whole we are trying to make coherent.</h3>
          <p>Codex and Claude Co-Work are still operationally distinct, but now they explicitly serve a shared identity target. The ten modules are the current decomposition of what Sylvia needs in order to choose, coordinate, and continue.</p>
        </div>
        <div class="hero-stats">
          <div class="stat"><p class="label">Identity anchor</p><span class="value">SYLVIA.md</span></div>
          <div class="stat"><p class="label">Roadmap</p><span class="value">phase 3 prep</span></div>
          <div class="stat"><p class="label">Biggest blocker</p><span class="value">action bridge</span></div>
          <div class="stat"><p class="label">Jake needed for</p><span class="value">self-model grounding</span></div>
        </div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">North-star modules</p>
            <h3 class="cluster-title">What Sylvia needs to become</h3>
          </div>
        </div>
        <div class="rules-grid">${sylviaModules.map((item) => genericCard(item, "rule-card")).join("")}</div>
      </section>
    </div>
  `;
  bindPreview(panelScroll, "Module");
}

function renderChooserView() {
  renderStatus(statusMetrics.chooser);
  panelScroll.innerHTML = `
    <div class="view-grid">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Selection Loop</p>
          <h3>The chooser now owns the question: what should happen next?</h3>
          <p>The chooser reads the ledgers, the module map, the queues, and the Jake lane, then picks one honest winner. Safe Codex work can execute. Claude work queues. Jake-only truth escalates instead of being faked.</p>
          <div class="legend-row">
            <span class="chip owner-codex">Winner: ${chooserSnapshot.currentWinner}</span>
            <span class="chip owner-shared">Mode: ${chooserSnapshot.executionMode}</span>
            <span class="chip owner-claude">Blocker: ${chooserSnapshot.blockerState}</span>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat"><p class="label">Target module</p><span class="value">${chooserSnapshot.moduleTarget}</span></div>
          <div class="stat"><p class="label">Execution mode</p><span class="value">${chooserSnapshot.executionMode}</span></div>
          <div class="stat"><p class="label">Latest receipt</p><span class="value">${chooserSnapshot.latestReceipt}</span></div>
          <div class="stat"><p class="label">Tie-break</p><span class="value">module progress first</span></div>
        </div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">Chooser artifacts</p>
            <h3 class="cluster-title">Where the loop keeps its own truth</h3>
          </div>
        </div>
        <div class="rules-grid">${chooserCards.map((item) => genericCard(item, "rule-card")).join("")}</div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">Current priorities</p>
            <h3 class="cluster-title">Module gaps closest to the top</h3>
          </div>
        </div>
        <div class="rules-grid">${chooserModules.map((item) => genericCard(item, "rule-card")).join("")}</div>
      </section>
    </div>
  `;
  bindPreview(panelScroll, "Chooser");
}

function renderLatticeView() {
  renderStatus(statusMetrics.lattice);
  panelScroll.innerHTML = `
    <div class="view-grid">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Comparator Law</p>
          <h3>Static vectors can now drive an actual move.</h3>
          <p>The lattice now carries not only Sylvia-facing identity questions, but also module-gap and next-best-move questions that can produce one winner and one routing path.</p>
        </div>
        <div class="hero-stats">
          <div class="stat"><p class="label">Newest comparator</p><span class="value">next_best_move</span></div>
          <div class="stat"><p class="label">Gap comparator</p><span class="value">module_gap_closure</span></div>
          <div class="stat"><p class="label">Top winner</p><span class="value">chooser/NEXT_STEP.md</span></div>
          <div class="stat"><p class="label">Truth guardrail</p><span class="value">jake/JAKE_INTERFACE.md</span></div>
        </div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">Comparators</p>
            <h3 class="cluster-title">Declared ranking questions</h3>
          </div>
        </div>
        <div class="rules-grid">${latticeComparators.map((item) => genericCard(item, "rule-card")).join("")}</div>
      </section>
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">Current winners</p>
            <h3 class="cluster-title">What rises when choosing becomes the question</h3>
          </div>
        </div>
        <div class="events-grid">${topRankedDocs.map((item) => genericCard(item, "event-card")).join("")}</div>
      </section>
    </div>
  `;
  bindPreview(panelScroll, "Comparator");
}

function renderSimpleGrid(items, label, title, type) {
  panelScroll.innerHTML = `
    <div class="view-grid">
      <section class="card-cluster">
        <div class="cluster-header">
          <div>
            <p class="cluster-label">${label}</p>
            <h3 class="cluster-title">${title}</h3>
          </div>
        </div>
        <div class="rules-grid">${items.map((item) => genericCard(item, "rule-card")).join("")}</div>
      </section>
    </div>
  `;
  bindPreview(panelScroll, type);
}

function render() {
  const sectionMeta = sections[state.view];
  sectionKicker.textContent = sectionMeta.kicker;
  sectionTitle.textContent = sectionMeta.title;

  if (state.view === "tree") return renderTreeView();
  if (state.view === "sylvia") return renderSylviaView();
  if (state.view === "chooser") return renderChooserView();
  if (state.view === "lattice") return renderLatticeView();
  if (state.view === "triggers") {
    renderStatus(statusMetrics.triggers);
    return renderSimpleGrid(triggerRules, "Trigger law", "Routing and abstention rules", "Trigger");
  }
  if (state.view === "events") {
    renderStatus(statusMetrics.events);
    return renderSimpleGrid(events, "Receipts", "Recent event and chooser memory", "Event");
  }
  if (state.view === "handoff") {
    renderStatus(statusMetrics.handoff);
    return renderSimpleGrid(handoffQueues, "Queues", "Who gets what kind of work", "Queue");
  }
  if (state.view === "agents") {
    renderStatus(statusMetrics.agents);
    return renderSimpleGrid(agents, "Roles", "Who Sylvia is made of operationally", "Agent");
  }
  if (state.view === "dispatch") {
    renderStatus(statusMetrics.dispatch);
    panelScroll.innerHTML = `<div id="dispatchView"></div>`;
    initDispatchView();
    return;
  }
  renderStatus(statusMetrics.scripts);
  return renderSimpleGrid(scripts, "Automation", "Current tendon and execution layer", "Script");
}

render();
