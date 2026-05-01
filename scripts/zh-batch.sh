#!/usr/bin/env bash
# zh-batch.sh <slug1> <slug2> ...
#
# Run translate-property.mjs + scaffold-zh-property.mjs for each slug,
# serially. Used to roll out ZH for multiple properties in a single
# invocation. Idempotent — slugs that already have a fresh translation
# are skipped by the translator's hash check.

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <slug1> [<slug2> …]" >&2
  exit 2
fi

for slug in "$@"; do
  echo "=== $slug ==="
  node --env-file="$REPO/.env.local" "$REPO/scripts/translate-property.mjs" "$slug" zh
  node "$REPO/scripts/scaffold-zh-property.mjs" "$slug"
done

echo "=== Done. $# slug(s) processed. ==="
