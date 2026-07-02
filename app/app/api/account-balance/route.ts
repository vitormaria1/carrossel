import { NextResponse } from "next/server";
import { setAccountBalance } from "@/lib/financial-workspace";
import { isAreaKey } from "@/lib/financial-schema";

export async function PATCH(request: Request) {
  const body = await request.json();

  const area = body.area;
  const amount = Number(body.amount);
  const label = typeof body.label === "string" ? body.label : null;

  if (!isAreaKey(area) || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const result = await setAccountBalance(area, amount, label);

  return NextResponse.json(result);
}
