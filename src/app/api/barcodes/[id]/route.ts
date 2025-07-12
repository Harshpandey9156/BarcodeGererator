import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { barcodes } from "../../../../../db/schema";
   import { eq } from "drizzle-orm";

// ✅ Make this an async function and await context.params
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params; // ✅ await this!

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(barcodes)
    .where(eq(barcodes.id, parsedId));

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
