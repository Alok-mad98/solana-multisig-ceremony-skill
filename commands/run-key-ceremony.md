# Command: /run-key-ceremony

## Purpose
Walk a team through a structured signing ceremony for one or more multisig proposals.

## When to use
- High-value proposals (large treasury moves, program upgrades, signer changes).
- Any proposal involving authority transfer.
- Quarterly or ad-hoc Security Council ceremonies.

## Steps
1. List pending proposals and ask the facilitator which are in scope.
2. For each proposal, load `skill/intent-review.md` and produce a decoded summary.
3. Read `skill/ceremony-workflow.md` and enforce the environment checklist.
4. Step through verify → sign → evidence-capture for each signer.
5. Export an evidence report using `tools/evidence-report.md.tpl`.

## Output
- A ceremony agenda.
- Verdicts for each proposal.
- Signer confirmation checklist.
- Evidence report file path.

## Example prompt
```
/run-key-ceremony
```
