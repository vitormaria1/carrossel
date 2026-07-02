import type { FinancialCategory } from "@/lib/financial-schema";

const recurringCategories = new Set<FinancialCategory>(["Entrada fixa", "Gasto fixo"]);

type RecurringPresentation = {
  recurring: boolean;
  recurrenceDay: number | null;
  effectivePaid: boolean;
  visibleDueDate: string | null;
  scheduleLabel: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatIsoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatShortDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildCycleDate(year: number, monthIndex: number, day: number) {
  const normalizedDay = Math.min(Math.max(day, 1), getDaysInMonth(year, monthIndex));
  return new Date(year, monthIndex, normalizedDay);
}

function parseDay(value: string | number | Date | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.getDate();
  }

  if (typeof value === "number") {
    const numericDate = new Date(value);
    return Number.isNaN(numericDate.getTime()) ? null : numericDate.getDate();
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (/^\d{1,2}$/.test(trimmed)) {
    const day = Number(trimmed);
    return day >= 1 && day <= 31 ? day : null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);

  if (match) {
    return Number(match[3]);
  }

  const fallbackDate = new Date(trimmed);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate.getDate();
}

function parseIsoDate(value: string | number | Date | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const numericDate = new Date(value);
    return Number.isNaN(numericDate.getTime()) ? null : numericDate;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());

  if (!match) {
    const fallbackDate = new Date(value);
    return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function isMonthlyRecurringCategory(category: FinancialCategory) {
  return recurringCategories.has(category);
}

export function normalizeDueDateForStorage(category: FinancialCategory, rawValue: string | null, now = new Date()) {
  if (!isMonthlyRecurringCategory(category)) {
    return rawValue;
  }

  const recurrenceDay = parseDay(rawValue);

  if (!recurrenceDay) {
    return null;
  }

  return formatIsoDate(buildCycleDate(now.getFullYear(), now.getMonth(), recurrenceDay));
}

export function getRecurringPresentation(
  category: FinancialCategory,
  storedDueDate: string | null,
  paid: boolean,
  now = new Date()
): RecurringPresentation {
  if (!isMonthlyRecurringCategory(category)) {
    const parsedDate = parseIsoDate(storedDueDate);

    return {
      recurring: false,
      recurrenceDay: null,
      effectivePaid: paid,
      visibleDueDate: storedDueDate,
      scheduleLabel: parsedDate ? formatShortDate(formatIsoDate(parsedDate)) : "Sem venc."
    };
  }

  const recurrenceDay = parseDay(storedDueDate);

  if (!recurrenceDay) {
    return {
      recurring: true,
      recurrenceDay: null,
      effectivePaid: category === "Entrada fixa",
      visibleDueDate: null,
      scheduleLabel: "Recorrencia mensal sem dia definido"
    };
  }

  const currentCycle = buildCycleDate(now.getFullYear(), now.getMonth(), recurrenceDay);
  const nextCycle = buildCycleDate(now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(), (now.getMonth() + 1) % 12, recurrenceDay);
  const storedCycle = parseIsoDate(storedDueDate);
  const paidThisMonth = category === "Gasto fixo" && Boolean(paid && storedCycle && isSameMonth(storedCycle, currentCycle));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let visibleDate = currentCycle;

  if (category === "Entrada fixa") {
    visibleDate = currentCycle < today ? nextCycle : currentCycle;
  } else if (paidThisMonth) {
    visibleDate = nextCycle;
  }

  return {
    recurring: true,
    recurrenceDay,
    effectivePaid: category === "Entrada fixa" ? true : paidThisMonth,
    visibleDueDate: formatIsoDate(visibleDate),
    scheduleLabel: `Todo dia ${pad(recurrenceDay)} • ${formatShortDate(formatIsoDate(visibleDate))}`
  };
}
