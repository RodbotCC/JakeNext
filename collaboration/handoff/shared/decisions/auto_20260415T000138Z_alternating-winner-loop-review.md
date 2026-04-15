# Work Order

Owner: `shared`
Status: `inbox`
Created: `2026-04-15T00:01:38Z`

## Source Artifact

`chooser/runs/reflection_20260415T000138Z.md`

## Reason

The chooser is not repeating one identical winner three times in a row, but it is clearly cycling between `04_attention_selection` done receipts and the same unresolved `09_action_selection_storytelling` owner-decision cluster. That means the present reflection rule is too blunt for the actual loop shape.

## Desired Output

Decide whether chooser reflection should escalate:

- alternating two-step winner loops,
- unresolved winners that survive lane changes,
- or maintenance moves that keep closing cleanly while the same blocker returns.

The output should leave one explicit rule for when this pattern becomes a real architecture-level mismatch instead of just "still working on it."

## Constraints

- Do not silently demote `04_attention_selection`; it is doing truthful maintenance work.
- Do not close or replace Jake's live `09_action_selection_storytelling` packet without an explicit better route.
- Keep the change as a chooser-law or reflection-law clarification, not a hidden scoring tweak.

## Completion Signal

A shared decision or routing update exists that explains how the chooser should treat alternating stale loops like the current `04` / `09` pattern.
