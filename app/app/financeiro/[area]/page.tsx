import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { financeAreaOrder } from "@/lib/finance-meta";
import { loadFinanceArea } from "@/lib/finance-system";
import { FinanceiroAreaClient } from "../financeiro-area-client";

function isAreaKey(value: string) {
  return (financeAreaOrder as readonly string[]).includes(value);
}

export default async function FinanceiroAreaPage({
  params
}: {
  params: Promise<{ area: string }>;
}) {
  noStore();

  const { area } = await params;

  if (!isAreaKey(area)) {
    notFound();
  }

  const snapshot = await loadFinanceArea(area as (typeof financeAreaOrder)[number]);

  return <FinanceiroAreaClient snapshot={snapshot} />;
}
