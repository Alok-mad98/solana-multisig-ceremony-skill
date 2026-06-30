# Key Rotation & Compromise Recovery

When a signer's device, seed, or identity is in doubt, acting fast and in the right order saves the protocol.

---

## 1. When to Rotate

Rotate a signer when:
- The signer lost their hardware wallet or seed backup.
- The signer's work device was compromised.
- The signer clicked a phishing link or installed untrusted software.
- The signer left the team or changed role.
- Any durable-nonce or pre-signed transaction may have been generated on a compromised machine.
- A supply-chain incident (e.g., malicious npm release) touched the signer's work environment.

Rotate **immediately** if the private key might have been exposed.

---

## 2. Pre-Rotation Evidence

Before changing anything on-chain:

1. **Document the trigger.** Save emails, screenshots, timeline, and the signer's statement.
2. **Snapshot current multisig state.** Run `tools/audit-multisig.ts` and save the output.
3. **Snapshot pending proposals.** Export all active proposals with `tools/execute-list-proposals`.
4. **Check recent on-chain activity.** Look for unexpected signatures from the signer address.

This evidence protects both the team and the affected signer.

---

## 3. Safe Rotation Ceremony

### Step 1 — Halt sensitive operations
- Pause all non-emergency proposals.
- If the protocol has a circuit breaker, arm it.

### Step 2 — Generate a new signer identity
- The new signer follows [signer-onboarding.md](signer-onboarding.md).
- Use a different hardware device/manufacturer if the old one is suspected.

### Step 3 — Out-of-band verification
- Verify the new address via video call and signed attestation.
- At least one existing signer must confirm in a separate channel.

### Step 4 — Propose `remove_member(old)` + `add_member(new)` + keep threshold
- Do **not** lower the threshold to make quorum easier.
- Bundle remove + add in one proposal only; do not reduce signer count.

### Step 5 — Execute through emergency veto-bypass if needed
- For active compromises, use the higher-threshold veto-bypass path to execute faster than the normal timelock.

### Step 6 — Post-rotation actions
- Run `tools/audit-multisig.ts` to confirm new configuration.
- Update policy documentation, signer roster, and evidence repository.
- Conduct a drills session with the new signer.

---

## 4. Compromise Response Runbook (High-Level)

| Time | Action |
|---|---|
| 0 min | Affected signer reports incident; assume compromise is real. |
| 5 min | Pause non-critical proposals; alert all signers on two channels. |
| 15 min | Collect evidence snapshot and identify affected address(es). |
| 30 min | Convene emergency ceremony; prepare remove/add proposal. |
| 1 h | Sign and execute rotation using veto-bypass if applicable. |
| 2 h | Audit new multisig state; publish internal post-incident note. |
| 24 h | Review supply-chain exposure; rotate any CI/deploy keys the compromised machine touched. |
| 7 days | Publish post-mortem and update policy drifts found during response. |

---

## 5. If Rotation Is Not Possible

If too many signers are compromised to reach threshold:
- Engage law enforcement / security firms immediately.
- Begin protocol sunsetting / migration to a new, uncompromised authority.
- Use any immutable pause / emergency state available.
- Preserve evidence for investigators.

This is why **thresholds, timelocks, and veto groups exist** — to make total compromise statistically and operationally harder.
