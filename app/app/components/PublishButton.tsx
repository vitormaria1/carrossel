'use client';

import { useState, useRef } from 'react';
import { useCarouselStore } from '@/lib/store';
import { generateCardBase64 } from '@/lib/export'; // Fallback para regeneração se necessário
import { renderVanderMariaCardToBase64 } from '@/lib/vander-maria';

export function PublishButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    carouselTemplate,
    cards,
    clearAllCards,
  } = useCarouselStore();

  function base64ToBlob(base64: string, mimeType = 'image/jpeg') {
    const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(rawBase64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
  }

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
      const caption = cards[0]?.caption || 'Confira este carrossel! 🎨';

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

      // Enviar imagens como multipart/form-data para reduzir o payload do request
      console.log('📤 Enviando para o servidor...');
      const formData = new FormData();
      formData.append('slides', JSON.stringify(cards));
      formData.append('caption', caption);
      formData.append('carouselTemplate', template);

      base64Images.forEach((base64, index) => {
        const blob = base64ToBlob(base64);
        formData.append(
          'images',
          blob,
          `card-${String(index + 1).padStart(2, '0')}.jpg`
        );
      });

      const response = await fetch('/api/publish-instagram', {
        method: 'POST',
        body: formData,
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
      setPostUrl(data.url);

      // 🟡 Resetar store após sucesso
      setTimeout(() => {
        setStatus('idle');

        clearAllCards();

        console.log('🧹 Store resetado. Pronto para novo carrossel.');
      }, 5000);
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
      <button
        onClick={handlePublish}
        disabled={isLoading || !cards || cards.length === 0}
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
          <span className="flex items-center justify-center gap-2">
            ✅ Publicado com sucesso!
          </span>
        ) : status === 'error' ? (
          <span className="flex items-center justify-center gap-2">
            ❌ Erro
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            📱 Publicar no Instagram
          </span>
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
