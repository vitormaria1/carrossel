'use client';

import { useEffect, useRef, useState } from 'react';
import { useCarouselStore } from '@/lib/store';
import { generateCardBase64 } from '@/lib/export';
import { renderVanderMariaCardToBase64 } from '@/lib/vander-maria';

interface InstagramAccountSummary {
  id: string;
  label: string;
  isDefault: boolean;
}

export function PublishButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [instagramAccounts, setInstagramAccounts] = useState<InstagramAccountSummary[]>([]);
  const [accountsError, setAccountsError] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    carouselTemplate,
    cards,
    postCaption,
    instagramAccountId,
    setInstagramAccountId,
  } = useCarouselStore();

  useEffect(() => {
    let active = true;

    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/instagram-accounts');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Falha ao carregar contas');
        }

        if (!active) return;

        const accounts: InstagramAccountSummary[] = Array.isArray(data.accounts) ? data.accounts : [];
        setInstagramAccounts(accounts);

        if (accounts[0]?.id && !accounts.some((account) => account.id === instagramAccountId)) {
          setInstagramAccountId(accounts[0].id);
        }
      } catch (error) {
        if (!active) return;
        setAccountsError(error instanceof Error ? error.message : 'Falha ao carregar contas');
      }
    };

    loadAccounts();

    return () => {
      active = false;
    };
  }, [instagramAccountId, setInstagramAccountId]);

  const handlePublish = async () => {
    if (!cards.length) {
      setStatus('error');
      setErrorMessage('Gere um carrossel antes de publicar');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (isLoading) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const template = carouselTemplate;

    setIsLoading(true);
    setStatus('publishing');
    setErrorMessage('');
    setPostUrl('');
    setProgress({ current: 0, total: cards.length });

    try {
      const caption = postCaption.trim() || cards[0]?.caption || 'Confira este carrossel! 🎨';
      const base64Images: string[] = [];

      for (let index = 0; index < cards.length; index += 1) {
        setProgress({ current: index + 1, total: cards.length });

        const cardTemplate = cards[index].carouselTemplate || template;
        const base64 =
          cardTemplate === 'vanderMaria'
            ? await renderVanderMariaCardToBase64(cards[index])
            : await generateCardBase64(
                cards[index],
                cardTemplate as 'standard' | 'tweet' | 'tweetExpanded'
              );

        base64Images.push(base64);
      }

      const imageUrls: string[] = [];

      for (let index = 0; index < base64Images.length; index += 1) {
        const uploadResponse = await fetch('/api/publish-instagram/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64: base64Images[index],
            cardIndex: index,
            cardHeadline: cards[index].headline || 'Card',
          }),
          signal: abortControllerRef.current.signal,
        });

        const uploadContentType = uploadResponse.headers.get('content-type') || '';
        const uploadData = uploadContentType.includes('application/json')
          ? await uploadResponse.json()
          : { error: await uploadResponse.text() };

        if (!uploadResponse.ok) {
          throw new Error(String(uploadData.error || 'Falha ao enviar imagem'));
        }

        imageUrls.push(uploadData.url);
        setProgress({ current: index + 1, total: base64Images.length });
      }

      const response = await fetch('/api/publish-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramAccountId: instagramAccountId || instagramAccounts[0]?.id || 'default',
          slides: cards,
          caption,
          carouselTemplate: template,
          imageUrls,
        }),
        signal: abortControllerRef.current.signal,
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };

      if (!response.ok) {
        const rawError = String(data.error || '');
        if (/request entity too large/i.test(rawError)) {
          throw new Error(
            'O payload da publicação ficou grande demais. Reduza o número de slides ou o tamanho das imagens.'
          );
        }
        throw new Error(rawError || 'Erro ao publicar');
      }

      setStatus('success');
      setPostUrl(data.url || '');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
            Conta do Instagram
          </label>
          <select
            value={instagramAccountId || instagramAccounts[0]?.id || ''}
            onChange={(event) => setInstagramAccountId(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={instagramAccounts.length === 0}
          >
            {instagramAccounts.length === 0 ? (
              <option value="">Carregando contas...</option>
            ) : (
              instagramAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label}
                </option>
              ))
            )}
          </select>
          {accountsError ? (
            <p className="mt-1 text-xs text-red-600">{accountsError}</p>
          ) : instagramAccounts.length > 1 ? (
            <p className="mt-1 text-xs text-gray-500">
              Escolha qual conta será usada para publicar.
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Para disparos externos, use a API autenticada em <code>/api/external/publish</code>.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePublish}
        disabled={isLoading || cards.length === 0}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : status === 'success'
              ? 'bg-green-500 text-white'
              : status === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            {progress.total > 0
              ? `Processando ${progress.current}/${progress.total}...`
              : 'Publicando...'}
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center justify-center gap-2">✅ Publicado com sucesso!</span>
        ) : status === 'error' ? (
          <span className="flex items-center justify-center gap-2">❌ Erro</span>
        ) : (
          <span className="flex items-center justify-center gap-2">📱 Publicar no Instagram</span>
        )}
      </button>

      {status === 'success' && postUrl && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold mb-2">Carrossel publicado! 🎉</p>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-green-600 underline hover:text-green-800"
          >
            Ver no Instagram →
          </a>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold text-sm">{errorMessage}</p>
        </div>
      )}

      {isLoading && progress.total > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
