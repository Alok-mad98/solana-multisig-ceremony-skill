# Command: /rotate-signer

## Purpose
Guide a safe signer rotation after compromise, loss, departure, or role change.

## When to use
- A signer reports a lost or compromised device.
- A signer leaves the team.
- A signer's work machine is affected by a supply-chain incident.

## Steps
1. Read `skill/key-rotation.md`.
2. Help the user collect evidence snapshots (multisig state, pending proposals, recent activity).
3. Pause non-emergency proposals.
4. Walk the affected signer through `skill/signer-onboarding.md` for a new identity.
5. Build a remove/add proposal that preserves threshold and timelock.
6. Execute through normal or veto-bypass quorum based on urgency.
7. Audit the new state and update documentation.

## Safety rules
- Do **not** lower the threshold to make quorum easier.
- Do **not** bundle unrelated instructions with the rotation.
- Require out-of-band verification of the new address.

## Example prompt
```
/rotate-signer <affected-address>
```
