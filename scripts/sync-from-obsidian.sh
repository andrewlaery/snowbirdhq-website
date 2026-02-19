#!/usr/bin/env bash
set -euo pipefail

# Sync MDX content FROM an Obsidian vault TO content/docs/
#
# Obsidian stores files as .md; this project uses .mdx.
# This script copies .md files from the vault, renames them to .mdx,
# and preserves meta.json files already in the project (not overwritten).
#
# Usage:
#   ./scripts/sync-from-obsidian.sh              # full sync
#   ./scripts/sync-from-obsidian.sh --dry-run    # preview only

# --- Configuration ---
# Set OBSIDIAN_VAULT env var or edit this default path
OBSIDIAN_VAULT="${OBSIDIAN_VAULT:-$HOME/Obsidian/SnowbirdHQ}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_DIR="$PROJECT_DIR/content/docs"

# Sections to sync (vault subdirectory -> content/docs subdirectory)
SECTIONS=("properties" "owner-docs" "internal")

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be modified."
  echo
fi

# --- Validation ---
if [[ ! -d "$OBSIDIAN_VAULT" ]]; then
  echo "ERROR: Obsidian vault not found at: $OBSIDIAN_VAULT"
  echo "Set the OBSIDIAN_VAULT environment variable to your vault path."
  echo "  e.g. OBSIDIAN_VAULT=~/Obsidian/SnowbirdHQ ./scripts/sync-from-obsidian.sh"
  exit 1
fi

if [[ ! -d "$CONTENT_DIR" ]]; then
  echo "ERROR: Content directory not found at: $CONTENT_DIR"
  exit 1
fi

echo "Syncing FROM Obsidian vault: $OBSIDIAN_VAULT"
echo "            TO project docs: $CONTENT_DIR"
echo

copied=0
skipped=0

for section in "${SECTIONS[@]}"; do
  vault_section="$OBSIDIAN_VAULT/$section"
  project_section="$CONTENT_DIR/$section"

  if [[ ! -d "$vault_section" ]]; then
    echo "  SKIP section '$section' — not found in vault"
    continue
  fi

  echo "  Section: $section"

  # Find all .md files in this vault section
  while IFS= read -r -d '' md_file; do
    # Get relative path within the section
    rel_path="${md_file#"$vault_section"/}"
    # Change extension from .md to .mdx
    mdx_rel_path="${rel_path%.md}.mdx"
    target="$project_section/$mdx_rel_path"
    target_dir="$(dirname "$target")"

    if $DRY_RUN; then
      echo "    WOULD COPY: $rel_path -> $mdx_rel_path"
    else
      mkdir -p "$target_dir"
      cp "$md_file" "$target"
      echo "    COPIED: $rel_path -> $mdx_rel_path"
    fi
    ((copied++))
  done < <(find "$vault_section" -name '*.md' -type f -print0)
done

echo
if $DRY_RUN; then
  echo "Would copy $copied file(s). Run without --dry-run to apply."
else
  echo "Copied $copied file(s) from Obsidian to project."
fi
