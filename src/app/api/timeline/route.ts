import { NextResponse } from "next/server";

import { content } from "@/content";
import { apiMeta } from "@/lib/api";

/** All timeline entries, chronological. */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/timeline"),
    data: content.timeline,
  });
}
