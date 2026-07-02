import { NextResponse } from "next/server";
import { deleteFinancialItem, updateFinancialItem } from "@/lib/financial-items";
import { isMonthlyRecurringCategory } from "@/lib/financial-recurring";
import { isFinancialCategory } from "@/lib/financial-schema";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const { id } = await params;

  const label = typeof body.label === "string" ? body.label.trim() : "";
  const category = body.category;
  const amount = Number(body.amount);
  const dueDate = typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null;
  const paid = Boolean(body.paid);

  if (!label || !Number.isFinite(amount) || amount <= 0 || !isFinancialCategory(category)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (isMonthlyRecurringCategory(category) && !dueDate) {
    return NextResponse.json({ error: "Recurring items require a day of month." }, { status: 400 });
  }

  const item = await updateFinancialItem(id, {
    label,
    category,
    amount,
    dueDate,
    paid
  });

  if (!item) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteFinancialItem(id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
