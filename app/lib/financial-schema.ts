export type AreaKey = "financeiro" | "var" | "psicoterapia" | "casa";
export type FinancialCategory = "Entrada fixa" | "Conta a pagar" | "Gasto fixo";

export const financialAreas = ["financeiro", "var", "psicoterapia", "casa"] as const;
export const financialCategories = ["Entrada fixa", "Conta a pagar", "Gasto fixo"] as const;

export function isAreaKey(value: unknown): value is AreaKey {
  return typeof value === "string" && financialAreas.includes(value as AreaKey);
}

export function isFinancialCategory(value: unknown): value is FinancialCategory {
  return typeof value === "string" && financialCategories.includes(value as FinancialCategory);
}
