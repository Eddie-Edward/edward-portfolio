import { NextResponse } from "next/server";

import { content } from "@/content";
import { apiMeta } from "@/lib/api";

/** All skill groups. */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/skills"),
    data: content.skillGroups,
  });
}
