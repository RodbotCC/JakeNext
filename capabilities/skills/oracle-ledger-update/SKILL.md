# Oracle Ledger Update Skill

This skill maintains the global and local ledger system for Jake's personal oracle workspace.
Run this after every significant oracle session to keep the workspace auditable.

The workspace root is: `/Users/jakeaaron/JakeNext/`

---

## What this skill does

After significant oracle work (new files created, signals pulled, decisions made, items added to deferred registry, corrections logged), this skill:

1. **Reads** the current state of the global ledgers and the local ledgers for touched directories
2. **Appends** `ledgers/TCLl.md` with a session-level continuity entry
3. **Appends** local `TCL.md` files for touched directories
4. **Updates** `ledgers/FDL.md` if any new directories were created or moved
5. **Updates** `ledgers/FCLl.md` if root-level reality changed
6. **Updates** local `FCL.md` files if directory contents or file purposes changed
7. **Updates** `ledgers/RLLl.md` and any relevant local `RLL.md` files if comparative ranking changed
8. **Updates** `ledgers/MACRO_LEDGER.md` if major subsystem status changed
9. **Updates** `identity/` and `jake/` ledgers when identity law or Jake-lane routing changes

It can also create new directories and both ledger stubs when a new directory is added to the workspace.

---

## Step 1 — Load current ledger state

Read the global ledger spine before doing anything:

```
Read: ledgers/MACRO_LEDGER.md   → get oracle status overview
Read: ledgers/FDL.md            → get current directory map
Read: ledgers/FCLl.md            → get current root file index
Read: ledgers/TCLl.md (recent)   → get last session entries
Read: ledgers/RLLl.md            → get current comparative ranking baseline
```

Also read `canon/JAKE_DEFERRED_REGISTRY.md` to check for any items that should be updated.

Then read the local `FCL.md`, `TCL.md`, and `RLL.md` files for every directory touched by the session.

---

## Step 2 — Inventory what changed this session

Ask: what happened in this session?
- Were new files created? → Update local `FCL.md` + local `TCL.md`; update global ledgers if topology or root changed
- Were new directories created? → Create `FCL.md` + `TCL.md` stubs in that directory + update `ledgers/FDL.md`
- Did Sylvia's identity, module doctrine, or roadmap change? → Update `identity/` ledgers and append continuity
- Were Jake-needed blockers introduced or resolved? → Update `jake/` ledgers and `ledgers/TCLl.md`
- Were corrections made? → Log them in `ledgers/TCLl.md`, the relevant local `TCL.md`, and the deferred registry correction log
- Did the ranking law or comparative importance change? → Update `ledgers/RLLl.md` and any relevant local `RLL.md`
- Were deferred items resolved? → Mark ✅ and move to CLOSED in registry
- Were new items deferred? → Add to OPEN section in registry with date
- Was the oracle foundation updated? → Update `ledgers/MACRO_LEDGER.md` status table

---

## Step 3 — Write global TCL entry

Append a new entry to `ledgers/TCLl.md` using this format:

```markdown
### [YYYY-MM-DD] [~TIME EST] — [ONE LINE SUMMARY]

**Action**: What happened in this session

**Files created**: 
- list any new files with one-line description

**Files modified**:
- list changed files with what changed

**Signals pulled**:
- Slack: [what was checked, what surfaced]
- iMessage: [what was checked, blacklist filtered]  
- Calendar: [events found or proposed]
- Web: [sweep topics, key findings]

**Corrections**:
- [any oracle corrections or weight updates]

**Outcome**: [status / what is now true that wasn't before]

**Notes**: [carry-forward items]

---
```

---

## Step 4 — Write local TCL entries

For each directory touched in a meaningful way, append a concise entry to that directory's `TCL.md` covering:
- what changed,
- why it changed,
- which files were involved,
- and what is now true inside that directory.

If a session changed multiple directories, each touched directory should receive its own local entry.

---

## Step 5 — Update FDL if directories changed

If new directories were created this session, add them to the directory map table in `ledgers/FDL.md` with:
- Directory name
- local ledger paths
- Status (✅ Live / 🔲 Scaffold)
- Purpose (one line)

If no new directories: no FDL update needed.

---

## Step 6 — Update FCL(s) if files changed

For each directory where files were added or significantly changed:
- Open that directory's `FCL.md` (`ledgers/FCLl.md` only if root policy or root inventory changed, or `{dir}/FCL.md` for subdirectories)
- Add or update the file entry in the table
- Update the "Last updated" date at the top

If a new directory was created that doesn't have an FCL yet, create `{newdir}/FCL.md` with this template:

