import { NextResponse ,NextRequest } from "next/server";
import { db } from "../../../../lib/db";
import { barcodes } from "../../../../db/schema";
// export async function GET() {
//   const allBarcodes = await db.select().from(barcodes);
//   return NextResponse.json(allBarcodes);
// }


// import { NextRequest, NextResponse } from "next/server";
 
import { eq } from "drizzle-orm";

// Correctly receive `context` and access params from it
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = parseInt(context.params.id); // ✅ fixed line

  const result = await db
    .select()
    .from(barcodes)
    .where(eq(barcodes.id, id));

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
