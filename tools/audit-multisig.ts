import "dotenv/config";
import { Connection, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

const RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

function usage() {
  console.log("Usage: npx tsx audit-multisig.ts <SQUADS_MULTISIG_ADDRESS>");
  process.exit(1);
}

function classifyAssets(valueUsd: number) {
  if (valueUsd < 100_000) return "low";
  if (valueUsd < 1_000_000) return "medium";
  if (valueUsd < 10_000_000) return "high";
  return "critical";
}

async function main() {
  const address = process.argv[2] || process.env.SQUADS_MULTISIG_ADDRESS;
  if (!address) usage();

  const connection = new Connection(RPC, "confirmed");
  const multisigPda = new PublicKey(address);

  let config: any;
  try {
    config = await multisig.accounts.Multisig.fromAccountAddress(connection, multisigPda);
  } catch (e: any) {
    console.error("Failed to load Squads v4 multisig config:", e.message);
    console.log("Raw account info fallback:");
    const info = await connection.getAccountInfo(multisigPda);
    console.log(info);
    process.exit(1);
  }

  const members = config.members as { key: PublicKey; permissions: any }[];
  const threshold = Number(config.threshold);
  const n = members.length;
  const timeLock = Number(config.timeLock || 0);

  console.log(`Multisig:        ${multisigPda.toBase58()}`);
  console.log(`Members (N):     ${n}`);
  console.log(`Threshold (M):   ${threshold}-of-${n}`);
  console.log(`Time lock:       ${timeLock} seconds`);
  console.log(`Create key:      ${config.createKey?.toBase58() || "n/a"}`);
  console.log("");

  let score = 100;
  const findings: string[] = [];

  // Threshold checks
  if (n < 3) {
    score -= 25;
    findings.push("CRITICAL: fewer than 3 signers (single point of failure).");
  }
  if (n > 0 && threshold / n < 0.5) {
    score -= 15;
    findings.push("WARNING: threshold below 50% of signers.");
  }
  if (threshold === n && n > 1) {
    score -= 20;
    findings.push("WARNING: N-of-N threshold — lose one key and the multisig freezes.");
  }
  if (threshold === 1) {
    score -= 30;
    findings.push("CRITICAL: 1-of-N threshold is a hot wallet with extra steps.");
  }

  // Timelock checks
  if (timeLock === 0) {
    score -= 20;
    findings.push("WARNING: time lock is 0 — no window to detect malicious execution.");
  } else if (timeLock < 24 * 60 * 60) {
    score -= 10;
    findings.push("WARNING: time lock is less than 24 hours for a high-value multisig.");
  }

  // Signer permissions
  const highPermissionCount = members.filter((m) => {
    const mask = Number(m.permissions?.mask || 0);
    return mask > 0; // any permission beyond none
  }).length;
  if (highPermissionCount === n) {
    findings.push("NOTE: all members have active permissions — verify RBAC is intentional.");
  }

  console.log(`Policy score:    ${Math.max(0, score)}/100`);
  console.log("");
  console.log("Findings:");
  if (findings.length === 0) {
    console.log("  None — configuration aligns with baseline policy.");
  } else {
    findings.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }
  console.log("");
  console.log("Next steps:");
  if (score < 70) {
    console.log("  - Increase signers to at least 3 (prefer 5+ for high value).");
    console.log("  - Raise threshold to ~50% + 1.");
    console.log("  - Add a non-zero timelock (24 h minimum for mainnet program authority).");
  }
  console.log("  - Review signer identities and permissions (see signer-onboarding.md).");
  console.log("  - Schedule a signing ceremony before any sensitive proposal.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
