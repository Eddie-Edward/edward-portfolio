import { NextResponse } from "next/server";

import { content } from "@/content";
import { apiMeta } from "@/lib/api";

/** Liveness + version info. Read-only. */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/health"),
    data: {
      status: "ok",
      app: "edward-portfolio",
      contentVersion: content.siteConfig.contentVersion,
    },
  });
}
