# Tools — Solana Multisig Ceremony & Build Integrity Skill

Runnable scripts that back the skill's commands.

## Install

```bash
cp ../.env.example ./.env   # or keep .env at repo root
npm install
```

All scripts read credentials from `.env`.

## Available scripts

### Audit a live Squads v4 multisig
```bash
npx tsx audit-multisig.ts <MULTISIG_ADDRESS>
```

### Decode a proposal transaction
```bash
npx tsx decode-proposal.ts <base64-transaction>
```

### Check for durable nonces
```bash
npx tsx check-durable-nonce.ts <base64-transaction>
```

### Run build-integrity checks
```bash
bash audit-build-integrity.sh <optional-project-path>
```

## Notes
- These tools are intentionally read-only. They do not sign or send transactions.
- Use them inside a ceremony or CI gate; never give them hot signer keys.
