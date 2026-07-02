import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { parseStatementDocument } from "@/lib/statement-import";
import { importFinancialMovementsBatch } from "@/lib/financial-workspace";
import { isAreaKey } from "@/lib/financial-schema";

export async function POST(request: Request) {
  const formData = await request.formData();
  const area = formData.get("area");
  const file = formData.get("file");

  if (!isAreaKey(area) || !(file instanceof File)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const content = await file.text();
  const entries = parseStatementDocument(file.name, content);

  if (entries.length === 0) {
    return NextResponse.json({ error: "Nenhum lancamento legivel encontrado no arquivo." }, { status: 400 });
  }

  const result = await importFinancialMovementsBatch(
    area,
    entries.map((entry) => ({
      area,
      label: entry.label,
      amount: entry.amount,
      movementDate: entry.movementDate,
      notes: entry.notes,
      importHash: createHash("sha1").update([area, entry.movementDate, entry.amount, entry.label].join("|")).digest("hex")
    }))
  );

  return NextResponse.json(result, { status: 201 });
}
