import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, downloadItem } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "বৈধ ইমেইল ঠিকানা দিন" },
        { status: 400 }
      );
    }

    // Store the lead — allow duplicates (same email can download multiple files)
    await db.emailLead.create({
      data: {
        email: email.trim().toLowerCase(),
        downloadItem: downloadItem || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { ok: false, error: "সার্ভার সমস্যা — আবার চেষ্টা করুন" },
      { status: 500 }
    );
  }
}
