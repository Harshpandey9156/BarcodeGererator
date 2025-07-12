import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const result = await db.select().from(barcodes).where(eq(barcodes.id, Number(id)));

    if (result.length === 0) {
      return NextResponse.json({ error: "Barcode not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("Error fetching barcode:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
