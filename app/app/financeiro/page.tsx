import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { loadFinanceOverview } from "@/lib/finance-system";
import { financeAreaMeta } from "@/lib/finance-meta";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default async function FinanceiroPage() {
  noStore();

  let overview;
  try {
    overview = await loadFinanceOverview();
  } catch {
    return <FinanceUnavailablePage />;
  }

  return <FinanceOverviewView overview={overview} />;
}

function FinanceOverviewView({ overview }: { overview: Awaited<ReturnType<typeof loadFinanceOverview>> }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,156,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(77,212,198,0.14),transparent_24%),linear-gradient(180deg,#050b14_0%,#08111f_52%,#050b14_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 md:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Central integrada</p>
            <h1 className="mt-3 font-mono text-4xl font-black tracking-[-0.06em] md:text-5xl">Financeiro</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Hub unificado para caixa, recorrencias, reservas e historico do ecossistema.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-white/10"
            >
              Central
            </Link>
          </div>
        </header>

        {overview.isDemo ? (
          <section className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
            Financeiro em modo de exemplo. Quando `DATABASE_URL` estiver populado com dados reais, este painel passa a refletir o banco.
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Saldo consolidado" value={formatCurrency(overview.totalBalance)} />
          <MetricCard label="Pendencias" value={String(overview.pendingCount)} />
          <MetricCard label="Recorrencias" value={String(overview.recurringCount)} />
          <MetricCard label="Reservas" value={String(overview.reserveCount)} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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
      </div>
    </main>
  );
}

function FinanceUnavailablePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,156,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(77,212,198,0.14),transparent_24%),linear-gradient(180deg,#050b14_0%,#08111f_52%,#050b14_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Financeiro</p>
          <h1 className="mt-3 font-mono text-4xl font-black tracking-[-0.06em]">Banco nao configurado</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Esta area depende de `DATABASE_URL`. Quando a variavel estiver configurada, o hub financeiro abre normalmente.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-white/10"
            >
              Voltar para a central
            </Link>
          </div>
        </section>
      </div>
    </main>
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
