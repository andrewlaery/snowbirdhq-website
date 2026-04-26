#!/usr/bin/env node
/**
 * Sync property SOT data from `_shared/properties/<slug>/` into the website
 * repo at `data/sot/properties/<slug>/`. Run before commits to refresh the
 * vendored copy.
 *
 * Source resolution:
 *   1. SHARED_REPO env var (absolute path to a cloned snowbirdhq-shared repo)
 *   2. ../../_shared (assumes website lives in __Production/__server-vercel/<repo>/)
 *   3. ../_shared
 *
 * Vercel CI can either:
 *   - Set SHARED_REPO to a path it has cloned in `installCommand`
 *   - Or rely on the data/sot/ files being committed (vendored copy)
 *
 * `vrm doctor` (in ota-manager) detects drift between the SOT and the
 * vendored copy here. Run before commits.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const TARGET_DIR = join(REPO_ROOT, 'data', 'sot', 'properties');

function findSharedRoot() {
  if (process.env.SHARED_REPO) {
    const p = resolve(process.env.SHARED_REPO);
    if (existsSync(join(p, 'properties'))) return p;
    return null;
  }
  const candidates = [
    resolve(REPO_ROOT, '..', '..', '_shared'),
    resolve(REPO_ROOT, '..', '_shared'),
  ];
  for (const c of candidates) {
    if (existsSync(join(c, 'properties'))) return c;
  }
  return null;
}

function copyRecursive(src, dst) {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'MIGRATION.md') continue;
    const srcPath = join(src, entry.name);
    const dstPath = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, dstPath);
    } else {
      copyFileSync(srcPath, dstPath);
    }
  }
}

function main() {
  const sharedRoot = findSharedRoot();
  if (!sharedRoot) {
    if (existsSync(TARGET_DIR)) {
      console.log(
        `[sync-sot] _shared not available — using vendored copy at data/sot/properties/.`,
      );
      return;
    }
    console.warn(
      `[sync-sot] _shared not available AND no vendored copy at data/sot/properties/. ` +
        `Components that read SOT will fail at build time.`,
    );
    return;
  }
  const sourceDir = join(sharedRoot, 'properties');

  if (!existsSync(TARGET_DIR)) mkdirSync(TARGET_DIR, { recursive: true });

  const slugs = readdirSync(sourceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);

  if (slugs.length === 0) {
    console.log(`No property slugs found in ${sourceDir}`);
    return;
  }

  console.log(`Syncing ${slugs.length} properties from ${sharedRoot}`);
  for (const slug of slugs) {
    const src = join(sourceDir, slug);
    const dst = join(TARGET_DIR, slug);
    copyRecursive(src, dst);
    console.log(`  ${slug}`);
  }
  console.log(`Done. Vendored copy at data/sot/properties/`);
}

main();
