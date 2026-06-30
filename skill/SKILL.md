# Solana Multisig Ceremony & Build Integrity Skill

> **Purpose:** transform multisig security from a one-time setup into a repeatable, auditable lifecycle — and harden the build pipeline that produces what signers approve.

## What This Skill Is For

Use this skill when the user asks for:

### Multisig Design & Policy
- "How many signers should we have?"
- "What threshold and timelock should we set?"
- "Should we add a veto quorum?"
- "How do we segment roles (treasury vs program authority)?"

### Signer Onboarding & Key Ceremony
- "How do we onboard a new Security Council signer?"
- "Hardware wallet setup for a Squads signer"
- "Air-gapped signing ceremony checklist"
- "How do we verify a signer's address out-of-band?"

### Proposal Intent Review
- "Can you review this proposal before I sign?"
- "Is this durable nonce transaction safe?"
- "What does this Squads config change actually do?"
- "Why does this transaction transfer authority?"

### Key Rotation & Recovery
- "A signer laptop may be compromised — what now?"
- "How do we rotate a hardware wallet?"
- "Signer left the team / lost their seed"

### Build Integrity
- "How do I verify a reproducible build on Solana?"
- "npm provenance and lockfile hygiene"
- "CI policy gate for Solana programs"
- "Dependency supply-chain checklist"

---

## Default Principles
1. **No single point of failure.** Minimum 3 signers; 50 % threshold; 7+ signers for $1M+ assets.
2. **Timelock by default.** Every sensitive action has a delay unless a higher-threshold veto explicitly bypasses it.
3. **Out-of-band verification.** Critical changes (add/replace signer, authority transfer) require a separate channel — video call + signed attestation.
4. **Read-only first.** Tools simulate and inspect before any write is suggested.
5. **Evidence trail.** Every ceremony and audit produces an immutable, exportable report.

---

## Operating Procedure
### 1. Classify the Task
| Task | Primary skill file |
|---|---|
| Policy design | [design-policy.md](design-policy.md) |
| Signer onboarding | [signer-onboarding.md](signer-onboarding.md) |
| Signing ceremony | [ceremony-workflow.md](ceremony-workflow.md) |
| Proposal review | [intent-review.md](intent-review.md) |
| Squads/Governance mechanics | [squads-governance.md](squads-governance.md) |
| Key rotation / recovery | [key-rotation.md](key-rotation.md) |
| Build integrity | [build-integrity.md](build-integrity.md) |
| Evidence / audit reports | [evidence-audit.md](evidence-audit.md) |

### 2. Use the Right Tool
| Intent | Tool |
|---|---|
| Audit a live multisig | `tools/audit-multisig.ts` |
| Decode a proposal | `tools/decode-proposal.ts` |
| Check for durable nonces | `tools/check-durable-nonce.ts` |
| Ceremony checklist | `tools/key-ceremony-checklist.sh` |
| Build integrity scan | `tools/audit-build-integrity.sh` |
| Export report | `tools/evidence-report.md.tpl` |

### 3. Produce a Verdict in Plain English
For every proposal or audit, summarize:
- **What** the transaction / config does
- **Who** must still sign
- **Risk level:** SAFE / WATCH / BLOCK
- **Why** it was rated that way
- **Recommended next step**

---

## Commands
| Command | Description |
|---|---|
| `/audit-multisig` | Score a live multisig config against policy |
| `/review-proposal` | Decode and risk-score a pending proposal |
| `/run-key-ceremony` | Walk through a signing ceremony checklist |
| `/rotate-signer` | Execute a safe signer-rotation playbook |
| `/audit-build-integrity` | Run reproducible-build / CI-policy checks |

## Agents
| Agent | Purpose |
|---|---|
| **multisig-custodian** | Ceremony coaching, policy review, intent decoding, recovery playbooks |

---

## Credentials
All tools read from `.env`:
```bash
SOLANA_RPC_URL=
HELIUS_API_KEY=
SQUADS_MULTISIG_ADDRESS=
ANCHOR_PROVIDER_WALLET=
```

Do not commit `.env`.
