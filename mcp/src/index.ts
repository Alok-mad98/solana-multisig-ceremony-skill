import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { auditMultisig, checkDurableNonce, decodeProposal } from "./solana-tools.js";
import { auditBuildIntegrity } from "./build-integrity.js";

export interface Env {
  SOLANA_RPC_URL?: string;
  HELIUS_API_KEY?: string;
}

function createServer(env: Env) {
  const server = new McpServer({
    name: "Solana Multisig Ceremony & Build Integrity MCP",
    version: "1.0.0",
  });

  server.tool(
    "audit_multisig",
    "Score a live Squads v4 Solana multisig against a SEAL-style policy",
    { address: z.string().describe("The Solana address of the multisig to audit") },
    async ({ address }) => {
      const result = await auditMultisig(address, env);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "decode_proposal",
    "Decode a Solana transaction proposal and flag risky patterns",
    { transactionBase64: z.string().describe("The base64-encoded Solana transaction") },
    async ({ transactionBase64 }) => {
      const result = await decodeProposal(transactionBase64);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "check_durable_nonce",
    "Check whether a Solana transaction uses a durable nonce",
    { transactionBase64: z.string().describe("The base64-encoded Solana transaction") },
    async ({ transactionBase64 }) => {
      const result = await checkDurableNonce(transactionBase64);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "audit_build_integrity",
    "Audit a public GitHub repo for supply-chain / build-integrity hygiene",
    { repo: z.string().describe("GitHub repo as owner/repo or full https://github.com/owner/repo URL") },
    async ({ repo }) => {
      const result = await auditBuildIntegrity(repo);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "multisig_policy_advice",
    "Get SEAL-style multisig policy advice for a given asset class",
    {
      assetValueUsd: z.number().describe("Estimated USD value under multisig control"),
      isProgramAuthority: z.boolean().optional().describe("Whether the multisig controls a program upgrade authority"),
    },
    async ({ assetValueUsd, isProgramAuthority }) => {
      let signers = 3;
      let threshold = 2;
      let timelockHours = 24;
      if (assetValueUsd >= 10_000_000 || isProgramAuthority) {
        signers = 9;
        threshold = 5;
        timelockHours = 168;
      } else if (assetValueUsd >= 1_000_000) {
        signers = 7;
        threshold = 4;
        timelockHours = 72;
      } else if (assetValueUsd >= 100_000) {
        signers = 5;
        threshold = 3;
        timelockHours = 48;
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            assetValueUsd,
            recommendedSigners: signers,
            recommendedThreshold: `${threshold}-of-${signers}`,
            recommendedTimelockHours: timelockHours,
            note: "Timelocks can be bypassed only by a separate veto quorum requiring threshold + 2 additional signers.",
          }, null, 2),
        }],
      };
    }
  );

  return server;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const server = createServer(env);
    return createMcpHandler(server)(request, env, ctx);
  },
};
