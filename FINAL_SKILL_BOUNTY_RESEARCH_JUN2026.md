# Final Research Summary — Solana AI Kit Skill Bounty
**Prepared:** June 30, 2026  
**Bounty:** [Superteam Brasil — Ship useful agent skills we can add to Solana AI Kit](https://superteam.fun/earn/listing/skills)  
**Prize pool:** 3,000 USDG (10 winners: 5×400 + 5×200 USDG)  
**Winners announced:** July 08, 2026  
**Submissions:** 279 on the Superteam listing; **117 searchable items / 114 open PRs** in the GitHub submission repo `solanabr/skill-bounty`.

---

## 1. What We Researched
This document merges all earlier work with a fresh, deep competitive analysis.

| Source / Method | Details |
|-----------------|---------|
| Prior synthesis | `FULL_RESEARCH_SUMMARY.md`, `solana_skill_decision_synthesis.md`, `solana_security_research_jun2026.md`, `solana_ai_skill_market_research_jun2026.md` |
| Kit reference repo | `solanabr/solana-game-skill` (structure, progressive disclosure, install scripts) |
| Bounty listing page | Fetched via TinyFish fetch from `https://superteam.fun/earn/listing/skills` |
| GitHub submission repo | `solanabr/skill-bounty` — pulled all 114 open PRs via GitHub API |
| X / Twitter live data | ScrapeBadger API (`scrape_badger_api_key` from `.env`) — 8 raw JSON dumps (`x_*.json`) |
| Drift post-mortem | Chainalysis *"Drift Protocol Hack: How Privileged Access Led to a $285M Loss"* (Apr 2026) |
| Transaction-legibility analysis | Cyfrin *"Drift Protocol's $285M Hack: Why Transaction Legibility Is the Fix"* (Patrick Collins, Apr 2026) |
| Supply-chain breach RCA | Anza *"web3.js Exploit: Root Cause Analysis"* (Dec 2024) |
| Multisig best practices | SEAL Framework *"Secure Multisig Best Practices"* (May 2026) |
| Market data | altFINS 2026 DeFi loss statistics; Helius Solana hack history; Cantina/Solana Foundation upgrade guides |

---

## 2. Why the Bounty Is Hard to Win
- **279 submissions** are competing for only **10 prizes** (~3.6 % win rate).
- The largest cluster of submissions is **security / audit / operations**, because the Drift hack made the problem obvious.
- A generic "upgrade safety" or "tx guard" skill now has **direct, high-quality competition**.
- To win, the submission must be **more specific, more runnable, and more cross-domain** than the median security skill.

---

## 3. The Open Wound: Drift and the Human Layer
The April 1, 2026 Drift Protocol exploit is the canonical case for the skill.

### What happened (Chainalysis)
- **$285M drained** (>50 % of TVL) in the second-largest Solana hack ever.
- Attackers spent **~6 months** posing as a quant-trading firm, meeting Drift contributors in person at conferences.
- They exploited **Solana durable nonces** to get Security Council members to *pre-sign* transactions that later transferred admin control.
- They created a fake CVT token, wash-traded it to ~$1, controlled an oracle, then used it as unlimited collateral.

### Why existing tools failed
- The multisig was **2-of-5 with zero timelock** (migrated to that config on March 26, 2026).
- All signers reportedly used **cold/hardware wallets** — but the devices displayed raw hex, so signers could not verify intent.
- The transactions were **technically valid**; no static code audit or multisig would have blocked them.

### The systemic lesson (Cyfrin / Patrick Collins)
> "Hardware wallets were used, but the signers could not verify what they were actually signing. Transaction data on hardware wallets — especially for complex Solana instructions — is rendered as raw hex. Verifying thousands of characters against expected values is impractical. This is the blind signing problem that exists across every chain."

Cyfrin's proposed fix is **transaction legibility** standards (ERC-8213 digest display, ERC-7730 human-readable signing, plus a Solana SIMD). Until those standards ship, teams need an operational skill that enforces signing hygiene *today*.

### SEAL's checklist for high-assurance multisigs
- Minimum 3 signers; 50 % threshold; 7+ signers for $1M+ assets.
- **All signers must use hardware wallets** from different manufacturers.
- **Mandatory timelock** between approval and execution.
- **Veto quorum** separate from confirmation quorum.
- **Out-of-band verification** for admin changes (video call + signed message).
- Dedicated, air-gapped signing devices; signer keys not reused elsewhere.
- Training and drills for emergency operations.

**None of these practices are encoded as a runnable Claude Code skill today.**

---

## 4. Existing Skill Ecosystem (Condensed)
| Skill/Repo | Domain | Strengths | What It Misses |
|---|---|---|---|
| `solana-dev-skill` | Core Solana dev | Frameworks, Anchor, Pinocchio, testing, security checklists | Operational signing / upgrade ceremony |
| `sendaifun/skills` | DeFi integrations | Jupiter, Kamino, Raydium, Drift, Pyth, Squads usage | Upgrade ops, key ceremony |
| `trailofbits/skills`, `safe-solana-builder`, `QEDGen/solana-skills` | Code security / formal verification | Static rules, fuzzing, FV | Human-layer: blind signing, durable nonces, ceremonies |
| `solana-ai-kit` `/audit-solana`, `/audit-infra` | Aggregated audits | Code + infra review | Pre-sign intent review, Security Council workflow |
| **No skill** | **Multisig signing ceremony & intent review** | — | This is the gap |

---

## 5. Competitive Mapping of 114 GitHub Submissions
We downloaded every open PR from `solanabr/skill-bounty` and assigned a single dominant category based on title + body.

| Category | Count | Share |
|---|---:|---:|
| Security / Audit / Ops | 22 | 19 % |
| Agent / Tx Signing Safety | 13 | 11 % |
| Token / Tokenomics / RWA / Stablecoin | 11 | 10 % |
| Infra / Observability / Indexer / RPC / Tx Reliability | 9 | 8 % |
| Founder / GTM / Legal | 8 | 7 % |
| DeFi / Trading / AMM / LP / MEV | 7 | 6 % |
| Actions / Blinks / Payments | 7 | 6 % |
| Core Dev / Debug | 6 | 5 % |
| Multisig / Treasury / Governance | 4 | 4 % |
| Upgrade / Migration | 4 | 4 % |
| Analytics / Data | 1 | <1 % |
| NFT / Gaming | 1 | <1 % |
| DePIN | 1 | <1 % |
| Other / Unclear | 20 | 18 % |
| **Total** | **114** | **100 %** |

### Security is the largest category — and the most crowded
A full **35 submissions (31 %)** fall into security, tx-guard, incident-response, or agent-safety. If the skill is just another generic security skill, it will compete with 30+ others.

**Direct, high-quality competitors in our target space:**

| PR | Skill | What it covers | Why it does **not** cover our angle |
|---:|---|---|---|
| #14 | `solana-migration-skill` | Program upgrade + state migration, IDL diff, Squads deployment | Does not address signer onboarding, hardware ceremonies, or durable-nonce intent review |
| #52 | `program-upgrade-guardian-skill` | 8-phase upgrade pipeline, risk scoring, migration blueprints, 3 personas | Heavy on upgrade mechanics; light on **human signing workflow** and out-of-band verification |
| #67 | `solana-program-upgrade-skill` | Account versioning, realloc, fork simulation, Squads authority hygiene | Again upgrade-centric; no signing-ceremony module |
| #91 | `Upgrade Safety Skill` | Anchor account-layout drift detection (SAFE / MIGRATE / COORDINATE / REFUSE) | Pure code-side layout check; does not touch multisig or signer behavior |
| #70 | `squads-treasury-skill` | Operate & guard Squads v4 multisig treasuries; config auditor; transaction legibility decoder | **Closest competitor.** Covers policy audits and decoding. Does **not** cover key ceremonies, signer onboarding, hardware/airgap workflows, durable-nonce stale-tx detection, or timelock/veto design |
| #4 | `sign-safe` | Offline signing-time transaction safety gate | Focuses on a single transaction at signing time, not the full multisig operational lifecycle |
| #28 / #117 | `solana-tx-guard` | Pre-sign safety guardrails for AI agents (static + simulate + policy) | For autonomous agent wallets, not protocol Security Council / treasury multisig ceremonies |
| #51 / #98 | `solana-incident-response-skill` | Incident lifecycle, containment, communications | Reactive; does not prevent the compromise via ceremony hygiene |
| #105 | `solana-secops-skill` | Day-2 SecOps, webhook defense, incident commander | Broad SecOps; not a focused signing-ceremony skill |
| #34 / #68 / #85 / #92 | `solana-auditor-skill` variants | Static/delta auditing methodologies | Code-audit skills, not operational multisig processes |

**No PR title or body mentions:** `ceremony`, `key management`, `hardware`, `air-gap`, `durable nonce`, `timelock`, `threshold policy`, `signer onboarding`, `out-of-band verification`, `build integrity`, `reproducible builds`, or `supply chain`.

---

## 6. The Highest-Value Unsolved Problem
**Operational multisig security: turning the SEAL/Cyfrin/Drift lessons into a repeatable, auditable signing ceremony.**

Builders know upgrades and multisigs are dangerous, but the available help is either:
- **Code-centric** (audits, static analyzers, layout drift detectors), or
- **Single-transaction** (tx-guard, sign-safe, simulators).

What teams actually need is an end-to-end workflow for:
1. Designing a multisig that matches the asset value & risk model.
2. Onboarding signers and verifying their keys out-of-band.
3. Running a signing ceremony on dedicated / air-gapped / hardware devices.
4. Reviewing every proposal in plain English *and* detecting durable-nonce / stale / malicious intent before signing.
5. Rotating keys after a suspected compromise without losing access.
6. Keeping an immutable evidence trail for post-mortems and auditors.

That is exactly what `solana-multisig-ceremony-skill` would do.

---

## 7. Recommended Skill: `solana-multisig-ceremony-skill`

### One-line pitch
A Claude Code skill that turns Solana multisig design, signer onboarding, signing ceremonies, and key rotation into a repeatable, audit-proof security workflow.

### Why this stands out
- **Validated by the largest 2026 Solana exploit** (Drift $285M).
- **Endorsed by industry frameworks** (SEAL, Cyfrin, Chainalysis).
- **No direct competitor** in the 114 submission repo.
- **Cross-domain**: governance + security + operations + law/audit evidence.
- **Runnable**: includes checklists, scripts, report templates, and a CLI auditor.

### Target users
- Protocol founders & CTOs
- Security Council / treasury signers
- DAO governance leads
- Auditors reviewing operational controls
- Custodians and operators of Squads v4 / SPL Governance multisigs

### Proposed repository structure
```
solana-multisig-ceremony-skill/
├── README.md
├── LICENSE
├── SKILL.md                      # entry router, triggers, command/agent index
├── .env.example
├── install.sh
├── install-custom.sh
├── skill/
│   ├── SKILL.md
│   ├── design-policy.md          # threshold, timelock, veto, RBAC, asset-class rules
│   ├── signer-onboarding.md      # key generation, hardware setup, identity verification
│   ├── ceremony-workflow.md      # air-gapped signing, device separation, communication protocol
│   ├── intent-review.md          # decode proposals, durable-nonce/stale-tx detection, risk flags
│   ├── squads-governance.md      # Squads v4 + SPL Governance Specifics
│   ├── key-rotation.md           # compromise response, recovery, evidence trail
│   ├── evidence-audit.md         # exportable report, attestation messages
│   └── resources.md              # SEAL, Cyfrin, Chainalysis, Anza links
├── agents/
│   └── multisig-custodian.md     # expert persona for ceremonies
├── commands/
│   ├── audit-multisig.md
│   ├── review-proposal.md
│   ├── run-key-ceremony.md
│   └── rotate-signer.md
├── rules/
│   └── multisig-security.md      # path-scoped rules for touching Squads/governance config
└── tools/
    ├── audit-multisig.ts         # live Squads config auditor
    ├── decode-proposal.ts        # human-readable proposal decoder
    ├── check-durable-nonce.ts    # flag durable-nonce / stale transactions
    ├── key-ceremony-checklist.sh # interactive ceremony compliance script
    └── evidence-report.md.tpl    # export template
```

### Credentials from `.env`
```bash
SOLANA_RPC_URL=                 # default: https://api.mainnet-beta.solana.com
HELIUS_API_KEY=                 # optional enhanced RPC / DAS API
SQUADS_MULTISIG_ADDRESS=        # optional default multisig to audit
ANCHOR_PROVIDER_WALLET=         # optional read-only wallet path
```

### Commands & agents
- **Agent `multisig-custodian`** — coaches teams through design, onboarding, ceremonies, and rotation.
- **`/audit-multisig`** — scores a live Squads/SPL Governance multisig against SEAL-style policy.
- **`/review-proposal <tx-or-proposal-id>`** — decodes a pending proposal into plain English, flags durable nonces, authority transfers, new collateral, spending spikes, and unknown programs.
- **`/run-key-ceremony`** — walks signers through a step-by-step ceremony checklist with evidence capture.
- **`/rotate-signer`** — safe key-rotation playbook with out-of-band verification and attestation signatures.

### Key novelties vs. competitors
| Capability | Competitors with partial overlap | Our skill |
|---|---|---|
| Multisig config audit | #70 squads-treasury | ✓ plus SEAL-derived policy scoring |
| Decode transaction intent | #70, #117, #4 | ✓ plus durable-nonce / stale-tx detection and natural-language risk narrative |
| Signing ceremony workflow | **none** | ✓ dedicated air-gapped/hardware ceremony module |
| Signer onboarding / identity verification | **none** | ✓ out-of-band verification, address-attestation messages |
| Key rotation / compromise recovery | **none** | ✓ full playbook with evidence trail |
| Evidence report / audit trail | **none** | ✓ exportable markdown report template |
| Timelock / veto / RBAC design | **none** | ✓ policy-design module tied to asset value |

---

## 8. How It Scores on Judging Criteria

| Criterion | Score | Why |
|---|---:|---|
| **Usefulness** | 10/10 | Solves the exact operational gap behind 2026's biggest Solana exploit; SEAL framework validates the need. |
| **Novelty** | 9/10 | No existing kit skill and no bounty submission focuses on the full signing-ceremony lifecycle. |
| **Quality** | 9/10 | Built on 2026 primary sources (Chainalysis, Cyfrin, SEAL, Anza, Drift disclosures) with runnable audit tools and templates. |
| **Fit** | 10/10 | Mirrors `solana-game-skill` exactly: progressive `SKILL.md`, `agents/`, `commands/`, `rules/`, install scripts, MIT license, `.env`. |

---

## 9. Alternative Fallback (if you want less risk)
` solana-build-integrity-skill` — supply-chain / reproducible-build / CI-policy skill.

- Also uncovered in research: Anza web3.js supply-chain attack (Dec 2024) stole private keys via malicious npm versions; no submission addresses this.
- Would cover: reproducible builds, dependency pinning, npm provenance, CI policy gates, GitHub Actions templates, SBOM checks.
- **Why not the top pick:** It is slightly narrower and less tied to the multisig/security emphasis you asked for.

---

## 10. Immediate Next Steps
1. **Confirm the skill name/scope** — `solana-multisig-ceremony-skill` (recommended).
2. I will then build:
   - `SKILL.md` entry point with progressive routing
   - All `skill/*.md` reference files
   - `agents/multisig-custodian.md`
   - `commands/*.md`
   - `rules/multisig-security.md`
   - `tools/` TypeScript + shell scripts
   - `install.sh`, `install-custom.sh`, `.env.example`
   - `README.md`, `LICENSE`
   - GitHub-ready PR summary
3. After the repo is built, we can register it as a kit submodule and submit the PR.

---

## 11. Key Sources & Links
- Bounty listing: https://superteam.fun/earn/listing/skills
- Submission repo: https://github.com/solanabr/skill-bounty
- Reference skill shape: https://github.com/solanabr/solana-game-skill
- Chainalysis Drift analysis: https://www.chainalysis.com/blog/lessons-from-the-drift-hack/
- Cyfrin transaction legibility: https://www.cyfrin.io/blog/drift-hack-learnings
- Anza web3.js RCA: https://www.anza.xyz/blog/web3-js-exploit-root-cause-analysis
- SEAL secure multisig best practices: https://frameworks.securityalliance.org/wallet-security/secure-multisig-best-practices
- Earlier research files in this workspace:
  - `FULL_RESEARCH_SUMMARY.md`
  - `solana_skill_decision_synthesis.md`
  - `solana_security_research_jun2026.md`
  - `solana_ai_skill_market_research_jun2026.md`
  - `pr_list.json`, `pr_categories_v2.csv`, `pr_details_top.json`

---

## 12. Bottom Line
The Drift hack proved that **the next frontier of Solana security is not more static audits — it is the human + operational layer around multisig signing**. The bounty repo has 22+ security submissions, but **none** treat the full signing ceremony as a first-class skill. Building `solana-multisig-ceremony-skill` is the highest-impact, most differentiated path to a top-10 finish.
