#!/usr/bin/env node
// translate-property.mjs
//
// Translate a property's SOT files (guest_copy.md, facts.yaml, identity.yaml)
// to a target language. Re-runnable: skips files whose source SHA-256 hasn't
// changed since the last run.
//
// Usage:
//   node --env-file=.env.local scripts/translate-property.mjs <slug> [lang]
//   node --env-file=.env.local scripts/translate-property.mjs 7-suburb zh
//
// Or translate an arbitrary file (used to translate hard-coded UI strings):
//   node --env-file=.env.local scripts/translate-property.mjs --file <input> <output> [lang]

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const MODEL_ID = 'claude-sonnet-4-6';
const REPO_ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOT_ROOT = join(REPO_ROOT, 'data', 'sot', 'properties');

const LANG_NAMES = { zh: 'Simplified Chinese (简体中文)' };

function buildPrompt(lang, kind, content) {
  const targetName = LANG_NAMES[lang] ?? lang;
  const placeNames =
    lang === 'zh'
      ? '皇后镇 (Queenstown), 新西兰 (New Zealand), 奥塔哥 (Otago), 弗兰克顿 (Frankton).'
      : 'use natural local equivalents.';
  const formAddress = lang === 'zh' ? '您' : 'the guest politely';
  const preserve =
    kind === 'yaml'
      ? 'Preserve YAML structure exactly: translate ONLY string values; never translate keys, numbers, booleans, dates, or list-of-string slugs that look like identifiers (e.g. appliance model slugs like "bosch-pue611bb5"). If a value is empty or null, keep it as-is. Phone numbers, URLs, IDs, and access codes stay verbatim.'
      : 'Preserve all Markdown formatting: headings (##), bold (**), italics (_), lists (- / 1.), links [text](url), inline code, and blockquotes. Do not translate URL targets. Phone numbers, addresses (street numbers), and access codes stay verbatim.';
  return `You are a professional translator for New Zealand vacation-rental hospitality content, translating to ${targetName} for mainland readers.

Rules:
- Translate prose to natural, warm ${targetName}; address the guest as ${formAddress}.
- Place names: ${placeNames} Keep English for street addresses (e.g. "7 Suburb Street" stays as-is).
- ${preserve}
- Return ONLY the translated document — no commentary, no fences, no preamble.

Source:
<source>
${content}
</source>`;
}

function detectKind(filename) {
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';
  return 'markdown';
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

async function callClaude(prompt) {
  const { text, usage } = await generateText({
    model: anthropic(MODEL_ID),
    prompt,
    maxOutputTokens: 16000,
  });
  return { text: text.trim(), usage };
}

function stripFences(text) {
  // Defensive: if Sonnet wraps in fences despite instructions, strip them.
  const m = text.match(/^```(?:\w+)?\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : text;
}

async function translateFile(srcPath, destPath, lang, manifest) {
  const srcText = await readFile(srcPath, 'utf8');
  const hash = sha256(srcText);
  const filename = srcPath.split('/').pop();

  const manifestKey = filename;
  if (manifest[manifestKey]?.sourceHash === hash && existsSync(destPath)) {
    console.log(`  ✓ ${filename} — unchanged, skip`);
    return { skipped: true };
  }

  const kind = detectKind(filename);
  const prompt = buildPrompt(lang, kind, srcText);
  console.log(`  → ${filename} (${kind}, ${srcText.length} chars) translating…`);

  const { text, usage } = await callClaude(prompt);
  const cleaned = stripFences(text);

  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, cleaned, 'utf8');

  manifest[manifestKey] = {
    sourceHash: hash,
    translatedAt: new Date().toISOString(),
    model: MODEL_ID,
    inputTokens: usage?.inputTokens ?? null,
    outputTokens: usage?.outputTokens ?? null,
  };
  console.log(
    `  ✓ ${filename} (in=${usage?.inputTokens ?? '?'} out=${usage?.outputTokens ?? '?'})`,
  );
  return { skipped: false, usage };
}

async function translateProperty(slug, lang) {
  const srcDir = join(SOT_ROOT, slug);
  if (!existsSync(srcDir)) {
    console.error(`! SOT source missing: ${srcDir}`);
    process.exit(1);
  }
  const destDir = join(srcDir, lang);
  await mkdir(destDir, { recursive: true });

  const manifestPath = join(destDir, '.translation-manifest.json');
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {};

  const targets = ['identity.yaml', 'facts.yaml', 'guest_copy.md'];
  let total = { in: 0, out: 0 };
  for (const file of targets) {
    const srcPath = join(srcDir, file);
    if (!existsSync(srcPath)) {
      console.log(`  - ${file} — not present, skip`);
      continue;
    }
    const destPath = join(destDir, file);
    const result = await translateFile(srcPath, destPath, lang, manifest);
    if (!result.skipped && result.usage) {
      total.in += result.usage.inputTokens ?? 0;
      total.out += result.usage.outputTokens ?? 0;
    }
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `Done: slug=${slug} lang=${lang} totalInput=${total.in} totalOutput=${total.out}`,
  );
}

async function translateOneFile(srcPath, destPath, lang) {
  const srcText = await readFile(srcPath, 'utf8');
  const hash = sha256(srcText);
  const destDir = dirname(destPath);
  const manifestPath = join(destDir, '.translation-manifest.json');
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {};

  const filename = destPath.split('/').pop();
  if (manifest[filename]?.sourceHash === hash && existsSync(destPath)) {
    console.log(`✓ ${filename} — unchanged, skip`);
    return;
  }

  const kind = detectKind(srcPath);
  const prompt = buildPrompt(lang, kind, srcText);
  console.log(`Translating ${srcPath} → ${destPath} (${kind})…`);
  const { text, usage } = await callClaude(prompt);
  await mkdir(destDir, { recursive: true });
  await writeFile(destPath, stripFences(text), 'utf8');

  // Store sourcePath relative to the manifest directory so the freshness
  // check works in any checkout (Vercel CI included). Absolute paths from
  // a developer machine break the check on cloud builders.
  const { relative } = await import('node:path');
  manifest[filename] = {
    sourceHash: hash,
    sourcePath: relative(destDir, srcPath),
    translatedAt: new Date().toISOString(),
    model: MODEL_ID,
    inputTokens: usage?.inputTokens ?? null,
    outputTokens: usage?.outputTokens ?? null,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `Done. in=${usage?.inputTokens ?? '?'} out=${usage?.outputTokens ?? '?'}`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--file') {
    const [, src, dest, lang = 'zh'] = args;
    if (!src || !dest) {
      console.error('Usage: --file <input> <output> [lang]');
      process.exit(2);
    }
    await translateOneFile(resolve(src), resolve(dest), lang);
    return;
  }
  const [slug, lang = 'zh'] = args;
  if (!slug) {
    console.error('Usage: translate-property.mjs <slug> [lang]');
    process.exit(2);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set. Run with: node --env-file=.env.local …');
    process.exit(2);
  }
  await translateProperty(slug, lang);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
