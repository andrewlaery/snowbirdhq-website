#!/usr/bin/env bash
set -euo pipefail

# Sync MDX content FROM content/docs/ TO an Obsidian vault
#
# Copies .mdx files as .md (Obsidian's format).
# Skips meta.json files — these are project-only (Fumadocs config).
#
# Usage:
#   ./scripts/sync-to-obsidian.sh              # full sync
#   ./scripts/sync-to-obsidian.sh --dry-run    # preview only

# --- Configuration ---
# Set OBSIDIAN_VAULT env var or edit this default path
OBSIDIAN_VAULT="${OBSIDIAN_VAULT:-$HOME/Obsidian/SnowbirdHQ}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_DIR="$PROJECT_DIR/content/docs"

# Sections to sync
SECTIONS=("properties" "owner-docs" "internal")

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be modified."
  echo
fi

# --- Validation ---
if [[ ! -d "$CONTENT_DIR" ]]; then
  echo "ERROR: Content directory not found at: $CONTENT_DIR"
  exit 1
fi

# Create vault root if it doesn't exist (first-time setup)
if [[ ! -d "$OBSIDIAN_VAULT" ]] && ! $DRY_RUN; then
  echo "Creating Obsidian vault directory: $OBSIDIAN_VAULT"
  mkdir -p "$OBSIDIAN_VAULT"
fi

echo "Syncing FROM project docs: $CONTENT_DIR"
echo "          TO Obsidian vault: $OBSIDIAN_VAULT"
echo

copied=0

for section in "${SECTIONS[@]}"; do
  project_section="$CONTENT_DIR/$section"
  vault_section="$OBSIDIAN_VAULT/$section"

  if [[ ! -d "$project_section" ]]; then
    echo "  SKIP section '$section' — not found in project"
    continue
  fi

  echo "  Section: $section"

  # Find all .mdx files, skip meta.json
  while IFS= read -r -d '' mdx_file; do
    rel_path="${mdx_file#"$project_section"/}"
    # Change extension from .mdx to .md
    md_rel_path="${rel_path%.mdx}.md"
    target="$vault_section/$md_rel_path"
    target_dir="$(dirname "$target")"

    if $DRY_RUN; then
      echo "    WOULD COPY: $rel_path -> $md_rel_path"
    else
      mkdir -p "$target_dir"
      cp "$mdx_file" "$target"
      echo "    COPIED: $rel_path -> $md_rel_path"
    fi
    ((copied++))
  done < <(find "$project_section" -name '*.mdx' -type f -print0)
done

echo
if $DRY_RUN; then
  echo "Would copy $copied file(s). Run without --dry-run to apply."
else
  echo "Copied $copied file(s) from project to Obsidian vault."
fi
