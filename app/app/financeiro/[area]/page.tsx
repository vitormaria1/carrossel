import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { AppFrame } from "@/components/app-frame";
import { FinanceiroAreaClient } from "../financeiro-area-client";
import { financeAreaOrder } from "@/lib/finance-meta";
import { loadFinanceArea } from "@/lib/finance-system";
import { modules } from "@/lib/central-data";

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
  const moduleData = modules.find((module) => module.key === area);

  return (
    <AppFrame
      active={area}
      title={moduleData?.title ?? area}
      eyebrow={moduleData?.eyebrow ?? "Centro de controle"}
      description=""
    >
      <FinanceiroAreaClient snapshot={snapshot} />
    </AppFrame>
  );
}
