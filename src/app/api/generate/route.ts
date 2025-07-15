import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemName, sku, batchNo, category, format, generatedId } = body;

    if (!itemName || !sku || !format || !generatedId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(barcodes)
      .where(or(eq(barcodes.sku, sku), eq(barcodes.generatedId, generatedId)));

    if (existing.length > 0) {
      return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
    }

    await db.insert(barcodes).values({
      itemName,
      sku,
      batchNo,
      category,
      format,
      generatedId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/generate error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
