import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { barcodes } from "../../../../../db/schema";

import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const result = await db
    .select()
    .from(barcodes)
    .where(eq(barcodes.id, id));

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}


