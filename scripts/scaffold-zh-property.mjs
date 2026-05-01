#!/usr/bin/env node
// scaffold-zh-property.mjs <slug> [--lang=<lang>]
//
// Generate the four locale MDX files for a property at
// content/docs/<lang>/properties/<slug>/. Reads the EN MDX as a template,
// replaces frontmatter with the locale's equivalents, and adds lang="<lang>"
// to every component prop. Index file uses a fixed template
// (PropertyQuickInfo + PropertyLandingNav).
//
// Default lang is 'zh' for back-compat with existing callers.
//
// Run AFTER the per-property SOT translator:
//   node --env-file=.env.local scripts/translate-property.mjs <slug> <lang>
//   node scripts/scaffold-zh-property.mjs <slug> --lang=<lang>
//
// Idempotent — re-running overwrites existing locale MDX. Use --dry-run to
// preview without writing.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Per-page locale frontmatter. Identical for every property — these are
// page-type labels, not property facts.
const FRONTMATTER_BY_LANG = {
  zh: {
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
  },
  ja: {
    'welcome-house-rules': {
      title: 'ようこそ・ハウスルール',
      description: '本物件のウェルカム情報とハウスルール。',
    },
    'critical-info': {
      title: '重要なお知らせ',
      description: '緊急連絡先と基本的な安全情報。',
    },
    'user-instructions': {
      title: 'ご利用案内',
      description: 'Wi-Fi、家電、暖房、入退室方法のご案内。',
    },
  },
};

// Translations for free-text headings that appear inside EN MDX bodies.
// Components carry their content via lang="<lang>"; these are the literal
// markdown headings the EN files include between component invocations.
const HEADING_TRANSLATIONS_BY_LANG = {
  zh: {
    '## Property-Specific Rules': '## 房源专属规则',
  },
  ja: {
    '## Property-Specific Rules': '## 物件固有のルール',
  },
};

const INDEX_TEMPLATE_BY_LANG = {
  zh: {
    titleSuffix: ' · 住客指南',
    description: '由 SnowbirdHQ 提供的中文版住客指南。',
  },
  ja: {
    titleSuffix: ' · ゲストガイド',
    description: 'SnowbirdHQ がお届けする日本語ゲストガイド。',
  },
};

function buildLocaleBody(enBody, lang) {
  const headings = HEADING_TRANSLATIONS_BY_LANG[lang] ?? {};
  let body = enBody;
  for (const [en, translated] of Object.entries(headings)) {
    body = body.split(en).join(translated);
  }
  // Add lang="<lang>" to every component invocation.
  // Match self-closing component tags `<Component slug="..." />` and add
  // lang="<lang>" before the closing /. Skip components that already have
  // lang. Self-closing with no attrs (e.g. `<HouseRulesBase />`) is also
  // handled.
  body = body.replace(
    /<([A-Z][A-Za-z0-9]*)(\s+[^/>]*?)?\s*\/>/g,
    (full, name, attrs) => {
      if (attrs && /\blang\s*=/.test(attrs)) return full;
      const trimmed = (attrs ?? '').trim();
      return trimmed
        ? `<${name} ${trimmed} lang="${lang}" />`
        : `<${name} lang="${lang}" />`;
    },
  );
  return body;
}

function rewriteFrontMatter(text, fm) {
  // JSON.stringify produces a valid double-quoted YAML string with all
  // inner quotes/backslashes properly escaped — handles TODO placeholders
  // and any other awkward characters in display names.
  const fmText = `---
title: ${JSON.stringify(fm.title)}
description: ${JSON.stringify(fm.description)}
---`;
  // Replace the first frontmatter block.
  const m = text.match(/^---\n[\s\S]*?\n---/);
  if (!m) return fmText + '\n\n' + text.trim() + '\n';
  return fmText + text.slice(m[0].length);
}

function scaffoldPage(slug, page, lang, frontmatter, dryRun) {
  const enPath = join(REPO, 'content', 'docs', 'properties', slug, `${page}.mdx`);
  const localePath = join(
    REPO,
    'content',
    'docs',
    lang,
    'properties',
    slug,
    `${page}.mdx`,
  );
  if (!existsSync(enPath)) {
    console.log(`  skip ${page} — EN source missing`);
    return;
  }
  const enText = readFileSync(enPath, 'utf-8');
  const fm = frontmatter[page];
  const withFm = rewriteFrontMatter(enText, fm);
  const localeText = buildLocaleBody(withFm, lang);
  if (dryRun) {
    console.log(`  [dry-run] would write ${localePath}`);
    return;
  }
  mkdirSync(dirname(localePath), { recursive: true });
  writeFileSync(localePath, localeText, 'utf-8');
  console.log(`  ✓ ${page}.mdx`);
}

function scaffoldIndex(slug, lang, dryRun) {
  const identityPath = join(
    REPO,
    'data',
    'sot',
    'properties',
    slug,
    lang,
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
        `Run translate-property.mjs <slug> ${lang} first.`,
    );
  }
  const localePath = join(
    REPO,
    'content',
    'docs',
    lang,
    'properties',
    slug,
    'index.mdx',
  );
  const tpl = INDEX_TEMPLATE_BY_LANG[lang];
  if (!tpl) {
    throw new Error(`No index template for lang=${lang}`);
  }
  const title = `${displayName}${tpl.titleSuffix}`;
  const description = tpl.description;
  const text = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---

<PropertyQuickInfo slug="${slug}" lang="${lang}" />

<PropertyLandingNav slug="${slug}" lang="${lang}" />
`;
  if (dryRun) {
    console.log(`  [dry-run] would write ${localePath}`);
    return;
  }
  mkdirSync(dirname(localePath), { recursive: true });
  writeFileSync(localePath, text, 'utf-8');
  console.log(`  ✓ index.mdx`);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const langArg = args.find((a) => a.startsWith('--lang='));
  const lang = langArg ? langArg.split('=')[1] : 'zh';
  const slug = args.find((a) => !a.startsWith('--'));
  if (!slug) {
    console.error(
      'Usage: scaffold-zh-property.mjs <slug> [--lang=<lang>] [--dry-run]',
    );
    process.exit(2);
  }
  if (!FRONTMATTER_BY_LANG[lang]) {
    console.error(
      `Unknown lang=${lang}. Supported: ${Object.keys(FRONTMATTER_BY_LANG).join(', ')}`,
    );
    process.exit(2);
  }

  console.log(`Scaffolding ${lang} MDX for ${slug}…`);
  scaffoldIndex(slug, lang, dryRun);
  for (const page of Object.keys(FRONTMATTER_BY_LANG[lang])) {
    scaffoldPage(slug, page, lang, FRONTMATTER_BY_LANG[lang], dryRun);
  }

  if (!dryRun) {
    // Regenerate the LocaleSwitcher's translated-slugs list so the new
    // property is discoverable without a manual edit.
    spawnSync(
      'node',
      [join(REPO, 'scripts', 'list-translated-properties.mjs')],
      { stdio: 'inherit' },
    );
  }

  const previewPath =
    lang === 'zh'
      ? `/docs/zh/properties/${slug}`
      : lang === 'ja'
        ? `/docs/ja/properties/${slug}`
        : `/docs/${lang}/properties/${slug}`;
  console.log(
    dryRun
      ? `Done (dry-run).`
      : `Done. Verify locally: http://localhost:3000${previewPath}`,
  );
}

main();
