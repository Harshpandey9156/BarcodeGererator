import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { barcodes } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // get the last segment (id)

  const parsedId = parseInt(id || "");
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
