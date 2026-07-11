import { listFinancialItems, type FinancialItem } from "@/lib/financial-items";
import type { AreaKey } from "@/lib/financial-schema";
import { getAccountBalance, listFinancialMovements, type AccountBalance, type FinancialMovement } from "@/lib/financial-workspace";
import { listReserveGoals, type ReserveGoal } from "@/lib/reserve-goals";
import { financeAreaMeta, financeAreaOrder, type FinanceAreaMeta } from "@/lib/finance-meta";
import { isFinanceDatabaseConfigured } from "@/lib/finance-env";

type AreaSnapshot = {
  area: AreaKey;
  meta: FinanceAreaMeta;
  balance: AccountBalance;
  items: FinancialItem[];
  movements: FinancialMovement[];
  reserves: ReserveGoal[];
};

export type FinanceOverview = {
  totalBalance: number;
  pendingCount: number;
  recurringCount: number;
  reserveCount: number;
  areas: AreaSnapshot[];
  recentMovements: FinancialMovement[];
  recentItems: FinancialItem[];
  isDemo?: boolean;
};

export type FinanceAreaSnapshot = AreaSnapshot & {
  pendingCount: number;
  recurringCount: number;
  totalReserveTarget: number;
  totalReserveCurrent: number;
  isDemo?: boolean;
};

type DemoFinanceAreaSeed = {
  balance: number;
  items: FinancialItem[];
  movements: FinancialMovement[];
  reserves: ReserveGoal[];
};

