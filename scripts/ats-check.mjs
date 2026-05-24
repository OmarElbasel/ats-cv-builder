#!/usr/bin/env node
// Quick ATS pitfall checker on the built HTML in dist/.
// Run `pnpm build` first, then `node scripts/ats-check.mjs`.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');

if (!existsSync(distDir)) {
  console.error('No dist/ folder. Run `pnpm build` first.');
  process.exit(1);
}

const indexHtml = join(distDir, 'index.html');
const html = readFileSync(indexHtml, 'utf8');

const findings = [];

if (/<table[\s>]/i.test(html)) findings.push('Contains <table> — many ATS parsers mangle these.');
if (/<img[\s>]/i.test(html)) findings.push('Contains <img> — ensure no text is rendered as image.');
if (/[  ]/.test(html)) findings.push('Contains unicode line/paragraph separators (U+2028/U+2029).');
if (/columns?\s*:\s*[2-9]/i.test(html)) findings.push('CSS multi-column detected — linearization is unreliable.');

const assets = join(distDir, 'assets');
if (existsSync(assets)) {
  const fontFiles = readdirSync(assets).filter(f => /\.(woff2?|ttf|otf)$/i.test(f));
  if (fontFiles.length === 0) {
    // OK — system fonts.
  }
}

const TEXT = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const email = TEXT.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
const phone = TEXT.match(/\+?\d[\d\s().-]{7,}\d/);
if (!email) findings.push('No email detected in plain text. ATS may strip if it sits next to an icon-only span.');
if (!phone) findings.push('No phone detected in plain text.');

if (findings.length === 0) {
  console.log('✓ ATS check passed (no obvious pitfalls).');
} else {
  console.log('ATS check findings:');
  for (const f of findings) console.log(`  - ${f}`);
  process.exitCode = 1;
}
