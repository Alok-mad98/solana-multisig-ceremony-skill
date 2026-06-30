# Resources & References

## Primary Sources
- [Superteam Brasil Skill Bounty](https://superteam.fun/earn/listing/skills)
- [Chainalysis — Drift Protocol Hack: How Privileged Access Led to a $285M Loss](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/)
- [Cyfrin — Drift Protocol's $285M Hack: Why Transaction Legibility Is the Fix](https://www.cyfrin.io/blog/drift-hack-learnings)
- [Anza — web3.js Exploit Root Cause Analysis](https://www.anza.xyz/blog/web3-js-exploit-root-cause-analysis)
- [SEAL — Secure Multisig Best Practices](https://frameworks.securityalliance.org/wallet-security/secure-multisig-best-practices)

## Solana & Squads Documentation
- [Squads v4 Docs](https://docs.squads.so/)
- [SPL Governance / Realms Docs](https://docs.realms.today/)
- [Solana Verified Builds](https://github.com/solana-developers/verified-build)
- [Solana Program Library (GitHub)](https://github.com/solana-labs/solana-program-library)

## Tooling
- `@sqds/multisig` — TypeScript SDK for Squads v4
- `@solana/web3.js` and `@solana/kit` — Solana clients
- `agents` / `@cloudflare/agents` — Cloudflare Agents SDK for MCP deployment
- `cargo-auditable` — embed dependency info in Rust binaries
- `syft` — SBOM generation
- `cosign` / Sigstore — artifact signing
- `socket.dev` — JavaScript supply-chain risk scanning

## MCP Deployment
- [Build a Remote MCP server on Cloudflare](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)
- [Remote MCP transport docs](https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/)
- This skill's MCP server: [`mcp/README.md`](../mcp/README.md)

## Related Bounty Submissions
- `#70 squads-treasury-skill` — Squads operating & config audit (closest competitor)
- `#117 solana-tx-guard` — pre-sign transaction safety for AI agents
- `#91 Upgrade Safety Skill` — Anchor account-layout drift detection
- `#105 solana-secops-skill` — Day-2 SecOps and incident response

## Acknowledgements
This skill builds on the public research of Chainalysis, Cyfrin, Anza, SEAL, and the Drift Protocol team.
