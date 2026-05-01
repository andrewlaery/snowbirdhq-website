#!/usr/bin/env bash
# zh-batch.sh [--lang=<lang>] <slug1> <slug2> ...
#
# Run translate-property.mjs + scaffold-zh-property.mjs for each slug,
# serially. Used to roll out a locale for multiple properties in a single
# invocation. Idempotent — slugs that already have a fresh translation
# are skipped by the translator's hash check.
#
# Default lang is `zh` for back-compat. Pass `--lang=ja` to run the
# Japanese batch.

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

LANG="zh"
SLUGS=()
for arg in "$@"; do
  case "$arg" in
    --lang=*)
      LANG="${arg#--lang=}"
      ;;
    *)
      SLUGS+=("$arg")
      ;;
  esac
done

if [ "${#SLUGS[@]}" -eq 0 ]; then
  echo "Usage: $0 [--lang=<lang>] <slug1> [<slug2> …]" >&2
  exit 2
fi

for slug in "${SLUGS[@]}"; do
  echo "=== $slug ($LANG) ==="
  node --env-file="$REPO/.env.local" "$REPO/scripts/translate-property.mjs" "$slug" "$LANG"
  node "$REPO/scripts/scaffold-zh-property.mjs" "$slug" "--lang=$LANG"
done

echo "=== Done. ${#SLUGS[@]} slug(s) processed for lang=$LANG. ==="
