# Command: /audit-multisig

## Purpose
Score a live Solana multisig (Squads v4 or SPL Governance) against a SEAL-derived policy and report gaps.

## When to use
- A protocol wants a baseline security assessment of its multisig.
- Before a major launch or TVL increase.
- After adding or removing signers.

## Steps
1. Read `SQUADS_MULTISIG_ADDRESS` from `.env` or prompt the user for the address.
2. Run `tools/audit-multisig.ts <address>`.
3. Map the live config against the policy matrix in `skill/design-policy.md`.
4. Produce a risk score and a prioritized remediation list.

## Output format
```markdown
## Multisig Audit: <address>
- Members: N
- Threshold: M-of-N
- Time lock: T hours
- Spending limits: <summary>

### Policy score: <score>/100
### Gaps
1. ...

### Recommended actions
1. ...
```

## Example prompt
```
/audit-multisig
```
