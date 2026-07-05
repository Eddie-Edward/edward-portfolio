// Relative import so this stays script-friendly (see manifest.ts).
import { content } from "../content";

/**
 * Shared metadata envelope for every read-only API response.
 * Contract: docs/jarvis-portfolio-contract.md.
 */
export function apiMeta(endpoint: string) {
  return {
    endpoint,
    contentVersion: content.siteConfig.contentVersion,
    contractVersion: content.siteConfig.jarvis.contractVersion,
    readOnly: true as const,
  };
}
