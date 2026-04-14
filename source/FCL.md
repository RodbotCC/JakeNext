# FCL — Source
### Jake Personal Oracle Project

> Raw input data that seeds the oracle's knowledge of Jake.
> These files are read-only reference material — do not modify.
> Last updated: 2026-04-14

---

## What this directory is

Source data files that the oracle draws from to understand Jake's cognitive profile, decision patterns, and historical work. These are not oracle outputs — they are the raw material the oracle was built from.

---

## Entries

| File | Type | Description | Status |
|---|---|---|---|
| `JakeRL.txt` | Text / Q&A | Jake's cognitive profile — 309 Q&A pairs across 15 trait clusters. Derived from analysis of Jake's personal history, thinking patterns, and methodological tendencies. Used to derive the oracle's 8 base score definitions and relative weights. | 📂 Source |
| `RLL.md` | Ledger / ranking | Local Ratio Lattice Ledger for `source/`, declaring why `JakeRL.txt` is currently the dominant source object for lattice building. | ✅ Live |

---

## Relationship to oracle

- `JakeRL.txt` → **8 Base Scores** in `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md`
  - GROUNDING_INSTINCT (24.6%) → Closure Potential
  - CLOSURE_LEGITIMACY (19.4%) → Counterfeit Risk
  - BOUNDEDNESS (17.2%) → Cognitive Cost
  - REGIME_AWARENESS (16.5%) → Momentum Alignment
  - RELATION_FIRST (15.9%) → Relational Consequence
  - INSPECTABILITY (12.3%) → Structural Clarity
  - COMPOUNDING_EFFORT (10.0%) → Compounding Leverage
  - CONSEQUENCE_ETHICS + biographical → Identity Integrity

## Notes

- Do not edit `JakeRL.txt` — it is the source of record
- When Jake's scoring weights are declared (v1), log them in the deferred registry and update `canon/JAKE_PERSONAL_ORACLE_FOUNDATION.md`
- Future source files (physics/math framework, additional profile data) will go here
- `source/RLL.md` tracks comparative importance within this directory
