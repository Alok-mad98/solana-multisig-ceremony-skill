import "dotenv/config";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

const RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

function usage() {
  console.log("Usage: npx tsx decode-proposal.ts <base64-or-base58-transaction>");
  process.exit(1);
}

function describeProgram(id: PublicKey): string {
  const s = id.toBase58();
  if (id.equals(SYSTEM_PROGRAM_ID)) return "System Program";
  if (id.equals(TOKEN_PROGRAM_ID)) return "SPL Token";
  if (id.equals(TOKEN_2022_PROGRAM_ID)) return "Token-2022";
  if (s.startsWith("SQDS4")) return "Squads";
  return s;
}

function inferRisk(instructions: any[]): { level: string; reasons: string[] } {
  const reasons: string[] = [];
  for (const ix of instructions) {
    const program = describeProgram(ix.programId);
    const dataHex = Buffer.from(ix.data).toString("hex");

    if (program.includes("Squads")) {
      reasons.push("proposal calls Squads config/instructions");
    }
    if (program === "SPL Token" || program === "Token-2022") {
      const accounts = ix.accounts.map((a: any) => a.pubkey.toBase58());
      if (dataHex.startsWith("04")) reasons.push("possible SPL Token set_authority");
      if (dataHex.startsWith("09")) reasons.push("possible SPL Token close_account");
      if (dataHex.startsWith("0c")) reasons.push("possible SPL Token approve/delegate");
      if (accounts.some((a: string) => a.includes("mint"))) reasons.push("interacts with a mint");
    }
    if (program === "System Program") {
      if (dataHex.startsWith("02")) reasons.push("System Program assign");
    }
  }
  if (reasons.length === 0) return { level: "SAFE", reasons: ["no obvious authority/value mutation patterns detected"] };
  if (reasons.some((r) => r.includes("set_authority") || r.includes("close_account") || r.includes("assign"))) {
    return { level: "BLOCK", reasons };
  }
  return { level: "WATCH", reasons };
}

async function main() {
  const input = process.argv[2];
  if (!input) usage();

  const connection = new Connection(RPC, "confirmed");

  let txBytes: Buffer;
  try {
    txBytes = Buffer.from(input, "base64");
    if (txBytes.length === 0) throw new Error("empty");
  } catch {
    try {
      txBytes = bs58.decode(input);
    } catch {
      console.error("Input is neither valid base64 nor base58.");
      process.exit(1);
    }
  }

  let tx: Transaction | VersionedTransaction;
  let isVersioned = false;
  try {
    tx = VersionedTransaction.deserialize(txBytes);
    isVersioned = true;
  } catch {
    tx = Transaction.from(txBytes);
  }

  const message = isVersioned ? (tx as VersionedTransaction).message : (tx as Transaction).compileMessage();
  const accounts: PublicKey[] = isVersioned ? message.staticAccountKeys : message.accountKeys;

  console.log("=== Decoded Proposal ===");
  console.log(`Versioned:       ${isVersioned}`);
  console.log(`Fee payer:       ${accounts[0]?.toBase58()}`);
  console.log(`Recent blockhash: ${message.recentBlockhash}`);
  console.log(`# instructions:  ${message.compiledInstructions ? message.compiledInstructions.length : (tx as Transaction).instructions.length}`);
  console.log("");

  const instructions = isVersioned
    ? message.compiledInstructions.map((ix: any) => ({
        programId: accounts[ix.programIdIndex],
        accounts: ix.accountKeyIndexes.map((i: number) => ({ pubkey: accounts[i], isSigner: message.isAccountSigner(i), isWritable: message.isAccountWritable(i) })),
        data: ix.data,
      }))
    : (tx as Transaction).instructions.map((ix) => ({
        programId: ix.programId,
        accounts: ix.keys,
        data: ix.data,
      }));

  instructions.forEach((ix: any, idx: number) => {
    console.log(`--- Instruction ${idx + 1} ---`);
    console.log(`Program:    ${describeProgram(ix.programId)} (${ix.programId.toBase58()})`);
    console.log("Accounts:");
    ix.accounts.forEach((acc: any) => {
      const flags = [];
      if (acc.isSigner) flags.push("signer");
      if (acc.isWritable) flags.push("writable");
      console.log(`  ${acc.pubkey.toBase58()} ${flags.length ? `[${flags.join(", ")}]` : ""}`);
    });
    console.log(`Data (hex): ${Buffer.from(ix.data).toString("hex").slice(0, 64)}${Buffer.from(ix.data).length > 32 ? "..." : ""}`);
  });

  console.log("");
  const { level, reasons } = inferRisk(instructions);
  console.log(`Risk verdict: ${level}`);
  console.log("Reasons:");
  reasons.forEach((r) => console.log(`  - ${r}`));

  // Simulation (best-effort)
  try {
    const sim = await connection.simulateTransaction(tx as any);
    console.log("");
    console.log("Simulation:");
    console.log(`  Err:  ${sim.value.err ? JSON.stringify(sim.value.err) : "none"}`);
    console.log(`  Logs: ${sim.value.logs?.length || 0} log lines`);
  } catch (e: any) {
    console.log(`\nSimulation skipped: ${e.message}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
