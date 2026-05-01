#!/usr/bin/env bash
# ja-mdx-all.sh
#
# Phase 2 driver — runs after ja-translate-all.sh has populated the SOT.
# For every property:
#   1. Scaffold the 4 JA MDX shells from the EN templates (with lang="ja").
#   2. Translate each shell's prose body to natural Japanese.
# Also translates the Queenstown Insights MDX shell.
#
# Idempotent — translator hash-skips re-runs.

set -uo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
TRANSLATE="node --env-file=$REPO/.env.local $REPO/scripts/translate-property.mjs"
LOG_DIR="${TMPDIR:-/tmp}"
LOG="$LOG_DIR/ja-mdx-all.log"
echo "ja-mdx-all.sh starting at $(date)" > "$LOG"

run() {
  echo "→ $*" | tee -a "$LOG"
  if eval "$@" >> "$LOG" 2>&1; then
    echo "  ok" | tee -a "$LOG"
  else
    echo "  FAILED: $*" | tee -a "$LOG"
    return 1
  fi
}

# ── 1. Scaffold + translate per property ─────────────────────────
for slug_dir in "$REPO/data/sot/properties"/*/; do
  slug="$(basename "$slug_dir")"
  echo "=== $slug ===" | tee -a "$LOG"

  # Scaffold the 4 JA MDX shells.
  run "node $REPO/scripts/scaffold-zh-property.mjs $slug --lang=ja"

  # Translate each MDX shell's prose body. The scaffold already adds
  # lang=\"ja\" to component invocations and translates page-type
  # frontmatter; this pass translates any Markdown headings and prose
  # narrative that lives between the components (e.g. critical-info,
  # user-instructions on properties with rich body content).
  for page in welcome-house-rules user-instructions critical-info; do
    src="$REPO/content/docs/properties/$slug/$page.mdx"
    dest="$REPO/content/docs/ja/properties/$slug/$page.mdx"
    if [ -f "$src" ]; then
      run "$TRANSLATE --file $src $dest ja"
    fi
  done
done

# ── 2. Queenstown Insights MDX shell ─────────────────────────────
QI_SRC="$REPO/content/docs/queenstown-insights.mdx"
QI_DEST="$REPO/content/docs/ja/queenstown-insights.mdx"
if [ -f "$QI_SRC" ]; then
  run "$TRANSLATE --file $QI_SRC $QI_DEST ja"
fi

# ── 3. Refresh translated-slugs list (so LocaleSwitcher sees ja) ──
run "node $REPO/scripts/list-translated-properties.mjs"

echo "ja-mdx-all.sh completed at $(date)" | tee -a "$LOG"
