import { NextResponse } from "next/server";
import { createReserveGoal } from "@/lib/reserve-goals";
import { isAreaKey } from "@/lib/financial-schema";

export async function POST(request: Request) {
  const body = await request.json();

  const area = body.area;
  const label = typeof body.label === "string" ? body.label.trim() : "";
  const targetAmount = Number(body.targetAmount);
  const currentAmount = Number(body.currentAmount ?? 0);

  if (!isAreaKey(area) || !label || !Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(currentAmount) || currentAmount < 0) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const goal = await createReserveGoal({
    area,
    label,
    targetAmount,
    currentAmount
  });

  return NextResponse.json(goal, { status: 201 });
}
