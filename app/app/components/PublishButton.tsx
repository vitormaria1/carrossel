'use client';

import { useEffect, useRef, useState } from 'react';
import { useCarouselStore } from '@/lib/store';
import { generateCardBase64 } from '@/lib/export'; // Fallback para regeneração se necessário
import { renderVanderMariaCardToBase64 } from '@/lib/vander-maria';

interface InstagramAccountSummary {
  id: string;
  label: string;
  isDefault: boolean;
}

function getDefaultScheduledFor() {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  date.setMinutes(0, 0, 0);

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
    publishMode,
    scheduledFor,
    instagramAccountId,
    setPublishMode,
    setScheduledFor,
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

        const accounts = Array.isArray(data.accounts) ? data.accounts : [];
        setInstagramAccounts(accounts);

        if (!instagramAccountId && accounts[0]?.id) {
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
  }, [setInstagramAccountId]);

  const handlePublish = async () => {
    if (!cards || cards.length === 0) {
      setStatus('error');
      setErrorMessage('Gere um carrossel antes de publicar');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // 🔴 PREVENIR DUPLO CLIQUE - Se já está publicando, não faz nada
    if (isLoading) {
      console.warn('⚠️ Publicação já em progresso. Ignorando clique duplo.');
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🛑 Requisição anterior cancelada');
    }

    // Criar novo AbortController para esta requisição
    abortControllerRef.current = new AbortController();

    const template = carouselTemplate;

    setIsLoading(true);
    setStatus('publishing');
    setErrorMessage('');
    setProgress({ current: 0, total: cards.length });

    try {
      const caption = postCaption.trim() || cards[0]?.caption || 'Confira este carrossel! 🎨';

      // Debug: verificar match de template
      const firstCard = cards[0] as any;
      console.log(`📋 PUBLICANDO COM:`);
      console.log(`   Template ativo: ${template}`);
      console.log(`   Template do card: ${firstCard.carouselTemplate}`);
      console.log(`   Total de cards: ${cards.length}`);

      // 🎯 Gerar base64 AGORA com as imagens que foram adicionadas após geração
      console.log('🎬 Gerando base64 dos cards com TODAS as imagens adicionadas...');
      const base64Images: string[] = [];

      for (let i = 0; i < cards.length; i++) {
        setProgress({ current: i + 1, total: cards.length });
        try {
          const cardTemplate = (cards[i] as any).carouselTemplate || template;
          console.log(`📸 Card ${i + 1}/${cards.length}: gerando base64 (tem imagem: ${!!(cards[i] as any).imageUrl})`);

          let base64: string;
          if (cardTemplate === 'vanderMaria') {
            base64 = await renderVanderMariaCardToBase64(cards[i] as any);
          } else {
            base64 = await generateCardBase64(
              cards[i],
              cardTemplate as 'standard' | 'tweet' | 'tweetExpanded'
            );
          }
          base64Images.push(base64);
          console.log(`✅ Card ${i + 1} base64 gerado (${base64.length} chars)`);
        } catch (error) {
          console.error(`❌ Erro ao gerar base64 do card ${i + 1}:`, error);
          throw new Error(`Falha ao gerar imagem do card ${i + 1}`);
        }
      }

      console.log(`✅ ${base64Images.length} base64s prontos para publicação`);

      console.log('📤 Enviando imagens uma a uma para gerar URLs públicas...');
      const imageUrls: string[] = [];

      for (let i = 0; i < base64Images.length; i++) {
        const uploadResponse = await fetch('/api/publish-instagram/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64: base64Images[i],
            cardIndex: i,
            cardHeadline: (cards[i] as any)?.headline || 'Card',
          }),
          signal: abortControllerRef.current?.signal,
        });

        const uploadContentType = uploadResponse.headers.get('content-type') || '';
        const uploadData = uploadContentType.includes('application/json')
          ? await uploadResponse.json()
          : { error: await uploadResponse.text() };

        if (!uploadResponse.ok) {
          throw new Error(String(uploadData.error || 'Falha ao enviar imagem'));
        }

        imageUrls.push(uploadData.url);
        setProgress({ current: i + 1, total: base64Images.length });
      }

      const payload = {
        instagramAccountId: instagramAccountId || instagramAccounts[0]?.id || 'default',
        slides: cards,
        caption,
        carouselTemplate: template,
        imageUrls,
      };

      const endpoint = publishMode === 'scheduled' ? '/api/schedule-publish' : '/api/publish-instagram';

      console.log(`📤 Enviando payload final para ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          publishMode === 'scheduled'
            ? { ...payload, scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : '' }
            : payload
        ),
        signal: abortControllerRef.current?.signal, // 🔴 Usar AbortSignal
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };

      if (!response.ok) {
        const rawError = String(data.error || '');
        if (/request entity too large/i.test(rawError)) {
          throw new Error('O payload da publicação ficou grande demais. Reduza o número de slides ou o tamanho das imagens.');
        }
        throw new Error(rawError || 'Erro ao publicar');
      }

      setStatus('success');
      setPostUrl(
        publishMode === 'scheduled'
          ? ''
          : data.url
      );

      if (publishMode === 'scheduled') {
        console.log('🗓️ Publicação agendada com sucesso.');
        setTimeout(() => {
          setStatus('idle');
          console.log('✅ Agendamento registrado. Pronto para novo carrossel.');
        }, 5000);
      } else {
        // Mantém o último carrossel gerado até que outro seja criado.
        setTimeout(() => {
          setStatus('idle');
          console.log('✅ Carrossel mantido em memória para reuso.');
        }, 5000);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPublishMode('now')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              publishMode === 'now' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Publicar agora
          </button>
          <button
            type="button"
            onClick={() => {
                setPublishMode('scheduled');
                if (!scheduledFor) {
                  setScheduledFor(getDefaultScheduledFor());
                }
              }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              publishMode === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Agendar
          </button>
        </div>

        {publishMode === 'scheduled' && (
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
              Data e hora
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="mt-1 text-xs text-gray-500">
              O horário fica salvo no Blob. Depois, um job externo como GitHub Actions chama a API e publica no momento escolhido.
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
            Conta do Instagram
          </label>
          <select
            value={instagramAccountId || instagramAccounts[0]?.id || ''}
            onChange={(e) => setInstagramAccountId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              Escolha qual conta será usada para publicar ou agendar.
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Se você adicionar mais contas no ambiente, elas vão aparecer aqui.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={isLoading || !cards || cards.length === 0 || (publishMode === 'scheduled' && !scheduledFor)}
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
              : publishMode === 'scheduled' ? 'Agendando...' : 'Publicando...'}
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center justify-center gap-2">
            {publishMode === 'scheduled' ? '✅ Agendado com sucesso!' : '✅ Publicado com sucesso!'}
          </span>
        ) : status === 'error' ? (
          <span className="flex items-center justify-center gap-2">
            ❌ Erro
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {publishMode === 'scheduled' ? '🗓️ Agendar publicação' : '📱 Publicar no Instagram'}
          </span>
        )}
      </button>

      {status === 'success' && postUrl && publishMode === 'now' && (
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

      {status === 'success' && publishMode === 'scheduled' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-semibold mb-1">Carrossel agendado.</p>
          <p className="text-sm text-blue-700">
            O agendamento foi salvo para {instagramAccounts.find((account) => account.id === (instagramAccountId || instagramAccounts[0]?.id))?.label || 'a conta selecionada'}.
          </p>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold text-sm">{errorMessage}</p>
          {errorMessage.includes('BLOB_READ_WRITE_TOKEN') && (
            <p className="mt-2 text-sm text-red-700">
              Vá em Vercel &gt; seu projeto &gt; Settings &gt; Environment Variables e crie
              <code className="mx-1 rounded bg-red-100 px-1 py-0.5">BLOB_READ_WRITE_TOKEN</code>.
              O painel do Blob não mostra esse valor para copiar; ele fica no projeto como variável de ambiente.
            </p>
          )}
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
