import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalVisits = await db.visit.count();
    const totalLeads = await db.emailLead.count();
    const uniqueEmails = await db.emailLead.findMany({
      select: { email: true },
      distinct: ["email"],
    });

    return NextResponse.json({
      totalVisits,
      totalLeads,
      uniqueEmails: uniqueEmails.length,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { totalVisits: 0, totalLeads: 0, uniqueEmails: 0 },
      { status: 200 }
    );
  }
}
