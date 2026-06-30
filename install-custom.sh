#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="solana-multisig-ceremony-skill"

echo "=== Solana Multisig Ceremony Skill — Custom Installer ==="
echo ""
echo "Choose install location:"
echo "  1) Personal skills: ~/.claude/skills/"
echo "  2) Project-local: ./.claude/skills/"
echo "  3) Custom path"
read -r -p "Choice [1/2/3]: " location_choice

case "${location_choice}" in
  1) TARGET_BASE="${HOME}/.claude/skills" ;;
  2) TARGET_BASE="./.claude/skills" ;;
  3) read -r -p "Enter custom base path: " TARGET_BASE ;;
  *) echo "Invalid choice. Exiting."; exit 1 ;;
esac

TARGET_DIR="${TARGET_BASE}/${SKILL_NAME}"

mkdir -p "${TARGET_BASE}"

if [ -d "${TARGET_DIR}" ]; then
  read -r -p "${TARGET_DIR} already exists. Overwrite? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
  rm -rf "${TARGET_DIR}"
fi

cp -R "${SCRIPT_DIR}" "${TARGET_DIR}"

echo ""
echo "Installed to ${TARGET_DIR}"
echo ""
echo "Next steps:"
echo "  1. cd ${TARGET_DIR}/tools && npm install"
echo "  2. cp ${TARGET_DIR}/.env.example ${TARGET_DIR}/.env"
echo "  3. Edit .env with your RPC/Helius credentials."
echo ""
read -r -p "Open .env.example in your editor? [y/N] " open_env
if [[ "$open_env" =~ ^[Yy]$ ]]; then
  if command -v code >/dev/null 2>&1; then
    code "${TARGET_DIR}/.env.example"
  elif command -v nano >/dev/null 2>&1; then
    nano "${TARGET_DIR}/.env.example"
  else
    echo "No recognized editor found. Please open ${TARGET_DIR}/.env.example manually."
  fi
fi
