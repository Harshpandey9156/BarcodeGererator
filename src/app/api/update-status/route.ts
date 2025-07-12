import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";

import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    await db
      .update(barcodes)
      .set({ status })
      .where(eq(barcodes.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
