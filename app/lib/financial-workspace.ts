import { sql } from "@/lib/db";
import type { AreaKey } from "@/lib/financial-schema";

export type MovementKind = "entrada" | "gasto" | "ajuste";

export type AccountBalance = {
  area: AreaKey;
  currentBalance: number;
  updatedAt: string | null;
};

export type FinancialMovement = {
  id: string;
  area: AreaKey;
  kind: MovementKind;
  label: string;
  amount: number;
  movementDate: string;
  balanceAfter: number;
  notes: string | null;
  createdAt: string;
  reviewed: boolean;
};

type BalanceRow = {
  area: AreaKey;
  current_balance: string;
  updated_at: string | null;
};

type MovementRow = {
  id: string;
  area: AreaKey;
  kind: MovementKind;
  label: string;
  amount: string;
  movement_date: string;
  balance_after: string;
  notes: string | null;
  created_at: string;
  reviewed: boolean;
  import_hash: string | null;
};

type CreateMovementInput = {
  area: AreaKey;
  kind: Exclude<MovementKind, "ajuste">;
  label: string;
  amount: number;
  movementDate: string;
  notes: string | null;
};

type ImportedMovementInput = {
  area: AreaKey;
  label: string;
  amount: number;
  movementDate: string;
  notes: string | null;
  importHash: string;
};

let schemaPromise: Promise<void> | null = null;

function mapBalance(row: BalanceRow | null, area: AreaKey): AccountBalance {
  return {
    area,
    currentBalance: row ? Number(row.current_balance) : 0,
    updatedAt: row?.updated_at ?? null
  };
}

function mapMovement(row: MovementRow): FinancialMovement {
  return {
    id: row.id,
    area: row.area,
    kind: row.kind,
    label: row.label,
    amount: Number(row.amount),
    movementDate: row.movement_date,
    balanceAfter: Number(row.balance_after),
    notes: row.notes,
    createdAt: row.created_at,
    reviewed: row.reviewed
  };
}

