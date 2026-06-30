import { Connection, PublicKey, Transaction, VersionedTransaction, SystemProgram } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

function getConnection(env: { SOLANA_RPC_URL?: string }) {
  return new Connection(env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", "confirmed");
}

export async function auditMultisig(address: string, env: { SOLANA_RPC_URL?: string }) {
  const connection = getConnection(env);
  const pda = new PublicKey(address);

  let config: any;
  try {
    config = await multisig.accounts.Multisig.fromAccountAddress(connection, pda);
  } catch (e: any) {
    return { ok: false, error: `Could not load Squads v4 config: ${e.message}` };
  }

  const members = config.members as { key: PublicKey; permissions: any }[];
  const threshold = Number(config.threshold);
  const n = members.length;
  const timeLock = Number(config.timeLock || 0);

  let score = 100;
  const findings: string[] = [];

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
  if (timeLock === 0) {
    score -= 20;
    findings.push("WARNING: time lock is 0 — no detection window before execution.");
  } else if (timeLock < 24 * 60 * 60) {
    score -= 10;
    findings.push("WARNING: time lock is less than 24 hours for a high-value multisig.");
  }

  return {
    ok: true,
    address,
    members: n,
    threshold: `${threshold}-of-${n}`,
    timeLockSeconds: timeLock,
    score: Math.max(0, score),
    findings,
  };
}

export async function decodeProposal(txBase64: string) {
  let txBytes: Buffer;
  try {
    txBytes = Buffer.from(txBase64, "base64");
    if (txBytes.length === 0) throw new Error("empty");
  } catch {
    return { ok: false, error: "Invalid base64 transaction." };
  }

  let tx: Transaction | VersionedTransaction;
  let isVersioned = false;
  try {
    tx = VersionedTransaction.deserialize(txBytes);
    isVersioned = true;
  } catch {
    try {
      tx = Transaction.from(txBytes);
    } catch (e: any) {
      return { ok: false, error: `Could not deserialize transaction: ${e.message}` };
    }
  }

  const message = isVersioned ? (tx as VersionedTransaction).message : (tx as Transaction).compileMessage();
  const accounts: PublicKey[] = isVersioned ? message.staticAccountKeys : message.accountKeys;

  const instructions = isVersioned
    ? message.compiledInstructions.map((ix: any) => ({
        programId: accounts[ix.programIdIndex],
        accounts: ix.accountKeyIndexes.map((i: number) => accounts[i].toBase58()),
        data: Buffer.from(ix.data).toString("hex").slice(0, 64),
      }))
    : (tx as Transaction).instructions.map((ix) => ({
        programId: ix.programId,
        accounts: ix.keys.map((k) => k.pubkey.toBase58()),
        data: ix.data.toString("hex").slice(0, 64),
      }));

  const programList = instructions.map((ix: any) => ({ program: ix.programId.toBase58(), accounts: ix.accounts }));

  const redFlags: string[] = [];
  const programIds = instructions.map((ix: any) => ix.programId.toBase58());
  if (programIds.some((p) => p === SystemProgram.programId.toBase58())) {
    for (const ix of instructions) {
      if (ix.programId.equals(SystemProgram.programId)) {
        const data = Buffer.from((isVersioned ? (tx as VersionedTransaction).message as any : null), "hex");
        const disc = ix.data ? parseInt(ix.data.slice(0, 2), 16) : undefined;
        if (disc === 4) redFlags.push("System Program advanceNonce (durable nonce)");
        if (disc === 2) redFlags.push("System Program assign");
      }
    }
  }
  if (programIds.includes("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") ||
    programIds.includes("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")) {
    redFlags.push("SPL / Token-2022 instructions present — verify transfers, setAuthority, or closeAccount.");
  }

  return {
    ok: true,
    feePayer: accounts[0]?.toBase58(),
    recentBlockhash: message.recentBlockhash,
    instructionCount: instructions.length,
    programs: programList,
    redFlags,
    verdict: redFlags.length > 0 ? "WATCH / BLOCK" : "SAFE",
  };
}

export async function checkDurableNonce(txBase64: string) {
  const decoded = await decodeProposal(txBase64);
  if (!decoded.ok) return decoded;

  let usesNonce = false;
  for (const p of decoded.programs) {
    if (p.program === SystemProgram.programId.toBase58()) {
      // We already flagged in decode, but re-check if not caught
    }
  }

  // Re-deserialize to detect nonce discriminator precisely
  let txBytes: Buffer;
  try {
    txBytes = Buffer.from(txBase64, "base64");
    let tx: Transaction | VersionedTransaction;
    try {
      tx = VersionedTransaction.deserialize(txBytes);
      const msg = (tx as VersionedTransaction).message;
      const accounts = msg.staticAccountKeys;
      for (const ix of msg.compiledInstructions) {
        if (accounts[ix.programIdIndex].equals(SystemProgram.programId)) {
          const data = Buffer.from(ix.data);
          if (data.length && data[0] === 4) usesNonce = true;
        }
      }
    } catch {
      tx = Transaction.from(txBytes);
      for (const ix of (tx as Transaction).instructions) {
        if (ix.programId.equals(SystemProgram.programId) && ix.data.length && ix.data[0] === 4) {
          usesNonce = true;
        }
      }
      if ((tx as Transaction).nonceInfo) usesNonce = true;
    }
  } catch {
    // ignore
  }

  return { ok: true, usesDurableNonce: usesNonce, warning: usesNonce ? "Durable nonce detected. Require written justification before signing." : "No durable nonce detected." };
}
