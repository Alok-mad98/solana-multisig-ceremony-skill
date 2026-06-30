# Multisig Policy Design

A multisig is only as strong as its **configuration independent of any one person**. This guide helps teams pick thresholds, timelocks, veto structures, and RBAC that match the value they protect.

> Based on the [SEAL Secure Multisig Best Practices](https://frameworks.securityalliance.org/wallet-security/secure-multisig-best-practices).

---

## 1. Asset Classification Matrix

| Assets Under Control | Recommended Signers | Threshold | Timelock | Veto Quorum |
|---|---|---|---|---|
| < $100K / test deployments | 3 | 2-of-3 | 24 h | 1-of-3 |
| $100K – $1M treasury / program authority | 5 | 3-of-5 | 48 h | 2-of-5 |
| $1M – $10M | 7 | 4-of-7 | 72 h | 3-of-7 |
| > $10M or protocol-critical authorities | 9+ | 5-of-9+ | 7 days | 4-of-9+ |

**Drift lesson:** a 2-of-5 with **zero timelock** controlled a protocol with hundreds of millions in TVL. That configuration was the exploit.

---

## 2. Threshold Selection

- Avoid **1-of-N** or **1 signer** for any mainnet authority.
- Avoid **N-of-N**: lose one signer and the funds/protocol are frozen.
- Target **~50 % + 1** threshold. This balances liveness with security.
- For **program upgrade authority** or **emergency pause**, consider a separate, higher-threshold multisig than the treasury.

---

## 3. Timelock Rules

| Sensitivity | Min Timelock | Rationale |
|---|---|---|
| Large treasury movement (>1 % of holdings) | 48 h | Allows off-chain response to anomalous activity |
| Program upgrade | 72 h – 7 days | Gives time for user notification and incident response |
| Signer set change | 7 days | Prevents rapid signer takeover |
| Emergency pause (limited role) | 0 h – 6 h | Fast response, but must be narrowly scoped |

**Golden rule:** anyone should be able to **propose** quickly; **execution** of dangerous actions should be slow.

---

## 4. Veto / Circuit-Breaker Quorum

- Define a **veto group** separate from the standard approval group.
- Veto members may include external security partners, auditors, or legal.
- A veto bypass should require **threshold + 2 additional signers** beyond normal execution.
- An automated circuit breaker (pause) should be able to fire instantly, but unpausing must require the multisig.

---

## 5. Role-Based Access Control (RBAC)

Don't give every signer every power. Common roles:

| Role | Powers | Typical Signers |
|---|---|---|
| Treasury manager | Move routine operating funds | Operations |
| Program guardian | Upgrade authority, emergency pause | Core devs + security |
| Signer admin | Add/remove signers, change threshold | Founders + external advisors |
| Oracle / market admin | Set risk parameters, add collateral | Risk team + advisors |

Use **modules** (Squads v4 permissions / custom programs) so a compromised treasury key cannot change program logic.

---

## 6. Segregated Authorities

Never put all authority in one multisig:

- **Treasury multisig** — lower threshold, controls day-to-day funds.
- **Program authority multisig** — higher threshold + timelock.
- **Emergency pause multisig** — small, fast, single-purpose.
- **Fee / reward admin** — separate role with spending caps.

If a single multisig controls everything, a 2-of-5 compromise is a total compromise.

---

## 7. Policy Documentation Checklist

- [ ] Multisig purpose and asset class
- [ ] Wallet addresses and chain
- [ ] Signer list with role and contact method
- [ ] Threshold, timelock, and veto configuration
- [ ] RBAC / module permissions
- [ ] Upgrade / pause / signer-change procedures
- [ ] Communication channels and escalation paths
- [ ] Drills schedule (at least quarterly)

Store the signed policy in the evidence repository (see [evidence-audit.md](evidence-audit.md)).
