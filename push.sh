#!/usr/bin/env bash
# Run this AFTER creating the empty repo at https://github.com/Burburton/palworld-breeding
# (Settings does not need any special config yet — workflow will run on first push.)
set -euo pipefail

cd "$(dirname "$0")"

if git ls-remote origin HEAD &>/dev/null; then
  echo "origin is reachable — proceeding with push"
else
  echo "ERROR: origin is not reachable."
  echo "Did you create the empty repo at https://github.com/Burburton/palworld-breeding ?"
  exit 1
fi

git push -u origin main
echo
echo "Pushed successfully."
echo "Next:"
echo "  1. Open https://github.com/Burburton/palworld-breeding/actions"
echo "  2. Wait for 'Deploy to GitHub Pages' workflow to finish"
echo "  3. Settings -> Pages -> Build and deployment -> Source: GitHub Actions"
echo "  4. Site will be at https://burburton.github.io/palworld-breeding/"