import { NextResponse } from "next/server";

import { apiMeta } from "@/lib/api";
import { buildSiteManifest } from "@/lib/manifest";

/** The JARVIS site manifest, always current with the content layer. */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/site-manifest"),
    data: buildSiteManifest(),
  });
}
