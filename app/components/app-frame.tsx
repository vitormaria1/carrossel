import Link from "next/link";
import type { ReactNode } from "react";
import { navigation } from "@/lib/central-data";

type AppFrameProps = {
  title: string;
  eyebrow: string;
  description?: string;
  active: string;
  children: ReactNode;
};

export function AppFrame({ title, eyebrow, description, active, children }: AppFrameProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,156,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(77,212,198,0.14),transparent_24%),linear-gradient(180deg,#050b14_0%,#08111f_52%,#050b14_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">{eyebrow}</p>
            <h1 className="mt-3 font-mono text-4xl font-black tracking-[-0.06em] md:text-5xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{description}</p> : null}
          </div>

          <nav className="flex flex-wrap items-center gap-2" aria-label="Navegação principal">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                  active === item.key
                    ? "border-white/20 bg-white text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
