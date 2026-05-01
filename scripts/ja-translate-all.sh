#!/usr/bin/env bash
# ja-translate-all.sh
#
# One-shot driver that translates every JA artefact: UI strings, _shared
# boilerplate, _appliances library, Queenstown Insights data, and the SOT
# of every property under data/sot/properties/. Idempotent — translator
# hash-skips files whose source hasn't changed.
#
# Run from repo root. Writes a log file to /tmp/ja-translate-all.log.

set -uo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
TRANSLATE="node --env-file=$REPO/.env.local $REPO/scripts/translate-property.mjs"
LOG_DIR="${TMPDIR:-/tmp}"
LOG="$LOG_DIR/ja-translate-all.log"
echo "ja-translate-all.sh starting at $(date)" > "$LOG"

run() {
  echo "→ $*" | tee -a "$LOG"
  if eval "$@" >> "$LOG" 2>&1; then
    echo "  ok" | tee -a "$LOG"
  else
    echo "  FAILED: $*" | tee -a "$LOG"
    return 1
  fi
}

# ── 1. UI strings ────────────────────────────────────────────────
run "$TRANSLATE --file $REPO/data/sot/_strings/en.yaml $REPO/data/sot/_strings/ja.yaml ja"

# ── 2. Shared boilerplate (3 files) ──────────────────────────────
for src in "$REPO/data/sot/_shared"/*.md; do
  base="$(basename "$src")"
  dest="$REPO/data/sot/_shared/ja/$base"
  run "$TRANSLATE --file $src $dest ja"
done

# ── 3. Appliance library (~19 files) ─────────────────────────────
for src in "$REPO/data/sot/_appliances"/*.md; do
  base="$(basename "$src")"
  dest="$REPO/data/sot/_appliances/ja/$base"
  run "$TRANSLATE --file $src $dest ja"
done

# ── 4. Queenstown Insights ───────────────────────────────────────
run "$TRANSLATE --file $REPO/data/sot/queenstown/insights.yaml $REPO/data/sot/queenstown/ja/insights.yaml ja"

# ── 5. Per-property SOT (3 files each × 14 properties) ───────────
for slug_dir in "$REPO/data/sot/properties"/*/; do
  slug="$(basename "$slug_dir")"
  run "$TRANSLATE $slug ja"
done

echo "ja-translate-all.sh completed at $(date)" | tee -a "$LOG"
