/**
 * Regenerates public/jarvis-site-manifest.json from the content layer.
 * Run via `pnpm manifest:generate` after any content change.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildSiteManifest } from "../src/lib/manifest";

const manifest = {
  ...buildSiteManifest(),
  generatedAt: new Date().toISOString(),
};

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "jarvis-site-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`✓ wrote ${outPath}`);
console.log(
  `  contentVersion ${manifest.contentVersion} · contractVersion ${manifest.contractVersion} · ${manifest.counts.projects} projects`,
);
