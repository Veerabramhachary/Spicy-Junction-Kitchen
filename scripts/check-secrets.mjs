#!/usr/bin/env node
/**
 * Pre-commit secret guard.
 *
 * Scans staged files for credential-shaped strings and refuses the commit.
 *
 * Why this exists: the Google Apps Script URLs in `.env` are live write
 * endpoints into a Google Sheet that holds customer names and phone numbers.
 * `.env` is gitignored, so the realistic failure is someone pasting a real URL
 * into `.env.example` or a doc and committing it. Once pushed, removing it
 * requires a history rewrite and anyone who cloned already has it.
 *
 * GitHub's own secret scanning is a second line of defence, but it only alerts
 * after a push. This stops it locally.
 *
 * Deliberately conservative: high-confidence patterns only, and known-safe
 * placeholders (empty values, `your-token`, ellipsis examples) are allowed, so
 * the hook does not cry wolf and teach people to bypass it.
 *
 * Run manually with:  node scripts/check-secrets.mjs
 */

import { execSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

/** Files we never scan - binary, vendored, or the env files themselves. */
const SKIP = [
  /node_modules/,
  /^\.next\//,
  /package-lock\.json$/,
  /bun\.lock$/,
  /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|mp4|pdf|zip)$/i,
  /^\.env$/, // gitignored already, belt-and-braces
];

/**
 * Each rule needs a high-confidence shape. A pattern that matches ordinary
 * prose will train people to `--no-verify`.
 */
const RULES = [
  {
    name: 'Google Apps Script exec URL',
    // A real deployment id is long and unbroken. Documentation placeholders
    // contain dots or ellipsis, so they do not match.
    re: /script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec/,
    hint: 'This is a live write endpoint into your orders sheet. It belongs in .env (gitignored), not in a tracked file.',
  },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/, hint: 'Remove it from the committed file and rotate it.' },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/, hint: 'Remove it and rotate the key pair.' },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/, hint: 'Revoke it at github.com/settings/tokens.' },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, hint: 'Revoke it in the Slack app admin.' },
  { name: 'OpenAI-style secret key', re: /\bsk-[A-Za-z0-9]{20,}\b/, hint: 'Rotate the key.' },
  { name: 'Private key block', re: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, hint: 'Never commit private keys.' },
  {
    name: 'Secret assigned a literal value',
    // KEY/SECRET/TOKEN/PASSWORD set to a non-empty, non-placeholder value.
    re: /\b[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PRIVATE_KEY)[A-Z0-9_]*\s*[:=]\s*["']?([A-Za-z0-9/+_-]{16,})["']?/,
    hint: 'Assign it from an env var instead, e.g. `process.env.MY_SECRET`.',
    // Allow obvious placeholders.
    allow: (value) => /^(your|example|placeholder|changeme|xxx|test|dummy|replace)/i.test(value),
  },
];

function stagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function scan(file) {
  if (SKIP.some((re) => re.test(file))) return [];
  let content;
  try {
    if (!statSync(file).isFile()) return [];
    content = readFileSync(file, 'utf8');
  } catch {
    return []; // deleted between staging and scanning, or unreadable
  }
  // A NUL byte means we mis-detected a text file.
  if (content.includes('\u0000')) return [];

  const findings = [];
  const lines = content.split('\n');

  for (const rule of RULES) {
    lines.forEach((line, i) => {
      const match = line.match(rule.re);
      if (!match) return;
      if (rule.allow && rule.allow(match[1] || '')) return;
      // Skip comment lines - documentation describing a format is fine.
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) return;
      findings.push({ rule: rule.name, line: i + 1, hint: rule.hint, text: trimmed.slice(0, 90) });
    });
  }
  return findings;
}

const files = stagedFiles();
if (files.length === 0) {
  console.log('[check-secrets] no staged files to scan.');
  process.exit(0);
}

let total = 0;
for (const file of files) {
  const findings = scan(file);
  if (findings.length === 0) continue;
  total += findings.length;
  console.error(`\n[check-secrets] ${file}`);
  for (const f of findings) {
    console.error(`  line ${f.line}  ${f.rule}`);
    console.error(`    ${f.text}`);
    console.error(`    -> ${f.hint}`);
  }
}

if (total > 0) {
  console.error(
    `\n[check-secrets] commit blocked: ${total} possible secret(s) in staged files.\n` +
      'If one of these is a false positive, fix the pattern in scripts/check-secrets.mjs\n' +
      'rather than bypassing with --no-verify.\n',
  );
  process.exit(1);
}

console.log(`[check-secrets] scanned ${files.length} staged file(s), nothing found.`);