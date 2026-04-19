#!/usr/bin/env bash
set -euo pipefail

# Sync BCampX-formatted property compendiums from an Obsidian vault into
# content/docs/properties/{slug}/ as .mdx files.
#
# Vault layout (source of truth):
#   $VAULT/SnowbirdHQ/Property/{PropertyName}/
#     1.0_{Name}_ Landing Page.md
#     1.1_{Name}_ Welcome And House Rules.md
#     1.2_{Name}_ User Instructions.md
#     1.3_{Name}_ Critical And Essential Information.md
#   $VAULT/SnowbirdHQ/Property/_General/Queenstown Insights.md
#
# Mapping:
#   1.0 -> index.mdx
#   1.1 -> welcome-house-rules.mdx
#   1.2 -> user-instructions.mdx
#   1.3 -> critical-info.mdx
#   _General/Queenstown Insights.md -> content/docs/queenstown-insights.mdx
#
# Usage:
#   ./scripts/sync-property-compendium.sh                       # sync all properties
#   ./scripts/sync-property-compendium.sh --dry-run             # preview only
#   ./scripts/sync-property-compendium.sh --only 7-suburb       # single slug
#   ./scripts/sync-property-compendium.sh --vault /path/to/vault

VAULT="${COMPENDIUM_VAULT:-$HOME/Documents/andrewlaery}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_PROPERTIES="$PROJECT_DIR/content/docs/properties"
CONTENT_DOCS="$PROJECT_DIR/content/docs"

DRY_RUN=false
ONLY_SLUG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --only) ONLY_SLUG="${2:-}"; shift 2 ;;
    --vault) VAULT="${2:-}"; shift 2 ;;
    -h|--help)
      sed -n '3,25p' "$0"; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

PROPERTY_ROOT="$VAULT/SnowbirdHQ/Property"

if [[ ! -d "$PROPERTY_ROOT" ]]; then
  echo "ERROR: vault property root not found: $PROPERTY_ROOT" >&2
  echo "Set COMPENDIUM_VAULT or pass --vault <path>." >&2
  exit 1
fi

if [[ ! -d "$CONTENT_PROPERTIES" ]]; then
  echo "ERROR: content dir not found: $CONTENT_PROPERTIES" >&2
  exit 1
fi

$DRY_RUN && echo "[DRY RUN] No files will be modified."
echo "Vault:   $PROPERTY_ROOT"
echo "Target:  $CONTENT_PROPERTIES"
[[ -n "$ONLY_SLUG" ]] && echo "Filter:  --only $ONLY_SLUG"
echo

copy_file() {
  local src="$1" dst="$2" title="$3" desc="$4" slug="$5"
  if $DRY_RUN; then
    echo "    WOULD COPY: $(basename "$src") -> ${dst#"$PROJECT_DIR"/}"
  else
    mkdir -p "$(dirname "$dst")"
    inject_frontmatter "$src" "$title" "$desc" "$dst" "$slug"
    echo "    COPIED: $(basename "$src") -> ${dst#"$PROJECT_DIR"/}"
  fi
}

# Rewrite short-URL nav links so migrated landing pages stay inside the portal.
# Applied to every file — no-op on pages that don't contain these URLs.
# Uses absolute /docs paths (not ./relative) so links work regardless of the
# visible URL's trailing-slash state (the docs.snowbirdhq.com redirect strips
# /docs from the URL, which would break relative links like ./foo).
#
# The $SLUG variable is expected to be set by the caller for per-property paths.
rewrite_compendium_urls() {
  local slug="${1:-SLUG_PLACEHOLDER}"
  sed -E \
    -e "s|https?://go\\.bcampx\\.com/[A-Za-z0-9_-]+-HouseRules|/docs/properties/$slug/welcome-house-rules|g" \
    -e "s|https?://go\\.bcampx\\.com/[A-Za-z0-9_-]+-UserInstructions|/docs/properties/$slug/user-instructions|g" \
    -e "s|https?://go\\.bcampx\\.com/[A-Za-z0-9_-]+-CriticalAndEssentialInformation|/docs/properties/$slug/critical-info|g" \
    -e 's|https?://go\.bcampx\.com/SnowbirdHQ-QueenstownInsights|/docs/queenstown-insights|g'
}

