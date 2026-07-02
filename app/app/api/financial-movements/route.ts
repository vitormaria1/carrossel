import { NextResponse } from "next/server";
import { createFinancialMovement } from "@/lib/financial-workspace";
import { isAreaKey } from "@/lib/financial-schema";

export async function POST(request: Request) {
  const body = await request.json();

  const area = body.area;
  const label = typeof body.label === "string" ? body.label.trim() : "";
  const kind = body.kind;
  const amount = Number(body.amount);
  const movementDate = typeof body.movementDate === "string" ? body.movementDate.trim() : "";
  const notes = typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : null;

  if (!isAreaKey(area) || !label || !["entrada", "gasto"].includes(kind) || !Number.isFinite(amount) || amount <= 0 || !movementDate) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const result = await createFinancialMovement({
    area,
    label,
    kind,
    amount,
    movementDate,
    notes
  });

  return NextResponse.json(result, { status: 201 });
}
