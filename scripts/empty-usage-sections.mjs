#!/usr/bin/env node
// empty-usage-sections.mjs <slug> [<slug> …]
//
// One-shot cleanup. Removes the `usage_sections:` block from
// `data/sot/properties/<slug>/facts.yaml::exceptions`. Used after
// PR #11 restored rich MDX bodies for the 11 properties that had
// been hollowed out by cd1311e — the YAML was a duplicate copy of
// the same content. PropertyUsageSections is no longer rendered
// from those MDX files, so the YAML is unrendered cruft.
//
// AMA chat continues to read the MDX bodies via loadPropertyDocs()
// (src/lib/chat/property-context.ts), so removing the YAML version
// does NOT degrade the AI's context.
//
// Operates on YAML in-place using line-based heuristics rather
// than full YAML parse/dump, to keep diffs small and preserve
// existing formatting/comments.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function leadingSpaces(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function emptyUsageSections(yamlText) {
  const lines = yamlText.split('\n');
  const out = [];
  let inUsageSections = false;
  let usageIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inUsageSections) {
      // Empty/blank lines while in the section: drop them too.
      if (line.trim() === '') continue;
      const indent = leadingSpaces(line);
      // Continue dropping while the line is indented deeper than the
      // `usage_sections:` key itself.
      if (indent > usageIndent) continue;
      // Reached a sibling or higher-level key → exit the section.
      inUsageSections = false;
    }

    // Match `<indent>usage_sections:` (with optional value/comment).
    const m = line.match(/^(\s*)usage_sections:/);
    if (m) {
      inUsageSections = true;
      usageIndent = m[1].length;
      continue; // don't emit this line
    }

    out.push(line);
  }

  // Tidy: collapse runs of 3+ blank lines down to 2.
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function processSlug(slug) {
  const path = join(REPO, 'data', 'sot', 'properties', slug, 'facts.yaml');
  if (!existsSync(path)) {
    console.log(`  ! ${slug} — facts.yaml missing, skip`);
    return false;
  }
  const before = readFileSync(path, 'utf-8');
  const after = emptyUsageSections(before);
  if (before === after) {
    console.log(`  - ${slug} — no usage_sections to remove`);
    return false;
  }
  writeFileSync(path, after, 'utf-8');
  const beforeBytes = Buffer.byteLength(before, 'utf-8');
  const afterBytes = Buffer.byteLength(after, 'utf-8');
  console.log(`  ✓ ${slug} — removed ${beforeBytes - afterBytes} bytes`);
  return true;
}

function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error('Usage: empty-usage-sections.mjs <slug> [<slug> …]');
    process.exit(2);
  }
  let touched = 0;
  for (const slug of slugs) {
    if (processSlug(slug)) touched++;
  }
  console.log(`Done. ${touched}/${slugs.length} facts.yaml files modified.`);
}

main();
