#!/usr/bin/env bash
set -euo pipefail

# Interactive signing ceremony checklist.
# Run this before any high-value multisig ceremony.

CEREMONY_ID="${1:-$(date +%Y%m%d-%H%M%S)}"
REPORT="ceremony-${CEREMONY_ID}.md"

echo "=== Solana Multisig Ceremony Checklist ==="
echo "Ceremony ID: ${CEREMONY_ID}"
echo "Recording to: ${REPORT}"
echo ""

read -rp "1. Are all signers using dedicated signing devices, not work laptops? [y/N] " a1
read -rp "2. Are all proposals created and shared before the ceremony started? [y/N] " a2
read -rp "3. Has every proposal been decoded in plain English? [y/N] " a3
read -rp "4. Have all durable-nonce / stale transactions been flagged and justified? [y/N] " a4
read -rp "5. Has every signer independently verified the decoded summary? [y/N] " a5
read -rp "6. Has each signer stated aloud what they are signing before signing? [y/N] " a6
read -rp "7. Is the evidence keeper recording signatures and timestamps? [y/N] " a7
read -rp "8. Is execution only happening after all required signatures are collected? [y/N] " a8

cat > "${REPORT}" <<EOF
# Key Ceremony Checklist: ${CEREMONY_ID}

| # | Check | Result |
|---|-------|--------|
| 1 | Dedicated signing devices | ${a1} |
| 2 | Proposals fixed before ceremony | ${a2} |
| 3 | Proposals decoded in plain English | ${a3} |
| 4 | Durable nonces flagged | ${a4} |
| 5 | Independent signer verification | ${a5} |
| 6 | Verbal confirmation before signing | ${a6} |
| 7 | Evidence keeper active | ${a7} |
| 8 | Execution after quorum | ${a8} |

## Notes
<!-- Add signers, timestamps, proposal IDs here. -->

## Sign-off
<!-- Signer name | signature | date -->
EOF

echo ""
echo "Checklist saved to ${REPORT}"

if [[ "$a1$a2$a3$a4$a5$a6$a7$a8" =~ ^[Yy]{8}$ ]]; then
  echo "Status: ALL CHECKS PASSED — ceremony may proceed."
else
  echo "Status: INCOMPLETE — resolve unchecked items before signing."
  exit 1
fi
