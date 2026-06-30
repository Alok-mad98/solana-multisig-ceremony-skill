# Solana Multisig Ceremony MCP Server

A remote MCP server you can deploy to Cloudflare Workers. It exposes the skill's tools over Streamable HTTP so any MCP-compatible agent can audit Solana multisigs, decode proposals, detect durable nonces, and check build integrity.

## Deploy in one minute

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Alok-mad98/solana-multisig-ceremony-skill/tree/main/mcp)

Or with Wrangler:

```bash
cd mcp
npm install
```

Set your RPC / Helius secret:

```bash
npx wrangler secret put HELIUS_API_KEY
```

Deploy:

```bash
npm run deploy
```

Your server will be live at `https://solana-multisig-ceremony-mcp.<account>.workers.dev/mcp`.

The public instance is already running at:

```
https://solana-multisig-ceremony-mcp.arechampionw.workers.dev/mcp
```

## Connect from Claude Desktop (or any local MCP client)

Use `mcp-remote` to bridge remote HTTP to local stdio:

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

## Tools exposed

- `audit_multisig` — score a live Squads v4 multisig.
- `decode_proposal` — decode a base64 transaction and flag red flags.
- `check_durable_nonce` — detect durable-nonce transactions.
- `audit_build_integrity` — audit a public GitHub repo's lockfiles and CI setup.
- `multisig_policy_advice` — get SEAL-style policy recommendations.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
# edit .dev.vars
npm run dev
```

Then open the MCP inspector:

```bash
npx @modelcontextprotocol/inspector@latest
```

Connect to `http://localhost:8788/mcp`.