# Copy src -> dst, ensuring frontmatter has title and description,
# and rewriting short-URL nav links.
# If source already has frontmatter: inject missing title/description only.
# If source has no frontmatter: prepend a new one.
inject_frontmatter() {
  local src="$1" title="$2" desc="$3" dst="$4" slug="$5"
  local first_line
  first_line="$(head -n1 "$src")"
  if [[ "$first_line" == "---" ]]; then
    awk -v title="$title" -v desc="$desc" '
      BEGIN { passed_fm=0; have_title=0; have_desc=0 }
      NR==1 { print; next }
      passed_fm==0 && /^---$/ {
        if (!have_title) print "title: \"" title "\""
        if (!have_desc) print "description: \"" desc "\""
        print
        passed_fm=1
        next
      }
      passed_fm==0 {
        if ($0 ~ /^title:[[:space:]]/) have_title=1
        if ($0 ~ /^description:[[:space:]]/) have_desc=1
      }
      { print }
    ' "$src" | rewrite_compendium_urls "$slug" > "$dst"
  else
    {
      echo "---"
      echo "title: \"$title\""
      echo "description: \"$desc\""
      echo "---"
      echo ""
      cat "$src"
    } | rewrite_compendium_urls "$slug" > "$dst"
  fi
}

# Title/description by target filename.
frontmatter_for() {
  local target="$1" display="$2"
  case "$target" in
    index.mdx)
      FM_TITLE="$display — Guest Guide"
      FM_DESC="Guest guide for $display." ;;
    welcome-house-rules.mdx)
      FM_TITLE="Welcome & House Rules"
      FM_DESC="Welcome message and house rules for your stay." ;;
    user-instructions.mdx)
      FM_TITLE="User Instructions"
      FM_DESC="Instructions for Wi-Fi, appliances, heating and more." ;;
    critical-info.mdx)
      FM_TITLE="Critical & Essential Information"
      FM_DESC="Emergency contacts and essential safety information." ;;
    queenstown-insights.mdx)
      FM_TITLE="Queenstown Insights"
      FM_DESC="Local recommendations and insights for Queenstown." ;;
    *)
      FM_TITLE="$display"
      FM_DESC="" ;;
  esac
}

# "7-Suburb" -> "7 Suburb"; "6-25-Belfast" -> "6/25 Belfast"
display_name() {
  local raw="$1"
  case "$raw" in
    6-25-Belfast) echo "6/25 Belfast" ;;
    *) echo "${raw//-/ }" ;;
  esac
}

map_target() {
  local filename="$1"
  case "$filename" in
    1.0_*" Landing Page.md")                          echo "index.mdx" ;;
    1.1_*" Welcome And House Rules.md")               echo "welcome-house-rules.mdx" ;;
    1.2_*" User Instructions.md")                     echo "user-instructions.mdx" ;;
    1.3_*" Critical And Essential Information.md")   echo "critical-info.mdx" ;;
    *) echo "" ;;
  esac
}

copied=0
skipped=0
rejected=0

shopt -s nullglob
for dir in "$PROPERTY_ROOT"/*/; do
  name="$(basename "$dir")"
  [[ "$name" == "_General" ]] && continue

  slug="$(echo "$name" | tr '[:upper:]' '[:lower:]')"

  if [[ -n "$ONLY_SLUG" && "$slug" != "$ONLY_SLUG" ]]; then
    continue
  fi

  if [[ ! -d "$CONTENT_PROPERTIES/$slug" ]]; then
    echo "  REJECT: $name -> $slug (no content/docs/properties/$slug/ — check typo)"
    ((rejected++)) || true
    continue
  fi

  echo "  Property: $name -> $slug"
  display="$(display_name "$name")"

  found_any=false
  for f in "$dir"*.md; do
    [[ -e "$f" ]] || continue
    fname="$(basename "$f")"
    target_name="$(map_target "$fname")"
    if [[ -z "$target_name" ]]; then
      # silent skip for 0.0 / notes etc. — keep output clean
      continue
    fi
    found_any=true
    frontmatter_for "$target_name" "$display"
    copy_file "$f" "$CONTENT_PROPERTIES/$slug/$target_name" "$FM_TITLE" "$FM_DESC" "$slug"
    ((copied++)) || true
  done

  if ! $found_any; then
    echo "    (no compendium files for $slug)"
    ((skipped++)) || true
  fi
done

# Shared Queenstown Insights
if [[ -z "$ONLY_SLUG" || "$ONLY_SLUG" == "queenstown-insights" ]]; then
  qi_src="$PROPERTY_ROOT/_General/Queenstown Insights.md"
  if [[ -f "$qi_src" ]]; then
    echo "  Shared: Queenstown Insights"
    frontmatter_for "queenstown-insights.mdx" "Queenstown Insights"
    copy_file "$qi_src" "$CONTENT_DOCS/queenstown-insights.mdx" "$FM_TITLE" "$FM_DESC" ""
    ((copied++)) || true
  else
    echo "  (no _General/Queenstown Insights.md found)"
  fi
fi

echo
if $DRY_RUN; then
  echo "Would copy $copied file(s). Skipped: $skipped. Rejected: $rejected."
  echo "Run without --dry-run to apply."
else
  echo "Copied $copied file(s). Skipped: $skipped. Rejected: $rejected."
fi
