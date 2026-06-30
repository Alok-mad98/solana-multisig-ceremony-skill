# Squads v4 & SPL Governance Notes

This file covers the two most common on-chain multisig systems on Solana and what to audit in each.

---

## 1. Squads v4

Squads is the most widely used Solana multisig. Most protocol treasuries and upgrade authorities live in Squads v4 programs.

### Key objects
- **Multisig** — config: members, threshold, time lock, allocator.
- **Proposal** — one or more transactions bundled for approval.
- **Transaction** — the actual instructions to execute.
- **Vault** — PDA-owned token account for treasury.
- **Spending limit** — per-member, per-mint, per-period withdrawal allowance.

### What to audit
Use `tools/audit-multisig.ts` to verify:

- [ ] Member count and threshold fit the policy matrix in [design-policy.md](design-policy.md).
- [ ] Time lock is enabled and set appropriately (not zero for high-value roles).
- [ ] Spending limits exist and are not excessive.
- [ ] Rent exemption is maintained.
- [ ] No stale proposals (old active proposals can be revived maliciously).
- [ ] The `rent_collector` and `allocator` are controlled by the multisig, not a single key.

### Config transaction red flags
- `multisig_add_member` combined with `multisig_set_threshold` in one proposal = takeover risk.
- `multisig_set_time_lock` to zero = removes safety window.
- `spending_limit_add_or_remove` without timelock = backdoor.

### Client libraries
- `@sqds/multisig` v2.1.x is the current stable package.
- For version-specific calls, always cross-check the [Squads docs](https://docs.squads.so/).

---

## 2. SPL Governance / Realms

Used by DAOs with token-vote governance. More complex but follows similar principles.

### What to audit
- [ ] Governance threshold and min community tokens to create a proposal.
- [ ] Veto option is enabled for high-risk proposals.
- [ ] Proposal cool-off / voting period matches the value at stake.
- [ ] Realm authority does not bypass governance for critical state changes.
- [ ] Executed proposals match the off-chain vote text.

### Common risks
- **Low voter participation** allows a small coalition to pass proposals.
- **Unilateral emergency powers** in the realm authority undermine DAO trust.
- **Instruction stuffing** — a proposal bundles a popular action with a hidden privilege escalation.

---

## 3. Cross-Program Integration

Many protocols use both:
- **Squads v4 treasury** for day-to-day operations.
- **SPL Governance + executable instruction** for protocol-parameter changes.

Audit boundary ownership: the multisig that can change program params should not also be the only treasury.

---

## 4. Useful RPC Calls

```bash
# Squads v4 multisig config
solana account <MULTISIG_ADDRESS> --output json

# List active proposals (use Helius DAS or custom indexer)
curl ${SOLANA_RPC_URL} -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getProgramAccounts","params":["SQDS4ep65T869zMBqeqSuBUTWVFok2xHMTeLqrJPhin",{"encoding":"base64"}]}'

# Simulate a proposal before execution
curl ${SOLANA_RPC_URL} -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"simulateTransaction","params":["<base64-tx>",{"replaceRecentBlockhash":true}]}'
```
