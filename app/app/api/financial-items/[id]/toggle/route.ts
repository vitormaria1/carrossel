import { NextResponse } from "next/server";
import { toggleFinancialItemPaid } from "@/lib/financial-items";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await toggleFinancialItemPaid(id);

  if (!item) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(item);
}
