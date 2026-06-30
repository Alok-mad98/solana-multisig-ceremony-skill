# Signer Onboarding

A multisig is only as trustworthy as the people and devices that hold its keys. This file describes how to onboard a new signer safely.

---

## 1. Pre-Onboarding Requirements

Before generating keys:

- [ ] Signer has read the protocol's multisig policy.
- [ ] Signer acknowledges they will use a **dedicated device** and **hardware wallet** for this role only.
- [ ] Signer confirms they have a **safe physical storage** plan for the seed backup.
- [ ] Signer provides a published identity link (Twitter, LinkedIn, GitHub) or already-known identity.

---

## 2. Hardware Wallet Setup

### Recommended minimum
- One of: **Ledger Flex/Nano S+/X**, **Trezor Safe**, or **Keystone 3 Pro**.
- Device firmware up to date (verified via manufacturer app).
- Device purchased **directly from the manufacturer**, not a marketplace reseller.
- **Never** initialize a hardware wallet on a work machine that handles code repositories, email, or Telegram.

### Setup checklist
1. Initialize device in a private, low-traffic location.
2. Write seed phrase on **metal or paper** backup; make 2 copies.
3. Store copies in **geographically separated, access-controlled** locations.
4. Set a strong PIN (not a birthday or sequence).
5. Verify the device shows the expected **recovery phrase checksum** or passphrase.
6. Install only the official **Solana app** from Ledger Live / Trezor Suite / Keystone update.

---

## 3. Key Generation & Address Attestation

The signer must prove they control the address they claim:

1. On the **dedicated/hardened device**, open a Solana wallet that shows addresses in plain text.
2. Copy the **public address** (never the seed) into the onboarding form.
3. Sign the following message with that address:
   ```
   I, <full name / handle>, am the owner of Solana address <address>
   and intend to use it as a signer for <protocol> <multisig_role>.
   Date: <ISO date>
   ```
4. Share the signature and public key through a trusted channel.
5. The onboarding coordinator verifies the signature against the address.

---

## 4. Out-of-Band Identity Verification

For program-authority or high-value treasury multisigs, require **at least one** out-of-band method:

- **Video call** where the signer shows the hardware wallet address on screen and matches their voice/face to a known identity.
- **Signed message from a known public key** (e.g., their verified GitHub SSH/GPG key, an existing signer address).
- **In-person verification** by at least one existing signer (note: Drift showed in-person trust can be faked, so in-person alone is insufficient).

Record verification evidence (signed message, date, verifier names).

---

## 5. Device Separation Rules

| Use | Allowed Device |
|---|---|
| Work (code, email, Telegram) | Normal laptop |
| Multisig signing | Dedicated hardware wallet / air-gapped signer |
| Verifying proposals | Separate read-only device or printout |

A signer should never:
- Copy the seed phrase into a password manager synced to work devices.
- Sign transactions on the same laptop used for Discord/Telegram/email.
- Store the seed phrase in cloud storage.

---

## 6. Adding the Signer to the Multisig

When you have the verified public address:

1. Propose the signer addition in the multisig **during a scheduled ceremony**.
2. Every existing signer must independently verify the new address matches the attestation message.
3. Confirm the proposal is a pure `add_member` / `set_threshold` action with no hidden instructions.
4. Execute only after the timelock expires.

See [ceremony-workflow.md](ceremony-workflow.md) for the ceremony steps.
