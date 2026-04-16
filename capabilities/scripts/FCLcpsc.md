# FCL — Scripts
### Jake Personal Oracle Project

> Scan-based automation support for the JakeNext event spine and Sylvia chooser loop.
> Last updated: 2026-04-14

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `scan_tree.mjs` | Produces a normalized filesystem scan and updates `.oraclestate/tree_snapshot.json` unless run with `--dry-run` | ✅ Live |
| `detect_ledger_drift.mjs` | Compares filesystem truth with ledger/path claims and reports drift findings | ✅ Live |
| `create_event_packet.mjs` | Generates event packets for declared trigger types | ✅ Live |
| `route_event.mjs` | Routes event packets into Codex, Claude Co-Work, or shared handoff queues | ✅ Live |
| `daily_substrate_sweep.mjs` | Runs scan + drift detection and emits a daily substrate sweep event | ✅ Live |
| `update_module_progress.mjs` | Computes Sylvia module status and writes the chooser's gap table | ✅ Live |
| `sylvia_hourly_chooser.mjs` | Runs the chooser law, writes a run receipt, updates `NEXT_STEP.md`, and opens required packets | ✅ Live |
| `consume_codex_safe_packets.mjs` | Consumes only `codex_safe_auto` Codex packets and performs safe local substrate work | ✅ Live |
| `daily_sylvia_reflection.mjs` | Reviews recent chooser runs, updates module progress, and proposes loop improvements | ✅ Live |
| `dispatcher.mjs` | **Phase 3 dispatcher** — scans handoff queues for new packets, auto-executes `codex_safe_auto` packets via safe worker, surfaces semantic and Jake packets with full ledger traces. Supports one-shot and `--watch` daemon modes. State-tracked via `.oraclestate/dispatcher_state.json`. | ✅ v1 |
| `orchestrator_server.mjs` | **Phase 3 server** — serves `orchestrator/` UI as static files and exposes HTTP API endpoints that trigger live oracle actions (dispatcher, chooser, safe worker, reflection). Default port 7000. | ✅ v1 |
| `lib/oracle_fs.mjs` | Shared filesystem, hashing, routing, packet, and state helpers | ✅ Live |
| `lib/FCL.md` | Directory ledger for the shared script helper library | ✅ Live |
| `FCL.md` | This file — script directory contents ledger | ✅ Live |

---

## Rules

- Scripts preserve structure and create packets; they do not decide semantic meaning.
- Use `--dry-run` when testing routing or packet creation without writing events.
- Generated state belongs in `.oraclestate/`.
- The chooser loop may open packets automatically, but only the safe worker may execute them, and only when `Execution Mode` is `codex_safe_auto`.
