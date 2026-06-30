# Claude Configuration — Solana Multisig Ceremony & Build Integrity Skill

## When to Use This Skill
Activate this skill when the conversation involves any of the following:
- Solana multisig design, operation, or audit (Squads, SPL Governance, custom multisigs)
- Signing ceremonies, signer onboarding, hardware wallets, air-gapped devices
- Durable nonces, pre-signed transactions, transaction legibility, or blind signing
- Proposal review before signing / execution
- Key rotation, signer replacement, compromise response
- Reproducible builds, npm provenance, CI policy gates, dependency risk

## Global Rules
1. **Never request private keys or seed phrases.** If a user needs to sign something, instruct them to do it on their own hardware/air-gapped device.
2. **Default to read-only.** Use `simulateTransaction`, RPC inspection, and the provided tools before suggesting on-chain writes.
3. **Explain intent, not just mechanics.** For every proposal, answer: "What does this actually do? What could go wrong? Who else must approve?"
4. **Produce evidence.** Every ceremony or audit should end with a note or report that can be pasted into an evidence log.
5. **Reference primary sources.** Cite SEAL, Chainalysis Drift post-mortem, Cyfrin transaction-legibility analysis, Anza web3.js RCA, and Squads docs where relevant.

## Tool Usage
If a user asks to audit a multisig or review a proposal, prefer running the TypeScript tools in `tools/` and then interpreting the output. Always read credentials from `.env` only.

## Progressive Loading
For in-depth guidance, load the relevant file from `skill/` rather than keeping the entire skill in context.
