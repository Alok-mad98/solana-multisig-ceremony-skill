---
name: solana-multisig-ceremony
description: Solana multisig signing-ceremony security and build-pipeline integrity skill. Guides teams through multisig policy design, signer onboarding, proposal intent review, durable-nonce detection, key rotation, and reproducible-build verification.
user-invocable: true
---

# Solana Multisig Ceremony & Build Integrity Skill

Use this skill when the user is designing, operating, or auditing a Solana multisig Security Council / treasury, or when they want to harden the supply chain of the programs those signers approve.

## Triggers
- "audit our multisig" / "is our Squads multisig safe?"
- "review this proposal before I sign"
- "durable nonce" / "what am I actually signing?"
- "key ceremony" / "signing ceremony" / "how should we rotate signers?"
- "reproducible build" / "npm provenance" / "supply chain" / "CI policy gate"
- "Drift" / "multisig compromise" / "blind signing"

## Operating Procedure
1. Load the appropriate routed skill file from `skill/` based on the task (see the routing table below).
2. Prefer **read-only RPC calls** and **simulation** before any state-changing suggestion.
3. Never ask for private keys or seed phrases.
4. For every sensitive action, produce an evidence record using the templates in `tools/evidence-report.md.tpl`.
5. If a tool is available (`tools/`), run it and surface its output; then explain the findings in plain English.

## Progressive Disclosure

| User asks about... | Read this first |
|---|---|
| Multisig policy design (threshold, timelock, veto) | [skill/design-policy.md](skill/design-policy.md) |
| Adding signers, hardware wallets, identity verification | [skill/signer-onboarding.md](skill/signer-onboarding.md) |
| Running a signing ceremony | [skill/ceremony-workflow.md](skill/ceremony-workflow.md) |
| Decoding a proposal / detecting durable nonces | [skill/intent-review.md](skill/intent-review.md) |
| Squads v4 / SPL Governance specifics | [skill/squads-governance.md](skill/squads-governance.md) |
| Rotating a signer after compromise or departure | [skill/key-rotation.md](skill/key-rotation.md) |
| Reproducible builds / CI policy / npm provenance | [skill/build-integrity.md](skill/build-integrity.md) |
| Evidence reports and audit artifacts | [skill/evidence-audit.md](skill/evidence-audit.md) |
| Source links and references | [skill/resources.md](skill/resources.md) |

## Agents
- **multisig-custodian** — expert persona for ceremonies, policy, intent review, and recovery.

## Commands
- `/audit-multisig` — score a live multisig against SEAL-style policy.
- `/review-proposal` — decode and risk-score a pending proposal.
- `/run-key-ceremony` — step-by-step ceremony checklist.
- `/rotate-signer` — safe key-rotation playbook.
- `/audit-build-integrity` — run supply-chain / CI checks.

For implementation details, see [skill/SKILL.md](skill/SKILL.md).
