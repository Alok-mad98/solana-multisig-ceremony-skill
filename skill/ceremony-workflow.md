# Signing Ceremony Workflow

A **signing ceremony** is a structured, interruption-free process for reviewing and signing high-value multisig transactions. It prevents the blind signing that enabled the Drift exploit.

---

## 1. Before the Ceremony

### Environment
- [ ] Quiet, private room or virtual room with **video on** for all signers.
- [ ] Signers use **dedicated signing devices**, not primary work laptops.
- [ ] Each signer has a printed or read-only copy of the proposal summary.
- [ ] One person acts as **facilitator** (can propose + explain, but should not sign alone).
- [ ] One person acts as **evidence keeper** (records多人 screenshots, signatures, timestamps).

### Proposals prepared
- [ ] All proposals are created **before** the ceremony starts.
- [ ] Each proposal has a unique ID and human-readable description.
- [ ] Raw transaction or simulation output is pre-shared to all signers.
- [ ] No new proposals are introduced once the ceremony begins.

---

## 2. Ceremony Steps

For each proposal:

1. **Read the intent aloud.**
   - What program is being called?
   - What accounts are mutated?
   - What is the monetary or authority impact?
   - Are there unexpected instructions (e.g., `set_authority`, `transfer`, `upgrade`)?

2. **Decode on screen.**
   - Use `tools/decode-proposal.ts` to show each instruction in plain English.
   - Cross-check against the pre-shared summary.

3. **Check durable nonces / stale transactions.**
   - Run `tools/check-durable-nonce.ts`.
   - If a durable nonce is present, require a written justification and additional signer.

4. **Simulate.**
   - Run `simulateTransaction` and inspect balance/authority/state changes.
   - Reject if simulation output differs from stated intent.

5. **Each signer independently verifies.**
   - Compare hardware-wallet screen to the decoded summary.
   - Confirm address, instruction name, and parameters match.
   - If raw hex is shown, use the **digest comparison** method (compute expected hash on a separate device and compare one hash).

6. **Sign in order.**
   - The facilitator calls signatures one by one.
   - Each signer states: "I have verified proposal X, I am signing."
   - The evidence keeper records the signer's name, address, timestamp, and transaction signature.

7. **Verify quorum before execution.**
   - Do not execute until all required signatures are collected.
   - If execution is time-sensitive, schedule it in the same ceremony with a final review.

---

## 3. Durable Nonce Policy

Durable nonces allow a transaction to be valid for an extended period. This is useful for offline signing and custodians, but it is exactly what the Drift attackers abused.

**Rules:**
- Durable nonces require **written justification** before the ceremony.
- Durable-nonce transactions must be **simulated and decoded** independently by every signer.
- The nonce value, blockhash, and expiration must be published in the evidence log.
- Never sign a durable-nounce transaction that contains an **authority transfer** unless it is the explicit purpose of the ceremony and reviewed by the veto quorum.

---

## 4. Post-Ceremony Actions

1. Export the evidence report with `tools/evidence-report.md.tpl`.
2. Rename file with date and ceremony ID: `YYYY-MM-DD_ceremony_<id>.md`.
3. Store in a tamper-evident location (git-signed commit, secure shared drive).
4. If proposals are not executed immediately, schedule execution and confirm quorum remains valid.

---

## 5. Emergency Ceremony (Compromise Response)

If a signer reports a possible compromise:

1. Pause all pending proposals involving that signer.
2. Convene an emergency ceremony with the remaining signers.
3. Use the **veto bypass** threshold to rotate the compromised signer (see [key-rotation.md](key-rotation.md)).
4. Preserve evidence before any state change.
