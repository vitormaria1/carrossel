'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login.');
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#111827,#030712_55%,#000)] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <section className="flex flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Carrossel App</p>
              <h1 className="mt-4 max-w-md text-4xl font-black leading-tight md:text-6xl">
                Acesso restrito
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 md:text-base">
                Entre com o usuário e a senha para acessar a área de criação, publicação e agendamento.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                Proteção via cookie HTTP-only
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                Redirecionamento automático para a tela principal
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6 md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-300">Login</p>
              <h2 className="mt-2 text-2xl font-bold">Entre para continuar</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="username">
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-blue-400 focus:bg-white/15"
                  placeholder="admin123"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="password">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-blue-400 focus:bg-white/15"
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-xs leading-5 text-white/45">
                Se você quiser trocar essa proteção por um login real depois, eu posso migrar para Clerk, Auth.js ou outro provedor.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