const DEMO_SEEDS: Record<AreaKey, DemoFinanceAreaSeed> = {
  financeiro: {
    balance: 24800,
    items: [
      {
        id: "demo-financeiro-item-1",
        area: "financeiro",
        label: "Pró-labore",
        category: "Entrada fixa",
        amount: 18000,
        dueDate: "2026-07-05",
        paid: true,
        recurring: true,
        recurrenceDay: 5,
        scheduleLabel: "Todo dia 05"
      },
      {
        id: "demo-financeiro-item-2",
        area: "financeiro",
        label: "Infraestrutura e ferramentas",
        category: "Gasto fixo",
        amount: 3200,
        dueDate: "2026-07-12",
        paid: false,
        recurring: true,
        recurrenceDay: 12,
        scheduleLabel: "Todo dia 12"
      },
      {
        id: "demo-financeiro-item-3",
        area: "financeiro",
        label: "Impostos e provisões",
        category: "Conta a pagar",
        amount: 2400,
        dueDate: "2026-07-18",
        paid: false,
        recurring: false,
        recurrenceDay: null,
        scheduleLabel: "Vence em 18/07"
      }
    ],
    movements: [
      {
        id: "demo-financeiro-movement-1",
        area: "financeiro",
        kind: "entrada",
        label: "Entrada de contrato",
        amount: 18000,
        movementDate: "2026-07-05",
        balanceAfter: 25800,
        notes: "Exemplo de fluxo consolidado",
        createdAt: "2026-07-05T12:00:00Z",
        reviewed: true
      },
      {
        id: "demo-financeiro-movement-2",
        area: "financeiro",
        kind: "gasto",
        label: "Pagamento de stack",
        amount: -1000,
        movementDate: "2026-07-08",
        balanceAfter: 24800,
        notes: null,
        createdAt: "2026-07-08T12:00:00Z",
        reviewed: true
      }
    ],
    reserves: [
      {
        id: "demo-financeiro-reserve-1",
        area: "financeiro",
        label: "Reserva operacional",
        targetAmount: 40000,
        currentAmount: 16200
      }
    ]
  },
  var: {
    balance: 13200,
    items: [
      {
        id: "demo-var-item-1",
        area: "var",
        label: "Serviços de IA",
        category: "Entrada fixa",
        amount: 9000,
        dueDate: "2026-07-06",
        paid: true,
        recurring: true,
        recurrenceDay: 6,
        scheduleLabel: "Todo dia 06"
      },
      {
        id: "demo-var-item-2",
        area: "var",
        label: "Licenças e automações",
        category: "Gasto fixo",
        amount: 1800,
        dueDate: "2026-07-15",
        paid: false,
        recurring: true,
        recurrenceDay: 15,
        scheduleLabel: "Todo dia 15"
      }
    ],
    movements: [
      {
        id: "demo-var-movement-1",
        area: "var",
        kind: "entrada",
        label: "Projeto fechado",
        amount: 9000,
        movementDate: "2026-07-06",
        balanceAfter: 14200,
        notes: null,
        createdAt: "2026-07-06T12:00:00Z",
        reviewed: true
      }
    ],
    reserves: []
  },
  psicoterapia: {
    balance: 6200,
    items: [
      {
        id: "demo-psicoterapia-item-1",
        area: "psicoterapia",
        label: "Sessões particulares",
        category: "Entrada fixa",
        amount: 7800,
        dueDate: "2026-07-10",
        paid: true,
        recurring: true,
        recurrenceDay: 10,
        scheduleLabel: "Todo dia 10"
      },
      {
        id: "demo-psicoterapia-item-2",
        area: "psicoterapia",
        label: "Agenda e plataforma",
        category: "Gasto fixo",
        amount: 900,
        dueDate: "2026-07-12",
        paid: false,
        recurring: true,
        recurrenceDay: 12,
        scheduleLabel: "Todo dia 12"
      }
    ],
    movements: [
      {
        id: "demo-psicoterapia-movement-1",
        area: "psicoterapia",
        kind: "entrada",
        label: "Agenda da semana",
        amount: 7800,
        movementDate: "2026-07-10",
        balanceAfter: 6200,
        notes: null,
        createdAt: "2026-07-10T12:00:00Z",
        reviewed: true
      }
    ],
    reserves: [
      {
        id: "demo-psicoterapia-reserve-1",
        area: "psicoterapia",
        label: "Reserva clínica",
        targetAmount: 15000,
        currentAmount: 6200
      }
    ]
  },
  casa: {
    balance: 3100,
    items: [
      {
        id: "demo-casa-item-1",
        area: "casa",
        label: "Receita do lar",
        category: "Entrada fixa",
        amount: 5200,
        dueDate: "2026-07-01",
        paid: true,
        recurring: true,
        recurrenceDay: 1,
        scheduleLabel: "Todo dia 01"
      },
      {
        id: "demo-casa-item-2",
        area: "casa",
        label: "Mercado e contas",
        category: "Conta a pagar",
        amount: 2100,
        dueDate: "2026-07-16",
        paid: false,
        recurring: false,
        recurrenceDay: null,
        scheduleLabel: "Vence em 16/07"
      }
    ],
    movements: [
      {
        id: "demo-casa-movement-1",
        area: "casa",
        kind: "entrada",
        label: "Transferência planejada",
        amount: 5200,
        movementDate: "2026-07-01",
        balanceAfter: 5200,
        notes: null,
        createdAt: "2026-07-01T12:00:00Z",
        reviewed: true
      },
      {
        id: "demo-casa-movement-2",
        area: "casa",
        kind: "gasto",
        label: "Supermercado",
        amount: -2100,
        movementDate: "2026-07-09",
        balanceAfter: 3100,
        notes: null,
        createdAt: "2026-07-09T12:00:00Z",
        reviewed: true
      }
    ],
    reserves: [
      {
        id: "demo-casa-reserve-1",
        area: "casa",
        label: "Reserva da casa",
        targetAmount: 12000,
        currentAmount: 3100
      }
    ]
  }
};

function buildAreaSnapshot(area: AreaKey, seed: DemoFinanceAreaSeed): AreaSnapshot {
  return {
    area,
    meta: financeAreaMeta[area],
    balance: {
      area,
      currentBalance: seed.balance,
      updatedAt: "2026-07-11T00:00:00Z",
    },
    items: seed.items,
    movements: seed.movements,
    reserves: seed.reserves,
  };
}

function buildDemoOverview(): FinanceOverview {
  const areas = financeAreaOrder.map((area) => buildAreaSnapshot(area, DEMO_SEEDS[area]));
  const recentMovements = areas.flatMap((area) => area.movements).slice(0, 8);
  const recentItems = areas.flatMap((area) => area.items).slice(0, 8);

  return {
    totalBalance: areas.reduce((sum, area) => sum + area.balance.currentBalance, 0),
    pendingCount: areas.flatMap((area) => area.items).filter((item) => item.category !== "Entrada fixa" && !item.paid).length,
    recurringCount: areas.flatMap((area) => area.items).filter((item) => item.recurring).length,
    reserveCount: areas.flatMap((area) => area.reserves).length,
    areas,
    recentMovements,
    recentItems,
    isDemo: true
  };
}

