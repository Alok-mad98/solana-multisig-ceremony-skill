# Solana Multisig Ceremony & Build Integrity Skill

A Claude Code / OpenCode skill for Solana protocol teams that treats **multisig signing ceremonies** and **build-pipeline integrity** as the two halves of real-world protocol security.

> Built for the [Superteam Brasil Solana AI Kit skill bounty](https://superteam.fun/earn/listing/skills).

---

## Why This Skill Exists

The April 2026 Drift Protocol exploit drained **$285M** — not because of a bug, but because a 2-of-5 Security Council with **zero timelock** was socially engineered into **blind-signing** durable-nonce transactions. Existing audit skills check code; existing tx-guard skills check one transaction. None guide a team through the full operational lifecycle of a high-assurance multisig.

At the same time, the December 2024 `@solana/web3.js` npm compromise showed that malicious build artifacts can steal private keys before they ever reach a wallet.

This skill closes both gaps.

---

## What It Covers

### 1. Multisig Signing Ceremony Lifecycle
- Risk-based policy design (thresholds, timelocks, veto, RBAC)
- Signer onboarding with hardware-wallet and air-gap workflows
- Out-of-band identity verification and address attestation
- Proposal intent review — decode, summarize, and flag dangerous patterns
- Durable-nonce / stale-transaction detection
- Key rotation and compromise-recovery playbooks
- Evidence reports for auditors and investigators

### 2. Build & Supply-Chain Integrity
- Reproducible build verification
- npm provenance and lockfile hygiene
- CI policy gates (GitHub Actions templates)
- Dependency-risk triage
- SBOM checks

### 3. Tooling
All tools read credentials from `.env`:

- `tools/audit-multisig.ts` — score a live Squads/SPL Governance multisig
- `tools/decode-proposal.ts` — human-readable proposal decoder
- `tools/check-durable-nonce.ts` — flag durable-nonce transactions
- `tools/audit-build-integrity.sh` — CI-style build-integrity checks
- `tools/evidence-report.md.tpl` — exportable audit report
- `tools/ci-policy-template.yml` — starter GitHub Actions policy gate

---

## MCP Server (Cloudflare Workers)

You can also expose the skill's core tools as a **remote MCP server** on Cloudflare Workers, so any MCP-compatible agent (Claude, Cursor, Windsurf, your own agent) can call them without installing the skill locally.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Alok-mad98/solana-multisig-ceremony-skill/tree/main/mcp)

See [`mcp/README.md`](mcp/README.md) for deployment, secrets setup, and connection instructions.

---

## Installation

### Standard install
```bash
git clone https://github.com/Alok-mad98/solana-multisig-ceremony-skill
cd solana-multisig-ceremony-skill
./install.sh
```

### Custom install
```bash
./install-custom.sh
```

Both installers place the skill in `~/.claude/skills/` (or a project-local `.claude/skills/`).

---

## Quick Start

1. Copy `.env.example` to `.env` and fill in your RPC / Helius key.
2. Run a multisig audit:
   ```bash
   cd tools
   npm install
   npx tsx audit-multisig.ts <MULTISIG_ADDRESS>
   ```
3. Ask Claude:
   ```
   /audit-multisig
   /review-proposal <proposal-index>
   /run-key-ceremony
   /audit-build-integrity
   ```

---

## Repository Structure

```
solana-multisig-ceremony-skill/
├── README.md
├── LICENSE
├── SKILL.md                    # top-level skill manifest
├── CLAUDE.md
├── .env.example
├── install.sh
├── install-custom.sh
│
├── skill/                      # routed skill files
│   ├── SKILL.md
│   ├── design-policy.md
│   ├── signer-onboarding.md
│   ├── ceremony-workflow.md
│   ├── intent-review.md
│   ├── squads-governance.md
│   ├── key-rotation.md
│   ├── build-integrity.md
│   ├── evidence-audit.md
│   └── resources.md
│
├── agents/
│   └── multisig-custodian.md
│
├── commands/
│   ├── audit-multisig.md
│   ├── review-proposal.md
│   ├── run-key-ceremony.md
│   ├── rotate-signer.md
│   └── audit-build-integrity.md
│
├── rules/
│   └── multisig-security.md
│
├── tools/
│   ├── package.json
│   ├── tsconfig.json
│   ├── audit-multisig.ts
│   ├── decode-proposal.ts
│   ├── check-durable-nonce.ts
│   ├── audit-build-integrity.sh
│   ├── ci-policy-template.yml
│   ├── evidence-report.md.tpl
│   └── README.md
│
└── mcp/                          # remote MCP server for Cloudflare Workers
    ├── package.json
    ├── wrangler.jsonc
    ├── tsconfig.json
    ├── src/index.ts
    ├── README.md
    └── .dev.vars.example
```

---

## Core Principles

1. **Trust is built in two places:** the keys/ceremonies that sign transactions **and** the build pipeline that produces the bytes being signed.
2. **Intent review beats identity checks alone.** A valid signature is not enough; the signer must understand what the transaction does.
3. **Default to read-only.** Tools never ask for private keys. State-changing actions require explicit confirmation.
4. **Evidence is a deliverable.** Every ceremony and audit produces an exportable report.

---

## Credentialed by `.env`

```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
HELIUS_API_KEY=                  # optional, for enhanced RPC
SQUADS_MULTISIG_ADDRESS=         # optional default multisig
ANCHOR_PROVIDER_WALLET=          # optional read-only wallet path
```

---

## Related Work

- `solana-dev-skill` — core Solana development
- `squads-treasury-skill` (bounty PR #70) — Squads operations and config audit
- `solana-tx-guard` (bounty PR #117) — agent pre-sign safety
- `solana-upgrade-guard-skill` concept — predecessor research in this repo

## License

MIT — see [LICENSE](LICENSE).
