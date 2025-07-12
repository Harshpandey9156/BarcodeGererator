 
// import { NextResponse } from "next/server";
import { db } from "../../../../../../lib/db"; 
import { barcodes } from "../../../../../../db/schema";   
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();
  const id = Number(params.id);

  try {
    await db.update(barcodes).set({ status }).where(eq(barcodes.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
