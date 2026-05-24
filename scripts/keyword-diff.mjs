#!/usr/bin/env node
// Compare a job description (job.txt) against your CV profile text.
// Usage: node scripts/keyword-diff.mjs [profile-id] [path/to/job.txt]
// Defaults: profile-id = default, path = ./job.txt

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const profileId = process.argv[2] ?? 'default';
const jdPath = resolve(process.argv[3] ?? join(root, 'job.txt'));

const STOPWORDS = new Set(`
a an the and or but if while of for to from with without on at by in into out over
is are was were be being been have has had do does did will would can could should
shall may might must i you he she we they it this that these those them their our
your my mine yours theirs as so than then there here also more most less few many
about across after against among around because before below beneath between during
each every either neither no not only own same such very just up down off where when
how what who which why whose
years year experience required preferred requirements skills knowledge ability work
team able role position candidate company strong solid plus
`.split(/\s+/).filter(Boolean));

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#./\- ]+/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function topKeywords(text, n = 40) {
  const counts = new Map();
  for (const t of tokenize(text)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function profileText(id) {
  // Naive: read the profile TS file as text. Good enough for keyword extraction.
  const file = join(root, 'src/profiles', `${id}.ts`);
  if (!existsSync(file)) {
    console.error(`Profile not found: ${file}`);
    process.exit(1);
  }
  const defaultFile = join(root, 'src/profiles/default.ts');
  return readFileSync(file, 'utf8') + '\n' + readFileSync(defaultFile, 'utf8');
}

if (!existsSync(jdPath)) {
  console.error(`Job description not found: ${jdPath}`);
  console.error(`Create one with the JD text, then re-run.`);
  process.exit(1);
}

const jd = readFileSync(jdPath, 'utf8');
const cv = profileText(profileId);
const cvTokens = new Set(tokenize(cv));
const jdTop = topKeywords(jd, 50);

const missing = jdTop.filter(([w]) => !cvTokens.has(w));
const present = jdTop.filter(([w]) => cvTokens.has(w));

console.log(`\nProfile: ${profileId}`);
console.log(`JD: ${jdPath}\n`);
console.log(`✓ Present in CV (${present.length}):`);
console.log(present.map(([w, c]) => `  ${w} (${c}x)`).join('\n'));
console.log(`\n✗ MISSING from CV (${missing.length}):`);
console.log(missing.map(([w, c]) => `  ${w} (${c}x in JD)`).join('\n'));
console.log('');
