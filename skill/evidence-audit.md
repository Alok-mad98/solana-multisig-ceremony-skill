# Evidence & Audit Reports

Security ceremonies are only useful if their outcomes are provable. This file defines the evidence format and storage rules.

---

## 1. What Counts as Evidence

- Signed attestation messages from signers.
- Screenshots or logs of hardware-wallet verification.
- Simulation outputs and decoded proposal summaries.
- Multisig configuration snapshots.
- Ceremony attendance list.
- Timestamps and transaction signatures.
- Post-ceremony and post-incident reports.

---

## 2. Report Structure

Use `tools/evidence-report.md.tpl` to generate:

```markdown
# Evidence Report — <Ceremony / Audit / Incident>

## Metadata
- Date: <ISO date>
- Type: onboarding | ceremony | rotation | incident | audit
- Multisig: <address>
- Facilitator: <name> <contact>
- Evidence keeper: <name>

## Participants
| Name | Role | Address | Verification method |
|---|---|---|---|

## Artifacts
- Audit snapshot: <link>
- Decoded proposals: <links>
- Simulation outputs: <links>
- Attestation signatures: <links>

## Decisions
- Proposals approved: <ids>
- Risk verdicts: <SAFE/WATCH/BLOCK>
- Follow-up actions: <list>

## Signatures
| Signer | Hash / signature | Date |
|---|---|---|
```

---

## 3. Storage Rules

- Store reports in a **git-signed** repository or tamper-evident log.
- Use a dedicated branch or repo separate from application code.
- Keep at least one copy offline or in a different cloud account.
- Do **not** store private keys or seed phrases in evidence.

---

## 4. Audit-Readiness

When an external auditor arrives, they should be able to verify within 15 minutes:
- Who the signers are and how they were verified.
- What the current threshold/timelock/RBAC is.
- The last 3 signing ceremonies and what was approved.
- How build integrity is enforced.
- That evidence has not been silently deleted (signed git history).

---

## 5. Retention

- Active signer onboarding evidence: retain for life of multisig + 7 years.
- Upgrade ceremony evidence: retain for life of program + 7 years.
- Incident / rotation evidence: retain indefinitely.
- Routine payment evidence: retain for 2 years or per legal requirement.