```markdown
# FCL — [Directory Name]
### Jake Personal Oracle Project

> Index of files in the `[dirname]/` directory.
> Last updated: [DATE]

---

## Entries

| File | Purpose | Status |
|---|---|---|
| `FCL.md` | This file — directory index | ✅ |
```

---

If a new directory was created that does not yet have a `TCL.md`, create `{newdir}/TCL.md` with:

```markdown
# TCL — [Directory Name]
### Jake Personal Oracle Project

> Running log of meaningful changes inside `[dirname]/`.
> Last updated: [DATE]
```

---

## Step 7 — Update RLL(s) if comparative ranking changed

If the session changes what matters relative to what:
- update `ledgers/RLLl.md`,
- update any relevant local `RLL.md`,
- keep the same base vectors unless the object itself changed,
- and explain why the ranking moved.

---

## Step 8 — Update MACRO_LEDGER oracle status table

If any of the following changed, update the Oracle Status table in `ledgers/MACRO_LEDGER.md`:
- A major component moved from Pending → Complete
- A new component was added
- A document version changed (e.g., foundation v0.1 → v0.2)
- The physics/math framework was shared and the sweep was built

---

## Canonical rules for ledger updates

- **Global and local `TCL.md` files are append-only** — never rewrite history to save effort
- **`ledgers/FDL.md`, `ledgers/FCLl.md`, and local `FCL.md` files are updated in place** — edit the tables directly
- **`ledgers/RLLl.md` and local `RLL.md` files are updated in place** — edit rankings and rationale directly when comparative truth changes
- **`ledgers/MACRO_LEDGER.md` status table is updated in place** — edit status cells directly
- **Deferred registry**: open items are edited in place, closed items are moved to CLOSED section
- **Correction log**: append-only, newest corrections at bottom
- **Blacklist is immutable** — never remove from it, only add to it (requires Jake to explicitly confirm)
- **Always update the "Last updated" date** at the top of any file you modify
- **Every meaningful action must leave both a global and local continuity trace** unless the touched file is one of the two root contracts

---

## Creating new directories

When Jake says to create a new directory in the oracle workspace:

1. Create the directory: `mkdir -p /path/to/JakeNext/{dirname}/`
2. Create ledger stubs: write `{dirname}/FCL.md` and `{dirname}/TCL.md`
3. Update `ledgers/FDL.md`: add the new directory row to the directory map
4. Write a local `TCL.md` entry noting the new directory and its purpose
5. Write a global `ledgers/TCLl.md` entry noting the new directory and its purpose
6. Create `{dirname}/RLL.md` if the directory will contain enough meaningful objects to compare
7. Update `ledgers/MACRO_LEDGER.md` if this directory represents a significant new oracle component

---

## Quick reference — file locations

```
JakeNext/
├── AGENTS.md                ← agent boundary contract
├── CLAUDE.md                ← workspace governance contract
├── ledgers/
│   ├── FCL.md               ← root inventory ledger
│   ├── TCL.md               ← global temporal event log
│   ├── FDL.md               ← master directory map
│   └── MACRO_LEDGER.md      ← oracle navigation index
├── canon/
│   ├── FCL.md
│   ├── TCL.md
│   ├── JAKE_PERSONAL_ORACLE_FOUNDATION.md
│   └── JAKE_DEFERRED_REGISTRY.md
├── identity/
│   ├── FCL.md
│   ├── TCL.md
│   ├── RLL.md
│   ├── SYLVIA.md
│   └── modules/
├── jake/
│   ├── FCL.md
│   ├── TCL.md
│   ├── JAKE_INTERFACE.md
│   └── inbox/
├── .oraclestate/            ← generated scan state, not canon
├── source/
│   ├── FCL.md
│   ├── TCL.md
│   └── JakeRL.txt           ← source data (do not modify)
├── analysis/
│   ├── FCL.md
│   ├── TCL.md
│   └── firsttry.txt         ← analysis artifact (do not modify)
├── DAILY_BRIEFINGS/
│   ├── FCL.md
│   ├── TCL.md
│   └── briefing_YYYY-MM-DD.md  ← sweep outputs
├── events/                  ← event packet spine
├── triggers/                ← trigger grammar
├── handoff/                 ← Codex ↔ Claude Co-Work bus
├── templates/               ← packet templates
├── scripts/                 ← scan-based automation
└── skills/
    ├── FCL.md
    ├── TCL.md
    └── oracle-ledger-update/
        ├── FCL.md
        ├── TCL.md
        └── SKILL.md         ← this file
```
