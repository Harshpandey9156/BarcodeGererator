
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "../../../../../lib/db";
// import { barcodes } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

 export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  //  checking  for the 
  const result = await db
    .select()
    .from(barcodes)
    .where(eq(barcodes.id, parsedId));

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
