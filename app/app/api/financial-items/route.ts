import { NextResponse } from "next/server";
import { createFinancialItem } from "@/lib/financial-items";
import { isMonthlyRecurringCategory } from "@/lib/financial-recurring";
import { isAreaKey, isFinancialCategory } from "@/lib/financial-schema";

export async function POST(request: Request) {
  const body = await request.json();

  const label = typeof body.label === "string" ? body.label.trim() : "";
  const category = body.category;
  const amount = Number(body.amount);
  const dueDate = typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null;
  const area = body.area;

  if (!label || !Number.isFinite(amount) || amount <= 0 || !isAreaKey(area) || !isFinancialCategory(category)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (isMonthlyRecurringCategory(category) && !dueDate) {
    return NextResponse.json({ error: "Recurring items require a day of month." }, { status: 400 });
  }

  const item = await createFinancialItem({
    area,
    label,
    category,
    amount,
    dueDate
  });

  return NextResponse.json(item, { status: 201 });
}
