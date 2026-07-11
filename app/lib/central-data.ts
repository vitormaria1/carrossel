export type ModuleKey = "home" | "financeiro" | "var" | "psicoterapia" | "casa";

export const navigation = [
  { key: "home", label: "Central", href: "/" },
  { key: "financeiro", label: "Financeiro", href: "/financeiro" },
  { key: "var", label: "VAR", href: "/financeiro/var" },
  { key: "psicoterapia", label: "Psicoterapia", href: "/financeiro/psicoterapia" },
  { key: "casa", label: "Casa", href: "/financeiro/casa" },
] as const;

export const modules = [
  {
    key: "financeiro",
    title: "Financeiro",
    eyebrow: "Centro de controle",
  },
  {
    key: "var",
    title: "VAR",
    eyebrow: "Sistemas e IA para negócios",
  },
  {
    key: "psicoterapia",
    title: "Psicoterapia",
    eyebrow: "Consultório",
  },
  {
    key: "casa",
    title: "Casa",
    eyebrow: "Rotina doméstica",
  },
] as const;