function isEmptyFinancialData(
  itemsByArea: FinancialItem[][],
  balancesByArea: AccountBalance[],
  movementsByArea: FinancialMovement[][],
  reservesByArea: ReserveGoal[][]
) {
  return (
    itemsByArea.every((items) => items.length === 0) &&
    balancesByArea.every((balance) => balance.currentBalance === 0) &&
    movementsByArea.every((movements) => movements.length === 0) &&
    reservesByArea.every((reserves) => reserves.length === 0)
  );
}

export async function loadFinanceOverview(): Promise<FinanceOverview> {
  if (!isFinanceDatabaseConfigured()) {
    return buildDemoOverview();
  }

  const [itemsByArea, balancesByArea, movementsByArea, reservesByArea] = await Promise.all([
    Promise.all(financeAreaOrder.map((area) => listFinancialItems(area))),
    Promise.all(financeAreaOrder.map((area) => getAccountBalance(area))),
    Promise.all(financeAreaOrder.map((area) => listFinancialMovements(area, 6))),
    Promise.all(financeAreaOrder.map((area) => listReserveGoals(area)))
  ]);

  if (isEmptyFinancialData(itemsByArea, balancesByArea, movementsByArea, reservesByArea)) {
    return buildDemoOverview();
  }

  const areas = financeAreaOrder.map((area, index) => ({
    area,
    meta: financeAreaMeta[area],
    balance: balancesByArea[index],
    items: itemsByArea[index],
    movements: movementsByArea[index],
    reserves: reservesByArea[index]
  }));

  const recentMovements = movementsByArea
    .flat()
    .sort((left, right) => {
      const dateOrder = right.movementDate.localeCompare(left.movementDate);
      return dateOrder !== 0 ? dateOrder : Number(right.id) - Number(left.id);
    })
    .slice(0, 8);

  const recentItems = itemsByArea
    .flat()
    .sort((left, right) => {
      if (left.paid === right.paid) {
        return right.id.localeCompare(left.id);
      }

      return Number(left.paid) - Number(right.paid);
    })
    .slice(0, 8);

  const allItems = itemsByArea.flat();
  const allReserves = reservesByArea.flat();

  return {
    totalBalance: balancesByArea.reduce((sum, item) => sum + item.currentBalance, 0),
    pendingCount: allItems.filter((item) => item.category !== "Entrada fixa" && !item.paid).length,
    recurringCount: allItems.filter((item) => item.recurring).length,
    reserveCount: allReserves.length,
    areas,
    recentMovements,
    recentItems,
  };
}

export async function loadFinanceArea(area: AreaKey): Promise<FinanceAreaSnapshot> {
  if (!isFinanceDatabaseConfigured()) {
    const seed = DEMO_SEEDS[area];
    const snapshot = buildAreaSnapshot(area, seed);

    return {
      ...snapshot,
      pendingCount: seed.items.filter((item) => item.category !== "Entrada fixa" && !item.paid).length,
      recurringCount: seed.items.filter((item) => item.recurring).length,
      totalReserveTarget: seed.reserves.reduce((sum, goal) => sum + goal.targetAmount, 0),
      totalReserveCurrent: seed.reserves.reduce((sum, goal) => sum + goal.currentAmount, 0),
      isDemo: true
    };
  }

  const [items, balance, movements, reserves] = await Promise.all([
    listFinancialItems(area),
    getAccountBalance(area),
    listFinancialMovements(area, 12),
    listReserveGoals(area)
  ]);

  if (items.length === 0 && balance.currentBalance === 0 && movements.length === 0 && reserves.length === 0) {
    return {
      ...buildAreaSnapshot(area, DEMO_SEEDS[area]),
      pendingCount: DEMO_SEEDS[area].items.filter((item) => item.category !== "Entrada fixa" && !item.paid).length,
      recurringCount: DEMO_SEEDS[area].items.filter((item) => item.recurring).length,
      totalReserveTarget: DEMO_SEEDS[area].reserves.reduce((sum, goal) => sum + goal.targetAmount, 0),
      totalReserveCurrent: DEMO_SEEDS[area].reserves.reduce((sum, goal) => sum + goal.currentAmount, 0),
      isDemo: true
    };
  }

  const pendingCount = items.filter((item) => item.category !== "Entrada fixa" && !item.paid).length;
  const recurringCount = items.filter((item) => item.recurring).length;

  return {
    area,
    meta: financeAreaMeta[area],
    balance,
    items,
    movements,
    reserves,
    pendingCount,
    recurringCount,
    totalReserveTarget: reserves.reduce((sum, goal) => sum + goal.targetAmount, 0),
    totalReserveCurrent: reserves.reduce((sum, goal) => sum + goal.currentAmount, 0)
  };
}
