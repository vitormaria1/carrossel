import { NextResponse } from "next/server";
import { updateFinancialMovement } from "@/lib/financial-workspace";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const { id } = await params;

  const label = typeof body.label === "string" ? body.label.trim() : "";
  const notes = typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : null;
  const reviewed = Boolean(body.reviewed);

  if (!label) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const movement = await updateFinancialMovement(id, {
    label,
    notes,
    reviewed
  });

  if (!movement) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(movement);
}
