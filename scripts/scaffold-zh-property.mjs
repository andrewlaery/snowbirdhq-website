#!/usr/bin/env node
// scaffold-zh-property.mjs <slug>
//
// Generate the four ZH MDX files for a property at
// content/docs/zh/properties/<slug>/. Reads the EN MDX as a template,
// replaces frontmatter with ZH equivalents, and adds lang="zh" to every
// component prop. Index file uses a fixed template (PropertyQuickInfo +
// PropertyLandingNav) since the EN catch-all renders the property landing
// specially and the EN index.mdx body isn't useful as a template.
//
// Run AFTER the per-property SOT translator:
//   node --env-file=.env.local scripts/translate-property.mjs <slug> zh
//   node scripts/scaffold-zh-property.mjs <slug>
//
// Idempotent — re-running overwrites existing ZH MDX. Use --dry-run to
// preview without writing.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Per-page ZH frontmatter. Identical for every property — these are page-
// type labels, not property facts.
const ZH_FRONTMATTER = {
  'welcome-house-rules': {
    title: '欢迎与住宿规则',
    description: '本房源的欢迎信息与住宿规则。',
  },
  'critical-info': {
    title: '重要信息',
    description: '紧急联系方式与基本安全信息。',
  },
  'user-instructions': {
    title: '使用说明',
    description: 'WiFi、电器、暖气与门禁的使用说明。',
  },
};

// Translations for free-text headings that appear inside EN MDX bodies.
// Components carry their content via lang="zh"; these are the literal
// markdown headings the EN files include between component invocations.
const HEADING_TRANSLATIONS = {
  '## Property-Specific Rules': '## 房源专属规则',
};

function buildZhBody(enBody) {
  // Translate literal markdown headings inserted between components.
  let body = enBody;
  for (const [en, zh] of Object.entries(HEADING_TRANSLATIONS)) {
    body = body.split(en).join(zh);
  }
  // Add lang="zh" to every component invocation.
  // Match self-closing component tags `<Component slug="..." />` and add
  // lang="zh" before the closing /. Skip components that already have lang.
  // Self-closing with no attrs (e.g. `<HouseRulesBase />`) is also handled.
  body = body.replace(
    /<([A-Z][A-Za-z0-9]*)(\s+[^/>]*?)?\s*\/>/g,
    (full, name, attrs) => {
      if (attrs && /\blang\s*=/.test(attrs)) return full;
      const trimmed = (attrs ?? '').trim();
      return trimmed
        ? `<${name} ${trimmed} lang="zh" />`
        : `<${name} lang="zh" />`;
    },
  );
  return body;
}

function rewriteFrontMatter(text, fm) {
  const fmText = `---
title: "${fm.title}"
description: "${fm.description}"
---`;
  // Replace the first frontmatter block.
  const m = text.match(/^---\n[\s\S]*?\n---/);
  if (!m) return fmText + '\n\n' + text.trim() + '\n';
  return fmText + text.slice(m[0].length);
}

function scaffoldPage(slug, page, dryRun) {
  const enPath = join(REPO, 'content', 'docs', 'properties', slug, `${page}.mdx`);
  const zhPath = join(REPO, 'content', 'docs', 'zh', 'properties', slug, `${page}.mdx`);
  if (!existsSync(enPath)) {
    console.log(`  skip ${page} — EN source missing`);
    return;
  }
  const enText = readFileSync(enPath, 'utf-8');
  const fm = ZH_FRONTMATTER[page];
  const withFm = rewriteFrontMatter(enText, fm);
  const zhText = buildZhBody(withFm);
  if (dryRun) {
    console.log(`  [dry-run] would write ${zhPath}`);
    return;
  }
  mkdirSync(dirname(zhPath), { recursive: true });
  writeFileSync(zhPath, zhText, 'utf-8');
  console.log(`  ✓ ${page}.mdx`);
}

function scaffoldIndex(slug, dryRun) {
  const identityPath = join(
    REPO,
    'data',
    'sot',
    'properties',
    slug,
    'zh',
    'identity.yaml',
  );
  let displayName = slug;
  if (existsSync(identityPath)) {
    try {
      const identity = yaml.load(readFileSync(identityPath, 'utf-8'));
      if (identity?.display_name) displayName = identity.display_name;
    } catch {
      // fall through with slug as displayName
    }
  } else {
    console.log(
      `  warn: ${identityPath} missing — index.mdx will use the slug as display name. ` +
        `Run translate-property.mjs <slug> zh first.`,
    );
  }
  const zhPath = join(REPO, 'content', 'docs', 'zh', 'properties', slug, 'index.mdx');
  const text = `---
title: "${displayName} · 住客指南"
description: "由 SnowbirdHQ 提供的中文版住客指南。"
---

<PropertyQuickInfo slug="${slug}" lang="zh" />

<PropertyLandingNav slug="${slug}" lang="zh" />
`;
  if (dryRun) {
    console.log(`  [dry-run] would write ${zhPath}`);
    return;
  }
  mkdirSync(dirname(zhPath), { recursive: true });
  writeFileSync(zhPath, text, 'utf-8');
  console.log(`  ✓ index.mdx`);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const slug = args.find((a) => !a.startsWith('--'));
  if (!slug) {
    console.error('Usage: scaffold-zh-property.mjs <slug> [--dry-run]');
    process.exit(2);
  }

  console.log(`Scaffolding ZH MDX for ${slug}…`);
  scaffoldIndex(slug, dryRun);
  for (const page of Object.keys(ZH_FRONTMATTER)) {
    scaffoldPage(slug, page, dryRun);
  }
  console.log(
    dryRun
      ? `Done (dry-run).`
      : `Done. Verify locally: http://localhost:3000/docs/zh/properties/${slug}`,
  );
}

main();
