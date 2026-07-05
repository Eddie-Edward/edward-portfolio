import { NextResponse } from "next/server";

import { content } from "@/content";
import { apiMeta } from "@/lib/api";

/** All projects, exactly as validated from src/content/projects.ts. */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    meta: apiMeta("/api/projects"),
    data: content.projects,
  });
}
