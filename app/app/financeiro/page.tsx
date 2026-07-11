import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AppFrame } from "@/components/app-frame";
import { financeAreaMeta } from "@/lib/finance-meta";
import { loadFinanceOverview } from "@/lib/finance-system";
import { modules } from "@/lib/central-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default async function FinanceiroPage() {
  noStore();

  const overview = await loadFinanceOverview();
  const moduleData = modules.find((module) => module.key === "financeiro");

  return (
    <AppFrame
      active="financeiro"
      title={moduleData?.title ?? "Financeiro"}
      eyebrow={moduleData?.eyebrow ?? "Centro de controle"}
      description="Hub unificado para caixa, recorrencias, reservas e historico do ecossistema."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Saldo consolidado" value={formatCurrency(overview.totalBalance)} />
        <MetricCard label="Pendencias" value={String(overview.pendingCount)} />
        <MetricCard label="Recorrencias" value={String(overview.recurringCount)} />
        <MetricCard label="Reservas" value={String(overview.reserveCount)} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Areas</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Acesso rapido</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {overview.areas.map((area) => (
              <Link
                key={area.area}
                href={`/financeiro/${area.area}`}
                className="group rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/65"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {area.meta.accent}
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">{area.meta.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{area.meta.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>{formatCurrency(area.balance.currentBalance)}</span>
                  <span className="transition group-hover:text-white">Abrir</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Historico recente</p>
            <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Movimentos</h2>
          </div>

          <div className="mt-6 space-y-3">
            {overview.recentMovements.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-white/10 px-4 py-8 text-sm text-slate-400">
                Nenhuma movimentacao registrada.
              </div>
            ) : (
              overview.recentMovements.map((movement) => (
                <article
                  key={`${movement.area}-${movement.id}`}
                  className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                        {financeAreaMeta[movement.area].title}
                      </p>
                      <h3 className="mt-2 font-semibold text-slate-50">{movement.label}</h3>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(movement.movementDate)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${movement.amount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                      {movement.amount >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(movement.amount))}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Proximos pontos</p>
            <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Itens recentes</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {overview.recentItems.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-white/10 px-4 py-8 text-sm text-slate-400 md:col-span-2 xl:col-span-4">
              Nenhum item cadastrado.
            </div>
          ) : (
            overview.recentItems.map((item) => (
              <article key={`${item.area}-${item.id}`} className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {financeAreaMeta[item.area].title}
                </p>
                <h3 className="mt-2 font-semibold text-slate-50">{item.label}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.scheduleLabel}</p>
                <p className="mt-4 text-sm font-semibold text-slate-200">{formatCurrency(item.amount)}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </AppFrame>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <strong className="mt-4 block font-mono text-3xl tracking-[-0.05em] text-white">{value}</strong>
    </article>
  );
}
