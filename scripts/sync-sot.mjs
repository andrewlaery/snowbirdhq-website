#!/usr/bin/env node
/**
 * Sync SOT data from `_shared/<root>/` into the website repo at
 * `data/sot/<root>/`. Run before commits to refresh the vendored copy.
 *
 * Roots synced:
 *   - properties/   (per-property folders consumed by Property* components)
 *   - queenstown/   (Queenstown Insights and other shared local data)
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

import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

/** SOT roots to sync. Each entry is a sub-directory of `_shared/`. */
const ROOTS = ['properties', 'queenstown'];

function findSharedRoot() {
  if (process.env.SHARED_REPO) {
    const p = resolve(process.env.SHARED_REPO);
    if (ROOTS.some((r) => existsSync(join(p, r)))) return p;
    return null;
  }
  const candidates = [
    resolve(REPO_ROOT, '..', '..', '_shared'),
    resolve(REPO_ROOT, '..', '_shared'),
  ];
  for (const c of candidates) {
    if (ROOTS.some((r) => existsSync(join(c, r)))) return c;
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

function syncProperties(sourceDir, targetDir) {
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

  const slugs = readdirSync(sourceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);

  if (slugs.length === 0) {
    console.log(`  (no property slugs found in ${sourceDir})`);
    return;
  }

  console.log(`  Syncing ${slugs.length} properties`);
  for (const slug of slugs) {
    copyRecursive(join(sourceDir, slug), join(targetDir, slug));
    console.log(`    ${slug}`);
  }
}

function syncFlat(sourceDir, targetDir, label) {
  copyRecursive(sourceDir, targetDir);
  console.log(`  Synced ${label}`);
}

function main() {
  const sharedRoot = findSharedRoot();
  if (!sharedRoot) {
    const anyVendored = ROOTS.some((r) => existsSync(join(REPO_ROOT, 'data', 'sot', r)));
    if (anyVendored) {
      console.log(`[sync-sot] _shared not available — using vendored copy at data/sot/.`);
      return;
    }
    console.warn(
      `[sync-sot] _shared not available AND no vendored copy at data/sot/. ` +
        `Components that read SOT will fail at build time.`,
    );
    return;
  }

  console.log(`[sync-sot] Source: ${sharedRoot}`);
  for (const root of ROOTS) {
    const sourceDir = join(sharedRoot, root);
    if (!existsSync(sourceDir)) {
      console.log(`  (skip ${root}/ — not present in source)`);
      continue;
    }
    const targetDir = join(REPO_ROOT, 'data', 'sot', root);
    console.log(`[${root}]`);
    if (root === 'properties') {
      syncProperties(sourceDir, targetDir);
    } else {
      syncFlat(sourceDir, targetDir, root);
    }
  }
  console.log(`[sync-sot] Done. Vendored copy at data/sot/`);
}

main();
