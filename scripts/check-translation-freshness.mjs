#!/usr/bin/env node
// check-translation-freshness.mjs
//
// Walks every `.translation-manifest.json` under data/sot/ and verifies that
// each translated file's recorded `sourceHash` matches the current canonical
// source. Exits non-zero on drift so Vercel CI fails when someone edits an EN
// source without re-running the translator.
//
// Manifest schema (per file in directory):
//   {
//     "<translated-filename>": {
//       "sourceHash": "<sha256 of canonical source>",
//       "sourcePath": "<absolute or relative path to source>",
//       "translatedAt": "<ISO timestamp>",
//       "model": "<model id>"
//     }
//   }

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOT_ROOT = join(REPO_ROOT, 'data', 'sot');

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function findManifests(root) {
  const manifests = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.translation-manifest.json') {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...findManifests(path));
    } else if (entry.name === '.translation-manifest.json') {
      manifests.push(path);
    }
  }
  return manifests;
}

function resolveSourcePath(manifestDir, recordedSourcePath, translatedFilename) {
  // Modern records carry an absolute or relative sourcePath.
  if (recordedSourcePath) {
    const candidate = recordedSourcePath.startsWith('/')
      ? recordedSourcePath
      : resolve(manifestDir, recordedSourcePath);
    if (existsSync(candidate)) return candidate;
  }
  // Legacy per-property manifests: source is one directory up with same filename.
  const fallback = resolve(manifestDir, '..', translatedFilename);
  if (existsSync(fallback)) return fallback;
  return null;
}

function main() {
  if (!existsSync(SOT_ROOT)) {
    console.log('[check-translations] data/sot/ not present — skip');
    return;
  }
  const manifests = findManifests(SOT_ROOT);
  let stale = 0;
  let missing = 0;
  let ok = 0;
  const issues = [];

  for (const manifestPath of manifests) {
    const manifestDir = dirname(manifestPath);
    let entries;
    try {
      entries = JSON.parse(readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      issues.push(`  parse error: ${relative(REPO_ROOT, manifestPath)} (${e.message})`);
      missing++;
      continue;
    }

    for (const [filename, record] of Object.entries(entries)) {
      const translatedPath = join(manifestDir, filename);
      if (!existsSync(translatedPath)) {
        issues.push(`  missing translation: ${relative(REPO_ROOT, translatedPath)}`);
        missing++;
        continue;
      }
      const sourcePath = resolveSourcePath(manifestDir, record.sourcePath, filename);
      if (!sourcePath) {
        issues.push(
          `  source not found for ${relative(REPO_ROOT, translatedPath)} (recorded: ${record.sourcePath ?? '<none>'})`,
        );
        missing++;
        continue;
      }
      const hash = sha256(readFileSync(sourcePath, 'utf8'));
      if (hash !== record.sourceHash) {
        issues.push(
          `  STALE: ${relative(REPO_ROOT, sourcePath)} → ${relative(REPO_ROOT, translatedPath)}`,
        );
        stale++;
      } else {
        ok++;
      }
    }
  }

  console.log(
    `[check-translations] ${ok} fresh, ${stale} stale, ${missing} missing across ${manifests.length} manifest(s)`,
  );
  if (stale > 0 || missing > 0) {
    console.error('\nIssues:');
    for (const issue of issues) console.error(issue);
    console.error(
      '\nTo fix: run the translator for the affected slug(s)/file(s):',
    );
    console.error(
      '  per-property:  node --env-file=.env.local scripts/translate-property.mjs <slug> <lang>',
    );
    console.error(
      '  single file:   node --env-file=.env.local scripts/translate-property.mjs --file <src> <dest> <lang>',
    );
    process.exit(1);
  }
}

main();
