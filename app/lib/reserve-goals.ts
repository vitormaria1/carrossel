import { sql } from "@/lib/db";
import type { AreaKey } from "@/lib/financial-schema";

export type ReserveGoal = {
  id: string;
  area: AreaKey;
  label: string;
  targetAmount: number;
  currentAmount: number;
};

type ReserveRow = {
  id: string;
  area: AreaKey;
  label: string;
  target_amount: string;
  current_amount: string;
};

type CreateReserveInput = {
  area: AreaKey;
  label: string;
  targetAmount: number;
  currentAmount: number;
};

let reserveSchemaPromise: Promise<void> | null = null;

function mapRow(row: ReserveRow): ReserveGoal {
  return {
    id: row.id,
    area: row.area,
    label: row.label,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount)
  };
}

async function ensureReserveSchema() {
  if (!reserveSchemaPromise) {
    reserveSchemaPromise = (async () => {
      await sql`
        create table if not exists public.reserve_goals (
          id bigint generated always as identity primary key,
          area text not null,
          label text not null,
          target_amount numeric(14, 2) not null,
          current_amount numeric(14, 2) not null default 0
        )
      `;

      await sql`alter table public.reserve_goals enable row level security`;
    })().catch((error) => {
      reserveSchemaPromise = null;
      throw error;
    });
  }

  await reserveSchemaPromise;
}

export async function listReserveGoals(area: AreaKey) {
  await ensureReserveSchema();

  const rows = await sql<ReserveRow[]>`
    select id::text, area, label, target_amount::text, current_amount::text
    from public.reserve_goals
    where area = ${area}
    order by id desc
  `;

  return rows.map(mapRow);
}

export async function createReserveGoal(input: CreateReserveInput) {
  await ensureReserveSchema();

  const [row] = await sql<ReserveRow[]>`
    insert into public.reserve_goals (area, label, target_amount, current_amount)
    values (${input.area}, ${input.label}, ${input.targetAmount}, ${input.currentAmount})
    returning id::text, area, label, target_amount::text, current_amount::text
  `;

  return mapRow(row);
}
