---
name: codex-event-packet-ops
description: Use when Codex needs to create, route, inspect, or audit JakeNext event packets and handoff work orders, especially for file changes, trigger outputs, substrate sweeps, and queue lifecycle receipts.
---

# Codex Event Packet Ops

Use this skill when the job is packet flow rather than semantic judgment.

## What this skill does

- Creates event packets from declared trigger types.
- Routes packets into Codex, Claude Co-Work, or shared queues.
- Keeps event inbox/processed/failed lifecycle clean.
- Audits packet receipts so the machine can explain what happened.

## Why this skill exists

The event spine is the bridge between “a thing changed” and “an agent should do something.” Without clean packet flow, triggers become noise.

## When to use it

- A trigger fires and needs a packet.
- A frontend or dispatcher needs a packet shape.
- Handoff queues need routing or cleanup.
- A daily substrate sweep needs to become durable work.

## Rules

- Inbox is active space, not archive.
- Processed packets are receipts and should stay traceable.
- Failed packets require recovery, not deletion.
- Routing ambiguity goes to shared conflicts.
- Packet creation is allowed; semantic interpretation is not part of this skill.

