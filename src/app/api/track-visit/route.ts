import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userAgent = request.headers.get("user-agent") || null;
    const referrer = request.headers.get("referer") || body.referrer || null;
    const path = body.path || "/";

    await db.visit.create({
      data: { userAgent, referrer, path },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Silently fail — don't break the page for tracking errors
    console.error("Track visit error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
