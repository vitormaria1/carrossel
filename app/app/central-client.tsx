'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ECOSYSTEM_CARDS = [
  {
    title: 'CASA',
    href: null,
    description: 'Em breve',
    orbitClassName: 'orbit-card orbit-card-top',
  },
  {
    title: 'CONSULTÓRIO',
    href: '/consultorio',
    description: 'Automação de carrossel',
    orbitClassName: 'orbit-card orbit-card-right',
  },
  {
    title: 'VAR',
    href: null,
    description: 'Em breve',
    orbitClassName: 'orbit-card orbit-card-bottom',
  },
  {
    title: 'SONO INFANTIL',
    href: null,
    description: 'Em breve',
    orbitClassName: 'orbit-card orbit-card-left',
  },
] as const;

export default function CentralClient() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe8] text-[#1b1714]">
      <div className="relative isolate min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#fff8eb,transparent_35%),radial-gradient(circle_at_bottom,#e7ddd1,transparent_32%)]" />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7c6d5f]">
              Ecossistema
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[0.12em] md:text-4xl">
              CENTRAL
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#1b1714] px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] transition hover:bg-[#1b1714] hover:text-[#f4efe8]"
          >
            Sair
          </button>
        </header>

        <section className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-12 pt-4 md:px-10 lg:min-h-[calc(100vh-104px)] lg:justify-center">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-[#8e7d6b]">
              Hub principal
            </p>
            <p className="mt-4 text-base leading-7 text-[#54483f] md:text-lg">
              Cada frente do ecossistema nasce daqui. Por enquanto, a automação ativa está dentro de
              CONSULTÓRIO.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-10 lg:mt-16">
            <div className="orbit-stage">
              <div className="orbit-ring" />
              <div className="orbit-ring orbit-ring-secondary" />

              <div className="brain-core">
                <div className="brain-core__halo" />
                <div className="brain-core__shell">
                  <div className="brain-core__label">CÉREBRO</div>
                  <div className="brain-core__title">CENTRAL</div>
                </div>
              </div>

              <div className="orbit-track">
                {ECOSYSTEM_CARDS.map((card) =>
                  card.href ? (
                    <Link key={card.title} href={card.href} className={card.orbitClassName}>
                      <div className="orbit-card__inner">
                        <span className="orbit-card__title">{card.title}</span>
                        <span className="orbit-card__description">{card.description}</span>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={card.title}
                      className={`${card.orbitClassName} orbit-card--muted`}
                      aria-label={`${card.title}: em breve`}
                    >
                      <div className="orbit-card__inner">
                        <span className="orbit-card__title">{card.title}</span>
                        <span className="orbit-card__description">{card.description}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
              {ECOSYSTEM_CARDS.map((card) =>
                card.href ? (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="rounded-[2rem] border border-[#1b1714] bg-[#1b1714] px-6 py-5 text-[#f4efe8] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(27,23,20,0.15)]"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b7a690]">
                      Ativo
                    </div>
                    <div className="mt-3 text-2xl font-black tracking-[0.08em]">{card.title}</div>
                    <div className="mt-2 text-sm text-[#ddd1c3]">{card.description}</div>
                  </Link>
                ) : (
                  <div
                    key={card.title}
                    className="rounded-[2rem] border border-[#c6b9ab] bg-white/70 px-6 py-5 text-[#4f443b]"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a08f7d]">
                      Vazio
                    </div>
                    <div className="mt-3 text-2xl font-black tracking-[0.08em]">{card.title}</div>
                    <div className="mt-2 text-sm">{card.description}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
