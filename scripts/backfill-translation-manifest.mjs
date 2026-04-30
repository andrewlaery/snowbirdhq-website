#!/usr/bin/env node
// One-shot: backfill .translation-manifest.json for translated files that
// were created before the manifest tracking was added. Records the current
// source hash so the freshness check has a baseline. Safe to re-run.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = (t) => createHash('sha256').update(t).digest('hex');

function backfillDir(srcDir, destSubdir, model = 'claude-sonnet-4-6') {
  const destDir = join(srcDir, destSubdir);
  if (!existsSync(destDir)) return 0;
  const manifestPath = join(destDir, '.translation-manifest.json');
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {};
  let added = 0;
  for (const f of readdirSync(destDir)) {
    if (f.startsWith('.')) continue;
    const destFile = join(destDir, f);
    const srcFile = join(srcDir, f);
    if (!existsSync(srcFile)) continue;
    if (!statSync(destFile).isFile()) continue;
    if (manifest[f]?.sourceHash) continue;
    const srcText = readFileSync(srcFile, 'utf8');
    manifest[f] = {
      sourceHash: sha256(srcText),
      sourcePath: relative(destDir, srcFile),
      translatedAt: new Date().toISOString(),
      model,
      backfilled: true,
    };
    added++;
  }
  if (added > 0) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`  ${added} entries → ${relative(REPO, manifestPath)}`);
  }
  return added;
}

let total = 0;
total += backfillDir(join(REPO, 'data/sot/_shared'), 'zh');
total += backfillDir(join(REPO, 'data/sot/_appliances'), 'zh');
console.log(`Total backfilled: ${total}`);
