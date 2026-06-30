# Build Integrity & Supply Chain

The bytes that signers approve must be exactly the bytes the team reviewed. This file hardens the pipeline that produces and publishes Solana programs and client code.

> Based on the Anza web3.js supply-chain incident (Dec 2024) and Solana verified-build tooling.

---

## 1. Verified / Reproducible Builds

### Why it matters
A program deployed on Solana can only be trusted if the on-chain ELF matches the open-source code. Verified builds let anyone reproduce the binary.

### Steps
1. Use a pinned toolchain (Solana CLI, Rust, Anchor) in CI.
2. Build inside a container with a locked base image digest.
3. Pin all `Cargo.toml` and `package.json` versions.
4. Publish the build signature and Dockerfile/SBOM alongside the release.
5. Compare the local build hash to the on-chain program hash.

### Tools
- `solana program show <PROGRAM_ID>` — inspects on-chain ELF hash.
- [Solana verified-build CLI](https://github.com/solana-developers/verified-build) — community tooling.
- `cargo auditable` — embed dependency info in the binary.

---

## 2. npm / JavaScript Supply Chain

The Dec 2024 `@solana/web3.js` attack showed that a phished npm publisher can ship key-stealing code.

### Checklist
- [ ] Pin dependencies with `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.
- [ ] Enable npm **provenance** (`npm publish --provenance`).
- [ ] Review `npm audit` and `socket.dev` / `snyk` output in CI.
- [ ] Avoid ranges (`^`, `~`) for security-critical packages.
- [ ] Use `node --check` and deterministic installs in CI.
- [ ] Hash-lock base Docker images.
- [ ] Require two maintainers to approve a release.

### Policy gate
Use `tools/audit-build-integrity.sh` to fail CI if:
- Provenance is missing on published packages.
- Lockfile changed without a dependency-review PR.
- `npm audit` reports high/critical vulnerabilities.

---

## 3. CI Policy Gate Template

A starter GitHub Actions workflow is in `tools/ci-policy-template.yml`. It enforces:
- Deterministic install (`npm ci` with lockfile).
- `npm audit --audit-level=high`.
- Reproducible program build and on-chain hash comparison.
- SBOM generation.
- Two-reviewer gate before release.

---

## 4. Dependency Risk Triage

| Signal | Action |
|---|---|
| Package added via typo-squat name | BLOCK |
| New package with < 100 weekly downloads | WATCH |
| Package updated in a security-sensitive path | Require review |
| Dependency adds post-install scripts | BLOCK unless audited |
| Maintainer changed recently | WATCH |

---

## 5. SBOM & Attestation

- Generate an SBOM with `syft packages dir:.` or `npm sbom`.
- Store SBOM with each release.
- Sign release artifacts with Sigstore/cosign or project signing key.
- Publish build attestation that links git commit, CI run, and on-chain program ID.

---

## 6. Signer / Build Pipeline Boundary

The machine that publishes npm packages or deploys programs should **not** be the machine that holds multisig signing keys. Separate:
- **CI/CD pipeline** — builds, tests, publishes artifacts.
- **Release signer** — a multisig that approves on-chain program upgrades or npm releases.
- **Treasury signers** — independent of build and release signers.

If the build pipeline is compromised, an attacker should not be able to sign a malicious release.
