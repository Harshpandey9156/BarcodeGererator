import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";

 export async function GET() {
  const allBarcodes = await db.select().from(barcodes);
  return NextResponse.json(allBarcodes);
}