async function ensureWorkspaceSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        create table if not exists public.account_balances (
          area text primary key,
          current_balance numeric(14, 2) not null default 0,
          updated_at timestamptz not null default timezone('utc', now())
        )
      `;

      await sql`
        create table if not exists public.financial_movements (
          id bigint generated always as identity primary key,
          area text not null,
          kind text not null check (kind in ('entrada', 'gasto', 'ajuste')),
          label text not null,
          amount numeric(14, 2) not null,
          movement_date date not null,
          balance_after numeric(14, 2) not null,
          notes text,
          created_at timestamptz not null default timezone('utc', now()),
          import_hash text,
          reviewed boolean not null default true
        )
      `;

      await sql`alter table public.financial_movements add column if not exists import_hash text`;
      await sql`alter table public.financial_movements add column if not exists reviewed boolean not null default true`;

      await sql`
        create index if not exists financial_movements_area_date_idx
        on public.financial_movements (area, movement_date desc, id desc)
      `;

      await sql`
        create unique index if not exists financial_movements_area_import_hash_idx
        on public.financial_movements (area, import_hash)
        where import_hash is not null
      `;

      await sql`alter table public.account_balances enable row level security`;
      await sql`alter table public.financial_movements enable row level security`;
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  await schemaPromise;
}

export async function getAccountBalance(area: AreaKey) {
  await ensureWorkspaceSchema();

  const [row] = await sql<BalanceRow[]>`
    select area, current_balance::text, updated_at::text
    from public.account_balances
    where area = ${area}
  `;

  return mapBalance(row ?? null, area);
}

export async function listFinancialMovements(area: AreaKey, limit = 12) {
  await ensureWorkspaceSchema();

  const rows = await sql<MovementRow[]>`
    select
      id::text,
      area,
      kind,
      label,
      amount::text,
      movement_date::text,
      balance_after::text,
      notes,
      created_at::text,
      reviewed,
      import_hash
    from public.financial_movements
    where area = ${area}
    order by movement_date desc, id desc
    limit ${limit}
  `;

  return rows.map(mapMovement);
}

export async function createFinancialMovement(input: CreateMovementInput) {
  await ensureWorkspaceSchema();

  return sql.begin(async (tx) => {
    const [current] = await tx<BalanceRow[]>`
      select area, current_balance::text, updated_at::text
      from public.account_balances
      where area = ${input.area}
      for update
    `;

    const currentBalance = current ? Number(current.current_balance) : 0;
    const signedAmount = input.kind === "entrada" ? input.amount : input.amount * -1;
    const nextBalance = currentBalance + signedAmount;

    const [movement] = await tx<MovementRow[]>`
      insert into public.financial_movements (
        area,
        kind,
        label,
        amount,
        movement_date,
        balance_after,
        notes
      )
      values (
        ${input.area},
        ${input.kind},
        ${input.label},
        ${signedAmount},
        ${input.movementDate},
        ${nextBalance},
        ${input.notes}
      )
      returning
        id::text,
        area,
        kind,
        label,
        amount::text,
        movement_date::text,
        balance_after::text,
        notes,
        created_at::text,
        reviewed,
        import_hash
    `;

    const [balance] = await tx<BalanceRow[]>`
      insert into public.account_balances (area, current_balance)
      values (${input.area}, ${nextBalance})
      on conflict (area) do update
      set
        current_balance = excluded.current_balance,
        updated_at = timezone('utc', now())
      returning area, current_balance::text, updated_at::text
    `;

    return {
      movement: mapMovement(movement),
      balance: mapBalance(balance, input.area)
    };
  });
}

export async function importFinancialMovementsBatch(area: AreaKey, entries: ImportedMovementInput[]) {
  await ensureWorkspaceSchema();

  return sql.begin(async (tx) => {
    const [current] = await tx<BalanceRow[]>`
      select area, current_balance::text, updated_at::text
      from public.account_balances
      where area = ${area}
      for update
    `;

    let runningBalance = current ? Number(current.current_balance) : 0;
    const imported: FinancialMovement[] = [];
    const existingHashes = entries.length
      ? await tx<{ import_hash: string }[]>`
          select import_hash
          from public.financial_movements
          where area = ${area}
            and import_hash in ${sql(entries.map((entry) => entry.importHash))}
        `
      : [];
    const existingHashSet = new Set(existingHashes.map((row) => row.import_hash));
    let skipped = 0;

    for (const entry of entries) {
      if (existingHashSet.has(entry.importHash)) {
        skipped += 1;
        continue;
      }

      runningBalance += entry.amount;

      const [movement] = await tx<MovementRow[]>`
        insert into public.financial_movements (
          area,
          kind,
          label,
          amount,
          movement_date,
          balance_after,
          notes,
          import_hash,
          reviewed
        )
        values (
          ${area},
          ${entry.amount >= 0 ? "entrada" : "gasto"},
          ${entry.label},
          ${entry.amount},
          ${entry.movementDate},
          ${runningBalance},
          ${entry.notes},
          ${entry.importHash},
          false
        )
        returning
          id::text,
          area,
          kind,
          label,
          amount::text,
          movement_date::text,
          balance_after::text,
          notes,
          created_at::text,
          reviewed,
          import_hash
      `;

      imported.push(mapMovement(movement));
    }

    const [balance] = await tx<BalanceRow[]>`
      insert into public.account_balances (area, current_balance)
      values (${area}, ${runningBalance})
      on conflict (area) do update
      set
        current_balance = excluded.current_balance,
        updated_at = timezone('utc', now())
      returning area, current_balance::text, updated_at::text
    `;

    return {
      movements: imported,
      balance: mapBalance(balance, area),
      skipped
    };
  });
}

export async function setAccountBalance(area: AreaKey, newBalance: number, label: string | null) {
  await ensureWorkspaceSchema();

  return sql.begin(async (tx) => {
    const [current] = await tx<BalanceRow[]>`
      select area, current_balance::text, updated_at::text
      from public.account_balances
      where area = ${area}
      for update
    `;

    const currentBalance = current ? Number(current.current_balance) : 0;
    const delta = newBalance - currentBalance;

    const [balance] = await tx<BalanceRow[]>`
      insert into public.account_balances (area, current_balance)
      values (${area}, ${newBalance})
      on conflict (area) do update
      set
        current_balance = excluded.current_balance,
        updated_at = timezone('utc', now())
      returning area, current_balance::text, updated_at::text
    `;

    let movement: FinancialMovement | null = null;

    if (delta !== 0) {
      const [adjustment] = await tx<MovementRow[]>`
        insert into public.financial_movements (
          area,
          kind,
          label,
          amount,
          movement_date,
          balance_after,
          notes
        )
        values (
          ${area},
          'ajuste',
          ${label?.trim() || 'Ajuste manual de saldo'},
          ${delta},
          current_date,
          ${newBalance},
          null
        )
      returning
        id::text,
        area,
        kind,
        label,
        amount::text,
        movement_date::text,
        balance_after::text,
        notes,
        created_at::text,
        reviewed,
        import_hash
      `;

      movement = mapMovement(adjustment);
    }

    return {
      balance: mapBalance(balance, area),
      movement
    };
  });
}

export async function updateFinancialMovement(id: string, input: { label: string; notes: string | null; reviewed: boolean }) {
  await ensureWorkspaceSchema();

  const [row] = await sql<MovementRow[]>`
    update public.financial_movements
    set
      label = ${input.label},
      notes = ${input.notes},
      reviewed = ${input.reviewed}
    where id = ${id}
    returning
      id::text,
      area,
      kind,
      label,
      amount::text,
      movement_date::text,
      balance_after::text,
      notes,
      created_at::text,
      reviewed,
      import_hash
  `;

  return row ? mapMovement(row) : null;
}
