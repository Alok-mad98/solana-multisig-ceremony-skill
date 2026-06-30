#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="solana-multisig-ceremony-skill"
DEFAULT_TARGET="${HOME}/.claude/skills"

TARGET_DIR="${DEFAULT_TARGET}/${SKILL_NAME}"

echo "Installing ${SKILL_NAME}..."

mkdir -p "${DEFAULT_TARGET}"

if [ -d "${TARGET_DIR}" ]; then
  read -r -p "Skill already exists at ${TARGET_DIR}. Overwrite? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
  rm -rf "${TARGET_DIR}"
fi

cp -R "${SCRIPT_DIR}" "${TARGET_DIR}"

echo "Installed to ${TARGET_DIR}"
echo "Next steps:"
echo "  1. cd ${TARGET_DIR}/tools && npm install"
echo "  2. cp ${TARGET_DIR}/.env.example ${TARGET_DIR}/.env"
echo "  3. Edit .env with your RPC/Helius credentials (never commit it)."
