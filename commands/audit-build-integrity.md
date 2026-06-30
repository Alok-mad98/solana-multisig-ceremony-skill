# Command: /audit-build-integrity

## Purpose
Run a supply-chain and reproducible-build audit on a Solana project.

## When to use
- Before a program upgrade.
- After adding new dependencies.
- Before publishing a npm package or release.
- During CI setup.

## Steps
1. Read `skill/build-integrity.md`.
2. Run `tools/audit-build-integrity.sh <project-path>`.
3. Inspect `package.json`, lockfile, and on-chain program hash if available.
4. Compare the on-chain ELF to a local reproducible build.
5. Report findings and link to `tools/ci-policy-template.yml` for remediation.

## Output format
```markdown
## Build Integrity Audit: <project>
- Lockfile: present / missing
- npm audit high/critical: N
- Reproducible build: match / mismatch / not checked
- npm provenance: yes / no
- SBOM: present / missing

### Score: <score>/100
### Remediation
1. ...
```

## Example prompt
```
/audit-build-integrity
/audit-build-integrity ./my-solana-program
```
