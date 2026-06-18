'use client';

import { useEffect, useMemo, useState } from 'react';

interface ScheduledCarouselSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  caption?: string;
  imageUrl?: string;
  imageType: 'html' | 'ai' | 'stock';
  colors: { bg: string; text: string; accent?: string };
  order: number;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
}

interface ScheduledPost {
  id: string;
  instagramAccountId: string;
  slides: ScheduledCarouselSlide[];
  caption: string;
  carouselTemplate: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  imageUrls: string[];
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  postId?: string;
  url?: string;
  error?: string;
}

interface InstagramAccountSummary {
  id: string;
  label: string;
  isDefault: boolean;
}

const STATUS_STYLES: Record<ScheduledPost['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  publishing: 'bg-amber-100 text-amber-800 border-amber-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ScheduledPostsPanel() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<InstagramAccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const accountMap = useMemo(
    () => new Map(accounts.map((account) => [account.id, account.label])),
    [accounts]
  );

  const loadData = async () => {
    try {
      setError('');
      const [postsResponse, accountsResponse] = await Promise.all([
        fetch('/api/scheduled-posts'),
        fetch('/api/instagram-accounts'),
      ]);

      const postsData = await postsResponse.json();
      const accountsData = await accountsResponse.json();

      if (!postsResponse.ok) {
        throw new Error(postsData.error || 'Falha ao carregar agendamentos');
      }

      if (!accountsResponse.ok) {
        throw new Error(accountsData.error || 'Falha ao carregar contas');
      }

      setPosts(Array.isArray(postsData.scheduledPosts) ? postsData.scheduledPosts : []);
      setAccounts(Array.isArray(accountsData.accounts) ? accountsData.accounts : []);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha ao carregar agendamentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const scheduledCount = posts.filter((post) => post.status === 'scheduled').length;
  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const failedCount = posts.filter((post) => post.status === 'failed').length;
  const now = Date.now();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Acompanhamento
            </p>
            <h3 className="text-xl font-bold text-white">Agendamentos salvos</h3>
            <p className="mt-1 text-sm text-slate-300">
              Veja o que ficou guardado no Blob e se o cron já processou.
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-gray-200 bg-slate-50 px-6 py-4 md:grid-cols-3">
        <Metric label="Pendentes" value={scheduledCount} />
        <Metric label="Publicados" value={publishedCount} />
        <Metric label="Falhos" value={failedCount} />
      </div>

      <div className="px-6 py-5">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Carregando agendamentos...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Nenhum post agendado ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const accountLabel = accountMap.get(post.instagramAccountId) || post.instagramAccountId;
              const isOverdue = post.status === 'scheduled' && new Date(post.scheduledFor).getTime() < now;
              const statusLabel = isOverdue ? 'atrasado' : post.status;
              const statusStyle = isOverdue
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : STATUS_STYLES[post.status];

              return (
                <div key={post.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${statusStyle}`}
                        >
                          {statusLabel}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.carouselTemplate}
                        </span>
                      </div>
                      <h4 className="mt-2 font-semibold text-gray-900">
                        {accountLabel}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatDateTime(post.scheduledFor)}
                      </p>
                      {isOverdue ? (
                        <p className="mt-1 text-xs font-semibold text-orange-700">
                          Esse item já passou do horário e ainda está como agendado. O job não o processou ainda.
                        </p>
                      ) : null}
                    </div>

                    {post.url ? (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-blue-600 underline"
                      >
                        Abrir post
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-3 max-h-20 overflow-hidden text-sm text-gray-700">
                    {post.caption || 'Sem legenda'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Slides: {post.slides.length}</span>
                    <span>ID: {post.id}</span>
                    {post.publishedAt ? <span>Publicado em {formatDateTime(post.publishedAt)}</span> : null}
                    {post.error ? <span className="text-red-600">Erro: {post.error}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {lastUpdated ? (
          <p className="mt-4 text-xs text-gray-500">
            Última atualização: {formatDateTime(lastUpdated)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-gray-900">{value}</div>
    </div>
  );
}
