# Proposal Intent Review

Every multisig proposal should be readable by a human before it is signed. This file lists patterns to look for and how to classify risk.

---

## 1. Decode-First Rule

Before a signer approves, run:

```bash
npx tsx tools/decode-proposal.ts <transaction-base64-or-proposal-id>
```

The output must include:
- A plain-English sentence for each instruction
- Programs involved
- Accounts that are mutated
- SOL/SPL token movements
- Authority changes
- Compute budget and fee payer

---

## 2. Risk Classification

| Verdict | Meaning | Action |
|---|---|---|
| **SAFE** | Matches stated intent, no authority or large value transfer | Sign after normal verification |
| **WATCH** | Unexpected program, large value, or durable nonce present | Require additional signer review / out-of-band confirmation |
| **BLOCK** | Authority transfer, new collateral, unknown program, or signer-set change | Stop ceremony, escalate to veto group / security team |

---

## 3. Red Flags That Trigger BLOCK

These patterns should never be signed without explicit written approval from a supermajority:

- `SetAuthority` on any program, mint, token account, or PDA
- `Upgrade` program instructions outside a scheduled upgrade window
- Any instruction that **adds, removes, or swaps a multisig signer**
- Any instruction that changes **threshold or timelock**
- Whitelisting a **new collateral token** or **new oracle**
- Durable nonce present on a non-routine transaction
- Calls into programs not on the approved program allowlist
- Mass transfers / withdrawal-limit removals
- Proposals that bypass the timelock without veto-bypass quorum

---

## 4. Durable Nonce Detection

Use `tools/check-durable-nonce.ts` to answer:
- Is the transaction using a durable nonce?
- How old is the nonce account?
- Has the nonce value already been advanced?
- Does the transaction expire soon?

**Policy:** A durable nonce on an authority-changing proposal is a **BLOCK** unless explicitly scheduled and reviewed by the veto quorum.

---

## 5. Simulation Diff Review

For value-moving proposals:

1. Record pre-simulation balances for all affected accounts.
2. Run `simulateTransaction`.
3. Record post-simulation balances.
4. Flag any delta not explained by the stated intent.

Example: A proposal described as "pay 5,000 USDC to auditor" should not change an ATA balance by 500,000 USDC.

---

## 6. Natural-Language Summary Template

For each proposal, produce:

```
Proposal: <id>
Purpose: <one sentence>
Programs: <list>
Signers required: <M of N>
Value impact: <SOL/SPL movements>
Authority impact: <none / program authority / signer change>
Durable nonce: <yes/no, details>
Risk verdict: SAFE / WATCH / BLOCK
Recommended action: <sign / pause and review / escalate>
```

---

## 7. Typical Safe Patterns

| Routine Operation | Expected Programs |
|---|---|
| Salary / vendor payment | System, Token-2022 / SPL Token |
| Program upgrade (scheduled) | BPF Loader v3 / Upgradeable Loader, Squads config |
| Pause / unpause | Custom program with pauser role |
| Add signer (with timelock) | Squads v4 config / SPL Governance |

---

## 8. Drift-Specific Lesson

The Drift exploit proposal whitelisted a token (CVT) as collateral, removed borrowing limits, and removed withdrawal limits. None of those actions were obviously malicious in raw hex. The skill's job is to surface them as a **coherent narrative of risk** before anyone signs.
