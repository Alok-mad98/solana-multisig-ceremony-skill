# Solana Multisig Ceremony & Build Integrity Skill

A Claude Code / OpenCode skill that turns Solana protocol security into a **repeatable, human-readable workflow**.

It covers the two places where real-world trust is actually built:
1. **The people and ceremonies that sign transactions** (multisig design, signer onboarding, proposal review, key rotation).
2. **The build pipeline that produces the bytes those signers approve** (reproducible builds, npm provenance, CI gates).

> Built for the [Superteam Brasil Solana AI Kit skill bounty](https://superteam.fun/earn/listing/skills).

---

## Table of Contents
1. [The problem](#the-problem)
2. [What this skill does](#what-this-skill-does)
3. [Who it is for](#who-it-is-for)
4. [Skill modules explained](#skill-modules-explained)
5. [Commands](#commands)
6. [Live MCP server](#live-mcp-server-cloudflare-workers)
7. [Installation](#installation)
8. [Quick start](#quick-start)
9. [Repository structure](#repository-structure)
10. [Core principles](#core-principles)
11. [License](#license)

---

## The Problem

### Drift Protocol: $285M lost to blind signing
In April 2026, Drift Protocol lost **$285 million** — over 50% of its TVL. The exploit was not a smart-contract bug. Attackers spent six months posing as a quant-trading firm, befriended contributors in person, and eventually tricked Security Council members into **pre-signing durable-nonce transactions** they did not understand.

The multisig was configured as **2-of-5 with zero timelock**. Once the pre-signed transactions triggered, the attackers had full admin control within seconds. Hardware wallets were used, but the screens showed raw hex, so signers could not verify what they were actually approving.

### `@solana/web3.js` npm compromise: supply-chain backdoor
In December 2024, attackers phished npm publish access and shipped malicious versions of `@solana/web3.js`. The compromised code stole private keys when `Keypair.fromSecretKey()` was called. Any CI pipeline or developer machine that pulled the bad version could leak keys *before* a signer ever touched a wallet.

### The gap
Most existing security skills do one of two things:
- **Audit code once** (static analysis, formal verification).
- **Guard one transaction** (pre-sign simulators, tx-guard tools).

None guide a team through the **full operational lifecycle** of a high-assurance multisig, and none address the **supply chain** that builds the programs being signed.

---

## What This Skill Does

This skill gives AI agents (and the humans using them) a complete, opinionated playbook for running secure Solana multisigs and trustworthy builds.

### For multisigs
- **Design a safe policy** matching your asset value and role.
- **Onboard signers** with hardware wallets, address attestations, and out-of-band verification.
- **Run signing ceremonies** where every proposal is decoded into plain English before anyone signs.
- **Detect durable nonces**, authority transfers, and suspicious collateral before approval.
- **Rotate keys safely** after a compromise or team change.
- **Produce evidence reports** for auditors, investors, and regulators.

### For builds
- Pin dependencies with lockfile checks.
- Verify npm provenance.
- Add CI policy gates that block high-risk dependency changes.
- Compare on-chain program hashes to reproducible local builds.

### For agents (MCP)
The skill is also deployed as a **remote MCP server** on Cloudflare Workers. Claude, Cursor, Windsurf, Codex, or any MCP-compatible agent can call its tools directly from a URL — no local install needed.

---

## Who It Is For

- **Protocol founders and CTOs** who want a defensible multisig setup.
- **Security Council signers** who want to understand what they are signing.
- **DAO governance leads** managing treasury or program upgrade authority.
- **Security auditors** reviewing operational controls, not just code.
- **AI-agent builders** who want their agent to audit multisigs and proposals safely.

---

## Skill Modules Explained

Each module is a focused markdown file loaded on demand by Claude / OpenCode, so the agent only uses the context relevant to the current task.

### 1. Multisig Policy Design (`skill/design-policy.md`)
Picks thresholds, timelocks, veto quorums, and RBAC based on the value you protect.

Example: a protocol holding $5M should use at least 4-of-7 signers, a 72-hour timelock, and a separate veto group of two external advisors.

### 2. Signer Onboarding (`skill/signer-onboarding.md`)
Walks new signers through hardware-wallet setup, address attestation, and out-of-band identity verification by video call or signed message.

### 3. Signing Ceremony Workflow (`skill/ceremony-workflow.md`)
A structured checklist for high-value transactions:
- Fix all proposals before the ceremony starts.
- Decode each proposal in plain English.
- Check for durable nonces and stale transactions.
- Each signer verifies independently and states what they are signing.
- Capture an evidence trail.

### 4. Proposal Intent Review (`skill/intent-review.md`)
Decodes any Solana transaction and returns a **SAFE / WATCH / BLOCK** verdict. Flags:
- `SetAuthority` or ownership transfers
- Program upgrades outside scheduled windows
- Signer-set or threshold changes
- Durable nonces on non-routine transactions
- Unknown programs or unusual value movements

### 5. Squads v4 & SPL Governance (`skill/squads-governance.md`)
Explains how Squads v4 and Realms work, what config transactions are dangerous, and how to audit a live multisig with RPC.

### 6. Key Rotation & Compromise Recovery (`skill/key-rotation.md`)
A safe playbook for when a signer loses a device, clicks a phishing link, or leaves the team. Emphasizes evidence preservation and **never lowering the threshold** to make quorum easier.

### 7. Build Integrity (`skill/build-integrity.md`)
Covers npm provenance, reproducible Solana program builds, CI policy gates, SBOMs, and Dockerfile pinning. Ties back to the `@solana/web3.js` supply-chain lesson.

### 8. Evidence & Audit Reports (`skill/evidence-audit.md`)
Templates and storage rules so every ceremony, audit, and incident produces an immutable, auditor-ready report.

---

## Commands

These slash commands work inside Claude Code / OpenCode when the skill is installed:

| Command | What it does |
|---|---|
| `/audit-multisig` | Score a live Squads/SPL Governance multisig against SEAL-style policy. |
| `/review-proposal` | Decode a pending proposal and return SAFE / WATCH / BLOCK. |
| `/run-key-ceremony` | Walk a team through a structured signing ceremony checklist. |
| `/rotate-signer` | Execute a safe signer-rotation playbook. |
| `/audit-build-integrity` | Run supply-chain / CI-policy checks on a project. |

---

## Live MCP Server (Cloudflare Workers)

You do **not** need to install this skill locally to use its core tools.

A public MCP server is already running and can be connected to any MCP-compatible agent.

**Live MCP endpoint:**
```
https://solana-multisig-ceremony-mcp.arechampionw.workers.dev/mcp
```

### Connect from Claude Desktop

Add this to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "solana-multisig-ceremony": {
      "command": "npx",
      "args": ["mcp-remote", "https://solana-multisig-ceremony-mcp.arechampionw.workers.dev/mcp"]
    }
  }
}
```

### Connect from Cursor / Windsurf / other MCP clients

Use the same pattern: add an MCP server that runs `npx mcp-remote https://solana-multisig-ceremony-mcp.arechampionw.workers.dev/mcp`.

### Expose the same server yourself

You can also deploy your own private copy to Cloudflare in one click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Alok-mad98/solana-multisig-ceremony-skill/tree/main/mcp)

See [`mcp/README.md`](mcp/README.md) for Wrangler secrets setup.

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

Both installers place the skill in `~/.claude/skills/` or a project-local `.claude/skills/`.

---

## Quick Start

1. Copy `.env.example` to `.env` and fill in your RPC / Helius key.
2. Install tool dependencies and audit a multisig:
   ```bash
   cd tools
   npm install
   npx tsx audit-multisig.ts <SQUADS_MULTISIG_ADDRESS>
   ```
3. Ask Claude / OpenCode:
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
├── README.md                  # this file
├── LICENSE                    # MIT
├── SKILL.md                   # top-level skill manifest
├── CLAUDE.md                  # Claude / OpenCode global rules
├── .env.example               # local credentials template
├── install.sh                 # standard installer
├── install-custom.sh          # interactive installer
│
├── skill/                     # routed skill guidance
│   ├── SKILL.md               # skill entry router
│   ├── design-policy.md       # multisig policy design
│   ├── signer-onboarding.md   # signer onboarding
│   ├── ceremony-workflow.md   # signing ceremonies
│   ├── intent-review.md       # proposal decoding & risk flags
│   ├── squads-governance.md   # Squads v4 / SPL Governance
│   ├── key-rotation.md        # key rotation & recovery
│   ├── build-integrity.md     # reproducible builds & supply chain
│   ├── evidence-audit.md      # evidence reports
│   └── resources.md           # links and references
│
├── agents/
│   └── multisig-custodian.md  # expert security persona
│
├── commands/
│   ├── audit-multisig.md
│   ├── review-proposal.md
│   ├── run-key-ceremony.md
│   ├── rotate-signer.md
│   └── audit-build-integrity.md
│
├── rules/
│   └── multisig-security.md   # path-scoped security rules
│
├── tools/                     # runnable local tools
│   ├── audit-multisig.ts
│   ├── decode-proposal.ts
│   ├── check-durable-nonce.ts
│   ├── audit-build-integrity.sh
│   ├── ci-policy-template.yml
│   ├── evidence-report.md.tpl
│   └── README.md
│
└── mcp/                       # Cloudflare Workers MCP server
    ├── package.json
    ├── package-lock.json
    ├── wrangler.jsonc
    ├── tsconfig.json
    ├── src/
    │   ├── index.ts
    │   ├── solana-tools.ts
    │   └── build-integrity.ts
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
HELIUS_API_KEY=                  # optional, for enhanced RPC / DAS API
SQUADS_MULTISIG_ADDRESS=         # optional default multisig
ANCHOR_PROVIDER_WALLET=          # optional read-only wallet path
```

Never commit `.env`.

---

## Related Work

- `solana-dev-skill` — core Solana development
- `squads-treasury-skill` (bounty PR #70) — Squads operations and config audit
- `solana-tx-guard` (bounty PR #117) — agent pre-sign safety
- `solana-upgrade-guard-skill` concept — predecessor research in this repo

## License

MIT — see [LICENSE](LICENSE).
