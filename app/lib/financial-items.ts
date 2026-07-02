import { sql } from "@/lib/db";
import { getRecurringPresentation, normalizeDueDateForStorage } from "@/lib/financial-recurring";
import type { AreaKey, FinancialCategory } from "@/lib/financial-schema";

export type FinancialItem = {
  id: string;
  area: AreaKey;
  label: string;
  category: FinancialCategory;
  amount: number;
  dueDate: string | null;
  paid: boolean;
  recurring: boolean;
  recurrenceDay: number | null;
  scheduleLabel: string;
};

type DatabaseRow = {
  id: string;
  area: AreaKey;
  label: string;
  category: FinancialCategory;
  amount: string;
  due_date: string | null;
  paid: boolean;
};

type CreateFinancialItemInput = {
  area: AreaKey;
  label: string;
  category: FinancialCategory;
  amount: number;
  dueDate: string | null;
};

type UpdateFinancialItemInput = {
  label: string;
  category: FinancialCategory;
  amount: number;
  dueDate: string | null;
  paid: boolean;
};

function mapRow(row: DatabaseRow): FinancialItem {
  const recurring = getRecurringPresentation(row.category, row.due_date, row.paid);

  return {
    id: row.id,
    area: row.area,
    label: row.label,
    category: row.category,
    amount: Number(row.amount),
    dueDate: recurring.visibleDueDate,
    paid: recurring.effectivePaid,
    recurring: recurring.recurring,
    recurrenceDay: recurring.recurrenceDay,
    scheduleLabel: recurring.scheduleLabel
  };
}

export async function listFinancialItems(area: AreaKey) {
  const rows = await sql<DatabaseRow[]>`
    select id, area, label, category, amount::text, due_date, paid
    from public.financial_items
    where area = ${area}
    order by paid asc, created_at desc
  `;

  return rows.map(mapRow);
}

export async function createFinancialItem(input: CreateFinancialItemInput) {
  const storedDueDate = normalizeDueDateForStorage(input.category, input.dueDate);

  const [row] = await sql<DatabaseRow[]>`
    insert into public.financial_items (area, label, category, amount, due_date, paid)
    values (
      ${input.area},
      ${input.label},
      ${input.category},
      ${input.amount},
      ${storedDueDate},
      ${input.category === "Entrada fixa"}
    )
    returning id, area, label, category, amount::text, due_date, paid
  `;

  return mapRow(row);
}

export async function toggleFinancialItemPaid(id: string) {
  const [current] = await sql<DatabaseRow[]>`
    select id, area, label, category, amount::text, due_date, paid
    from public.financial_items
    where id = ${id}
  `;

  if (!current) {
    return null;
  }

  const nextPaid = !getRecurringPresentation(current.category, current.due_date, current.paid).effectivePaid;
  const nextDueDate = normalizeDueDateForStorage(current.category, current.due_date);

  const [row] = await sql<DatabaseRow[]>`
    update public.financial_items
    set
      paid = ${nextPaid},
      due_date = ${nextDueDate}
    where id = ${id}
    returning id, area, label, category, amount::text, due_date, paid
  `;

  return row ? mapRow(row) : null;
}

export async function updateFinancialItem(id: string, input: UpdateFinancialItemInput) {
  const storedDueDate = normalizeDueDateForStorage(input.category, input.dueDate);

  const [row] = await sql<DatabaseRow[]>`
    update public.financial_items
    set
      label = ${input.label},
      category = ${input.category},
      amount = ${input.amount},
      due_date = ${storedDueDate},
      paid = ${input.category === "Entrada fixa" ? true : input.paid}
    where id = ${id}
    returning id, area, label, category, amount::text, due_date, paid
  `;

  return row ? mapRow(row) : null;
}

export async function deleteFinancialItem(id: string) {
  const rows = await sql<{ id: string }[]>`
    delete from public.financial_items
    where id = ${id}
    returning id
  `;

  return rows.length > 0;
}
