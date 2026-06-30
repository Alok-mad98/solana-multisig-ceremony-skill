import "dotenv/config";
import { Connection, PublicKey, Transaction, VersionedTransaction, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";

const RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const SYSTEM_PROGRAM_ID = SystemProgram.programId;
// SystemProgram instruction discriminators
const ADVANCE_NONCE_IX = 4;
const INITIALIZE_NONCE_IX = 6;
const AUTHORIZE_NONCE_IX = 7;

function usage() {
  console.log("Usage: npx tsx check-durable-nonce.ts <base64-or-base58-transaction>");
  process.exit(1);
}

async function main() {
  const input = process.argv[2];
  if (!input) usage();

  const connection = new Connection(RPC, "confirmed");

  let txBytes: Buffer;
  try {
    txBytes = Buffer.from(input, "base64");
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

  // Legacy transactions may expose nonceInfo explicitly
  const legacyNonceInfo = !isVersioned ? (tx as Transaction).nonceInfo : undefined;

  const instructions = isVersioned
    ? message.compiledInstructions.map((ix: any) => ({
        programId: accounts[ix.programIdIndex],
        accounts: ix.accountKeyIndexes.map((i: number) => accounts[i]),
        data: Buffer.from(ix.data),
      }))
    : (tx as Transaction).instructions.map((ix) => ({
        programId: ix.programId,
        accounts: ix.keys.map((k) => k.pubkey),
        data: ix.data,
      }));

  let usesDurableNonce = false;
  let nonceAuthority: PublicKey | undefined;
  let nonceAccount: PublicKey | undefined;

  if (legacyNonceInfo) {
    usesDurableNonce = true;
    nonceAccount = legacyNonceInfo.nonceInstruction.keys[0]?.pubkey;
    nonceAuthority = legacyNonceInfo.nonceInstruction.keys[1]?.pubkey;
  }

  for (const ix of instructions) {
    if (ix.programId.equals(SYSTEM_PROGRAM_ID)) {
      const disc = ix.data.length ? ix.data[0] : undefined;
      if (disc === ADVANCE_NONCE_IX || disc === INITIALIZE_NONCE_IX || disc === AUTHORIZE_NONCE_IX) {
        usesDurableNonce = true;
        nonceAccount = ix.accounts[0];
        nonceAuthority = ix.accounts[1];
      }
    }
  }

  console.log("=== Durable Nonce Check ===");
  console.log(`Uses durable nonce: ${usesDurableNonce}`);

  if (usesDurableNonce) {
    console.log(`Nonce account:    ${nonceAccount?.toBase58() || "unknown"}`);
    console.log(`Nonce authority:  ${nonceAuthority?.toBase58() || "unknown"}`);
    console.log("Recent blockhash: " + message.recentBlockhash);

    try {
      if (nonceAccount) {
        const acc = await connection.getAccountInfo(nonceAccount);
        if (acc && acc.owner.equals(SYSTEM_PROGRAM_ID) && acc.data.length >= 80) {
          const storedNonce = acc.data.slice(8, 40).toString("base64");
          console.log(`On-chain nonce value: ${storedNonce}`);
          console.log(`Matches tx blockhash: ${message.recentBlockhash === bs58.encode(acc.data.slice(8, 40))}`);
        } else {
          console.log("Nonce account data could not be parsed; verify it is a System-owned nonce account.");
        }
      }
    } catch (e: any) {
      console.log(`Could not fetch nonce account: ${e.message}`);
    }

    console.log("");
    console.log("RISK: Durable nonces allow pre-signed transactions to remain valid for an extended period.");
    console.log("Require written justification before signing, especially if authority changes are included.");
    process.exit(2);
  } else {
    console.log("No durable nonce instructions or nonceInfo detected in this transaction.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
