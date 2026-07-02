import { listFinancialItems, type FinancialItem } from "@/lib/financial-items";
import type { AreaKey } from "@/lib/financial-schema";
import { getAccountBalance, listFinancialMovements, type AccountBalance, type FinancialMovement } from "@/lib/financial-workspace";
import { listReserveGoals, type ReserveGoal } from "@/lib/reserve-goals";
import { financeAreaMeta, financeAreaOrder, type FinanceAreaMeta } from "@/lib/finance-meta";

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
};

export type FinanceAreaSnapshot = AreaSnapshot & {
  pendingCount: number;
  recurringCount: number;
  totalReserveTarget: number;
  totalReserveCurrent: number;
};

export async function loadFinanceOverview(): Promise<FinanceOverview> {
  const [itemsByArea, balancesByArea, movementsByArea, reservesByArea] = await Promise.all([
    Promise.all(financeAreaOrder.map((area) => listFinancialItems(area))),
    Promise.all(financeAreaOrder.map((area) => getAccountBalance(area))),
    Promise.all(financeAreaOrder.map((area) => listFinancialMovements(area, 6))),
    Promise.all(financeAreaOrder.map((area) => listReserveGoals(area)))
  ]);

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
    recentItems
  };
}

export async function loadFinanceArea(area: AreaKey): Promise<FinanceAreaSnapshot> {
  const [items, balance, movements, reserves] = await Promise.all([
    listFinancialItems(area),
    getAccountBalance(area),
    listFinancialMovements(area, 12),
    listReserveGoals(area)
  ]);

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
