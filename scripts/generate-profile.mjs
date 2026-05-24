#!/usr/bin/env node
// Two-step manual generator using your Claude Pro subscription.
//
//   1) pnpm generate-profile prepare
//        Builds a prompt from profile.json + job.txt and copies it to your
//        clipboard (macOS pbcopy). Paste into claude.ai. Save the JSON
//        response into ./.ai-response.json.
//
//        To get profile.json: open the app, go to /?view=setup, fill in your
//        info, save, then open DevTools → Application → localStorage and copy
//        the value for 'cv-user-profile-v1' into profile.json.
//
//   2) pnpm generate-profile apply
//        Reads ./.ai-response.json and prints next steps.
//        Then visit http://localhost:5173/?profile=generated and cmd+P.
//
// Conservative mode: the prompt forbids invented companies, dates, tech, or
// metrics. The AI may only reorder skill rows and rewrite the summary.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cmd = process.argv[2] ?? 'prepare';

const JOB_PATH = join(root, 'job.txt');
const RESPONSE_PATH = join(root, '.ai-response.json');
const PROFILE_PATH = join(root, 'profile.json');

function buildPrompt(profileJson, jobDescription) {
  return `You are tailoring a CV profile for a specific job. Output ONLY a JSON object — no prose, no markdown fences.

# RULES (strict — do not violate)
1. Do NOT invent companies, job titles, dates, technologies, metrics, or certifications. Use only what appears in the source profile below.
2. You MAY: rewrite the summary, choose which existing bullets to emphasize, reorder skill rows, set the emphasis role tag.
3. You may NOT add or remove bullet points. You may NOT change a bullet's text.
4. The summary must be 2–3 sentences, ATS-friendly (plain words from the JD where they truthfully apply).
5. Skill row categories must be a permutation of the existing categories — same set, new order. Put the most relevant first.
6. emphasis must be one of: frontend | backend | fullstack | devops | mobile | data | ai.

# OUTPUT JSON SCHEMA
{
  "id": "generated",
  "label": "<short label, e.g. 'Backend @ Acme'>",
  "emphasis": "<one role tag>",
  "headerTitle": "<job title to display under name, e.g. 'Backend engineer'>",
  "summary": "<2-3 sentences>",
  "skillsOrder": ["<category>", "<category>", ...]
}

# SOURCE PROFILE (the only facts you may use)
\`\`\`json
${profileJson}
\`\`\``

# JOB DESCRIPTION
${jobDescription}

Now output the JSON object only.`;
}

function copyToClipboard(text) {
  try {
    execSync('pbcopy', { input: text });
    return true;
  } catch {
    return false;
  }
}

if (cmd === 'prepare') {
  if (!existsSync(PROFILE_PATH)) {
    console.error(`Missing ${PROFILE_PATH}.`);
    console.error('Export your profile: open the app, set up your CV, then open');
    console.error("DevTools → Application → Local Storage → copy 'cv-user-profile-v1' value into profile.json");
    process.exit(1);
  }
  if (!existsSync(JOB_PATH)) {
    console.error(`Missing ${JOB_PATH}. Create it with the job description text.`);
    process.exit(1);
  }
  const profileJson = readFileSync(PROFILE_PATH, 'utf8');
  const jd = readFileSync(JOB_PATH, 'utf8').trim();
  if (!jd) {
    console.error('job.txt is empty.');
    process.exit(1);
  }
  const prompt = buildPrompt(profileJson, jd);
  const tmpPromptPath = join(root, '.ai-prompt.txt');
  writeFileSync(tmpPromptPath, prompt, 'utf8');
  const copied = copyToClipboard(prompt);

  console.log('');
  console.log('Prompt prepared.');
  console.log(`  Wrote: ${tmpPromptPath}`);
  if (copied) console.log('  Copied to clipboard (pbcopy).');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open https://claude.ai (your Pro subscription).');
  console.log('  2. Paste (cmd+V) and send.');
  console.log('  3. Copy the JSON response.');
  console.log(`  4. Save it to: ${RESPONSE_PATH}`);
  console.log('  5. Run: pnpm generate-profile apply');
  console.log('');
  process.exit(0);
}

if (cmd === 'apply') {
  if (!existsSync(RESPONSE_PATH)) {
    console.error(`Missing ${RESPONSE_PATH}. Save Claude's JSON response there first.`);
    process.exit(1);
  }
  let raw = readFileSync(RESPONSE_PATH, 'utf8').trim();
  // Strip optional markdown fences if Claude wrapped them.
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON in .ai-response.json:', e.message);
    process.exit(1);
  }

  const required = ['id', 'label', 'emphasis', 'headerTitle', 'summary', 'skillsOrder'];
  for (const k of required) {
    if (!(k in data)) {
      console.error(`Missing field in response: ${k}`);
      process.exit(1);
    }
  }
  const validTags = ['frontend', 'backend', 'fullstack', 'devops', 'mobile', 'data', 'ai'];
  if (!validTags.includes(data.emphasis)) {
    console.error(`Invalid emphasis: ${data.emphasis}. Must be one of ${validTags.join(', ')}.`);
    process.exit(1);
  }
  if (!Array.isArray(data.skillsOrder) || data.skillsOrder.length === 0) {
    console.error('skillsOrder must be a non-empty array.');
    process.exit(1);
  }

  const responseStr = JSON.stringify(data);
  console.log('');
  console.log('✓ Response is valid.');
  console.log('');
  console.log('To apply in-browser:');
  console.log('  1. Open the app at http://localhost:5173/?view=generate');
  console.log('  2. Paste the JD and click through the steps.');
  console.log('  3. Paste the JSON response from Claude and click Apply.');
  console.log('  4. Visit /?profile=generated and cmd+P to print.');
  console.log('');
  process.exit(0);
}

console.error(`Unknown command: ${cmd}. Use 'prepare' or 'apply'.`);
process.exit(1);
