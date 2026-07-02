import type { AreaKey } from "@/lib/financial-schema";

export type FinanceAreaMeta = {
  key: AreaKey;
  title: string;
  description: string;
  accent: "var" | "clinic" | "finance";
};

export const financeAreaOrder = ["financeiro", "var", "psicoterapia", "casa"] as const satisfies readonly AreaKey[];

export const financeAreaMeta: Record<AreaKey, FinanceAreaMeta> = {
  financeiro: {
    key: "financeiro",
    title: "Financeiro",
    description: "Centro consolidado de caixa, recorrencias e reservas.",
    accent: "finance"
  },
  var: {
    key: "var",
    title: "VAR",
    description: "Sistemas e IA para negocios.",
    accent: "var"
  },
  psicoterapia: {
    key: "psicoterapia",
    title: "Psicoterapia",
    description: "Consultorio e agenda financeira.",
    accent: "clinic"
  },
  casa: {
    key: "casa",
    title: "Casa",
    description: "Rotina e compromissos do lar.",
    accent: "finance"
  }
};
