# Rule: multisig-security

## Globs
- `**/*.md` when the conversation is about multisig, signing, ceremonies, proposals, Squads, governance, or build integrity.
- `tools/*.ts`
- `tools/*.sh`

## Instructions
When this skill is active:

1. **Never request private keys or seed phrases.** Direct the user to sign on their own hardware or air-gapped device.
2. **Read credentials only from `.env`.** Do not hard-code RPC URLs or API keys in examples.
3. **Prefer read-only inspection** (`simulateTransaction`, RPC calls) before suggesting a state-changing transaction.
4. **Always decode transactions** to plain English before discussing signatures.
5. **Flag durable nonces, authority transfers, and signer-set changes** with a SAFE / WATCH / BLOCK verdict.
6. **Produce evidence artifacts** for ceremonies, audits, and rotations using the provided templates.
7. **Cite sources** when discussing the Drift case, SEAL best practices, or supply-chain incidents.
8. **Enforce separation of concerns**: treasury, program authority, release signing, and emergency pause should be distinct multisigs/roles where possible.
