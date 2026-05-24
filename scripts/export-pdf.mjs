#!/usr/bin/env node
// Export the running dev/preview server to a PDF named for the active profile.
// Requires puppeteer: `pnpm add -D puppeteer`
// Usage: node scripts/export-pdf.mjs [profile-id] [base-url]
// Defaults: profile-id = default, base-url = http://localhost:5173

import { mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const profileId = process.argv[2] ?? 'default';
const baseUrl = process.argv[3] ?? 'http://localhost:5173';

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.error('puppeteer not installed. Run: pnpm add -D puppeteer');
  process.exit(1);
}

const outDir = join(root, 'exports');
mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().slice(0, 10);
const outFile = join(outDir, `cv-${profileId}-${stamp}.pdf`);

const browser = await puppeteer.launch();
const page = await browser.newPage();
const url = `${baseUrl}/?profile=${encodeURIComponent(profileId)}`;
console.log(`Loading ${url} ...`);
await page.goto(url, { waitUntil: 'networkidle0' });
await page.emulateMediaType('print');
await page.pdf({
  path: outFile,
  format: 'A4',
  printBackground: true,
  margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' },
});
await browser.close();
console.log(`✓ Wrote ${outFile}`);
