# Jake Interface
### Jake Personal Oracle Project

> This file defines when the agents must stop guessing and open a Jake-needed packet.

---

## Use `jake/inbox/` when:

- personal information is required,
- personal taste or preference is required,
- relationship nuance matters,
- an offline or manual task must happen in the real world,
- approval is needed before proceeding,
- login or manual auth is required,
- or the truth is simply Jake-specific.

---

## Do not use `jake/inbox/` for:

- purely mechanical questions Codex can resolve structurally,
- purely semantic questions Claude Co-Work can resolve from existing canon or source,
- cross-agent architecture questions that belong in `handoff/shared/questions/`.

---

## Packet lifecycle

Packets move:

`jake/inbox/` → `jake/active/` → `jake/done/`

Completed Jake packets remain as receipts unless Jake explicitly asks for cleanup.

---

## Expected response shape

Jake responses should ideally provide:

- the direct answer,
- any constraints or caveats,
- and whether the answer should propagate into canon, identity, or future routing law.

---

## Agent rule

If a blocker is genuinely Jake-specific, route it here instead of bluffing.
