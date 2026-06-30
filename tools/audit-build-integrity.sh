#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${1:-.}"
cd "${PROJECT_PATH}"

echo "=== Build Integrity Audit: $(pwd) ==="

checks_passed=0
checks_total=0

run_check() {
  checks_total=$((checks_total + 1))
}

# 1. Lockfile present
run_check
if [ -f "package-lock.json" ] || [ -f "yarn.lock" ] || [ -f "pnpm-lock.yaml" ]; then
  echo "[PASS] JavaScript lockfile present."
  checks_passed=$((checks_passed + 1))
else
  echo "[FAIL] No JavaScript lockfile found. Pin dependencies before shipping."
fi

# 2. Cargo.lock present for Rust programs
run_check
if [ -f "Cargo.lock" ]; then
  echo "[PASS] Cargo.lock present."
  checks_passed=$((checks_passed + 1))
else
  echo "[WARN] Cargo.lock not found (skip if not a Rust/Solana program)."
fi

# 3. npm audit
run_check
if [ -f "package.json" ]; then
  if command -v npm >/dev/null 2>&1; then
    if npm audit --audit-level=high 2>/dev/null; then
      echo "[PASS] npm audit reports no high/critical vulnerabilities."
      checks_passed=$((checks_passed + 1))
    else
      echo "[FAIL] npm audit found high/critical vulnerabilities."
    fi
  else
    echo "[SKIP] npm not installed."
  fi
else
  echo "[SKIP] No package.json."
fi

# 4. npm provenance for published packages
run_check
if [ -f "package.json" ]; then
  PKG_NAME=$(node -p "require('./package.json').name || ''" 2>/dev/null || true)
  if [ -n "${PKG_NAME}" ]; then
    if npm view "${PKG_NAME}" --json 2>/dev/null | grep -q "provenance"; then
      echo "[PASS] Latest npm publish includes provenance attestation."
      checks_passed=$((checks_passed + 1))
    else
      echo "[WARN] Published package lacks provenance attestation (or not yet published)."
    fi
  else
    echo "[SKIP] Could not read package name."
  fi
else
  echo "[SKIP] No package.json."
fi

# 5. CI workflow exists
run_check
if [ -d ".github/workflows" ] && [ "$(ls -A .github/workflows/*.yml .github/workflows/*.yaml 2>/dev/null | wc -l)" -gt 0 ]; then
  echo "[PASS] GitHub Actions workflows found."
  checks_passed=$((checks_passed + 1))
else
  echo "[FAIL] No GitHub Actions workflows. Use the ci-policy-template.yml starter."
fi

# 6. .env not committed
run_check
if [ -f ".gitignore" ] && grep -q "\.env" .gitignore; then
  echo "[PASS] .gitignore excludes .env."
  checks_passed=$((checks_passed + 1))
else
  echo "[FAIL] .gitignore does not exclude .env files."
fi

# 7. Dockerfile pinned (optional)
run_check
if [ -f "Dockerfile" ]; then
  if grep -qE "^FROM .*@sha256:" Dockerfile; then
    echo "[PASS] Dockerfile base image pinned by digest."
    checks_passed=$((checks_passed + 1))
  else
    echo "[WARN] Dockerfile base image not pinned by digest."
  fi
else
  echo "[SKIP] No Dockerfile."
fi

echo ""
echo "Score: ${checks_passed}/${checks_total} checks passed."

if [ ${checks_passed} -lt $((checks_total * 70 / 100)) ]; then
  echo "Result: RED — address failures before shipping."
  exit 1
else
  echo "Result: GREEN or YELLOW — review warnings."
fi
