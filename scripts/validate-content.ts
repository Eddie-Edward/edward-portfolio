/**
 * Content gate: `pnpm content:check`
 *
 * 1. Parses every content file through its Zod schema (throws on mismatch).
 * 2. Runs cross-file integrity checks (connection slugs, ordering, dupes).
 * 3. Scans content + public files for data that must never ship:
 *    phone numbers, street addresses, secrets/keys.
 *
 * JARVIS must run this after any content edit and before any commit.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "phone number", pattern: /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/ },
  { label: "phone number", pattern: /\b\d{3}[-.]\d{3}[-.]\d{4}\b/ },
  {
    label: "street address",
    pattern: /\b\d{1,5}\s+[A-Z][a-z]+\s+(Street|St\.|Avenue|Ave\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Court|Ct\.?|Boulevard|Blvd\.?)\b/,
  },
  { label: "Anthropic API key", pattern: /sk-ant-[A-Za-z0-9-]{10,}/ },
  { label: "generic secret key", pattern: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { label: "private key block", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

function scanDir(dir: string, exts: string[], problems: string[]) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recurse — nested files must never dodge the scan.
      scanDir(path, exts, problems);
      continue;
    }
    if (!entry.isFile() || !exts.some((ext) => entry.name.endsWith(ext))) continue;
    const text = readFileSync(path, "utf8");
    for (const { label, pattern } of FORBIDDEN_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        problems.push(`${path}: contains ${label} ("${match[0].slice(0, 24)}…")`);
      }
    }
  }
}

async function main() {
  console.log("── content:check ──────────────────────────────────────────");

  // 1 + 2: schema parse happens at import time; integrity check after.
  const { content, validateContentIntegrity } = await import("../src/content/index");

  console.log("✓ schemas: all content files parse");
  console.log(
    `  profile, ${content.projects.length} projects, ${content.timeline.length} timeline entries, ` +
      `${content.skillGroups.length} skill groups, ${content.achievements.length} achievements, ` +
      `${content.coursework.length} courses, ${content.roadmap.length} roadmap items, ` +
      `${content.links.length} links`,
  );

  const integrityErrors = validateContentIntegrity();
  if (integrityErrors.length > 0) {
    console.error("✗ integrity checks failed:");
    for (const err of integrityErrors) console.error(`  - ${err}`);
    process.exit(1);
  }
  console.log("✓ integrity: connections, ordering, uniqueness");

  // 3: safety scan.
  const problems: string[] = [];
  scanDir(join(process.cwd(), "src", "content"), [".ts"], problems);
  scanDir(join(process.cwd(), "public"), [".json", ".txt", ".xml"], problems);
  scanDir(join(process.cwd(), "docs"), [".md"], problems);
  if (problems.length > 0) {
    console.error("✗ safety scan failed — remove this data before committing:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log("✓ safety: no phone numbers, street addresses, or secret patterns");

  // 4: committed manifest must match the content layer (drift gate).
  const { buildSiteManifest } = await import("../src/lib/manifest");
  const manifestPath = join(process.cwd(), "public", "jarvis-site-manifest.json");
  let committedRaw: string;
  try {
    committedRaw = readFileSync(manifestPath, "utf8");
  } catch {
    console.error("✗ manifest: public/jarvis-site-manifest.json missing — run `pnpm manifest:generate`");
    process.exit(1);
  }
  const committed = JSON.parse(committedRaw!) as Record<string, unknown>;
  delete committed.generatedAt;
  const expected = JSON.parse(JSON.stringify(buildSiteManifest()));
  if (JSON.stringify(committed) !== JSON.stringify(expected)) {
    console.error(
      "✗ manifest drift: public/jarvis-site-manifest.json no longer matches src/content — run `pnpm manifest:generate`",
    );
    process.exit(1);
  }
  console.log("✓ manifest: public/jarvis-site-manifest.json matches the content layer");

  console.log("── content:check passed ───────────────────────────────────");
}

main().catch((err) => {
  console.error("✗ content:check failed:\n");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
