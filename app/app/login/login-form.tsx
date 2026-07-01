'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  nextPath: string;
}

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
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
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10 text-black">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-6xl font-black tracking-[0.24em] sm:text-7xl md:text-8xl">
          CENTRAL
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-black/70"
              htmlFor="username"
            >
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full border border-black px-4 py-4 text-base text-black outline-none transition focus:bg-black focus:text-white"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-black/70"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-black px-4 py-4 text-base text-black outline-none transition focus:bg-black focus:text-white"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="border border-red-600 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-black bg-black px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
