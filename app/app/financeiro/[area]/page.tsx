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

  let snapshot;
  try {
    snapshot = await loadFinanceArea(area as (typeof financeAreaOrder)[number]);
  } catch {
    return <FinanceUnavailableArea title={area} />;
  }

  return <FinanceiroAreaClient snapshot={snapshot} />;
}

function FinanceUnavailableArea({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,156,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(77,212,198,0.14),transparent_24%),linear-gradient(180deg,#050b14_0%,#08111f_52%,#050b14_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Financeiro</p>
          <h1 className="mt-3 font-mono text-4xl font-black tracking-[-0.06em]">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Esta area depende de `DATABASE_URL`. Quando a variavel estiver configurada, o painel abre normalmente.
          </p>
        </section>
      </div>
    </main>
  );
}
