# Superteam Brasil — Solana AI Kit Skill Bounty Submission

Use this file to copy paste answers into the Superteam submission form.
Bounty URL: https://superteam.fun/earn/listing/skills

Link to Your Submission
Main skill repo: https://github.com/Alok-mad98/solana-multisig-ceremony-skill
Bounty PR: https://github.com/solanabr/skill-bounty/pull/118

Tweet Link
(optional — paste the link to your X post after publishing)

Did you contribute towards existing repos or is it a new idea?
This is a NEW skill built from scratch for this bounty. The repository is MIT licensed, original content, and uses only .env for credentials. It is submitted as direct files under the skill directory via PR #118 (same flat structure as PR #117).

What is your closest "competing" skill?
squads treasury skill (bounty PR #70) is the closest. It operates and guards Squads v4 multisig treasuries with a config auditor and transaction decoder.

solana tx guard (bounty PR #117 / #28) is also adjacent. It adds pre sign safety guardrails for AI agent wallets.

Neither of these, nor any of the 114 open submissions, covers the full signing ceremony lifecycle (signer onboarding, out of band verification, hardware and air gap workflows, durable nonce detection, key rotation playbooks) or build integrity / supply chain hardening.

Post any links/proofs that show why you should be the creator of this skill? (Founder market fit)
1. Timely, validated problem: the April 2026 Drift Protocol exploit ($285M) was caused by blind signing and a weak multisig configuration, not a smart contract bug. Chainalysis, Cyfrin, and the SEAL framework all identify transaction legibility and signing ceremony hygiene as the missing defense.
2. Primary source research: the skill is grounded in Chainalysis Drift post-mortem, Cyfrin transaction legibility analysis, SEAL Secure Multisig Best Practices, and Anza web3.js supply chain RCA.
3. Competitive gap: I mapped every open PR in the submissions repo and confirmed that no submission addresses signing ceremonies, key onboarding, durable nonce review, or reproducible build CI gates.
4. Runnable, not theoretical: ships TypeScript tools, shell scripts, and GitHub Actions templates.
5. Cloudflare MCP deployment: the mcp directory is a deployable Cloudflare Workers remote MCP server, so any MCP compatible agent (Claude, Cursor, Windsurf, custom agents) can use the tools via a URL without local installation.
6. Kit native shape: follows the solana game skill structure with SKILL.md router, skill markdown files, agents, commands, rules, install scripts, .env.example, and MIT license.

Anything Else?
1. All tools are read first; no private keys or seed phrases are ever requested.
2. Credentials are read only from .env. Nothing is hard coded.
3. The skill also covers build integrity (npm provenance, reproducible builds, CI policy gates, SBOM) because the @solana/web3.js supply chain attack showed that bad builds compromise keys before they reach a wallet.
4. MCP server deploys to Cloudflare Workers with one npm run deploy and exposes tools like audit_multisig, decode_proposal, and check_durable_nonce to any MCP client.
5. A public live MCP endpoint is already hosted at https://solana-multisig-ceremony-mcp.arechampionw.workers.dev/mcp. Users can add it to Claude Desktop with mcp-remote and no local build.
6. Local research artifacts are in the same workspace: FINAL_SKILL_BOUNTY_RESEARCH_JUN2026.md, pr_list.json, pr_categories_v2.csv.

Quick links to share
Skill repo: https://github.com/Alok-mad98/solana-multisig-ceremony-skill
Bounty PR: https://github.com/solanabr/skill-bounty/pull/118
Final research summary: https://github.com/Alok-mad98/solana-multisig-ceremony-skill/blob/main/skill/resources.md
