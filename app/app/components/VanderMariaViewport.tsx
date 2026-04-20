'use client';

import { useEffect, useState } from 'react';
import { useCarouselStore } from '@/lib/store';
import { VanderMariaFullscreenModal } from './VanderMariaFullscreenModal';

export function VanderMariaViewport() {
  const { cardsVanderMaria, isGenerating } = useCarouselStore();
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>({});
  const [renderingState, setRenderingState] = useState<{
    current: number;
    total: number;
    status: 'idle' | 'rendering' | 'complete' | 'error';
    error?: string;
  }>({ current: -1, total: 0, status: 'idle' });
  const [fullscreenCard, setFullscreenCard] = useState<{ index: number; imageUrl: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Renderizar cards em canvas e criar previews (paralelo)
    const renderPreviews = async () => {
      const { renderVanderMariaCardToBase64 } = await import('@/lib/vander-maria');
      const total = cardsVanderMaria.length;

      setRenderingState({
        current: 0,
        total,
        status: 'rendering',
      });

      try {
        // Renderizar todos em paralelo
        const base64Array = await Promise.all(
          cardsVanderMaria.map((card, i) =>
            renderVanderMariaCardToBase64(card as any)
              .then(base64 => {
                setRenderingState(prev => ({ ...prev, current: i + 1 }));
                return base64;
              })
              .catch(error => {
                console.error(`Erro renderizando card ${i}:`, error);
                return null;
              })
          )
        );

        // Verificar se todos os cards foram renderizados com sucesso
        const failedCount = base64Array.filter(b => !b).length;
        if (failedCount > 0) {
          setRenderingState({
            current: total,
            total,
            status: 'error',
            error: `${failedCount} card(s) falharam ao renderizar`,
          });
          return;
        }

        // Update previews
        const newPreviews: { [key: string]: string } = {};
        base64Array.forEach((base64, i) => {
          if (base64) {
            newPreviews[cardsVanderMaria[i].id] = base64;
          }
        });
        setPreviewImages(newPreviews);

        setRenderingState({
          current: total,
          total,
          status: 'complete',
        });
      } catch (error) {
        setRenderingState({
          current: 0,
          total,
          status: 'error',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    if (cardsVanderMaria.length > 0) {
      renderPreviews();
    }
  }, [cardsVanderMaria]);

  if (isGenerating || renderingState.status === 'rendering') {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 bg-gradient-to-br from-burgundy-50 to-pink-50 rounded-lg">
        <div className="animate-spin text-4xl">✨</div>
        <p className="text-lg font-semibold text-burgundy-900">
          {isGenerating ? 'Gerando carrossel Vander Maria...' : 'Renderizando cards...'}
        </p>
        {renderingState.total > 0 && (
          <p className="text-sm text-burgundy-700">
            {renderingState.current} de {renderingState.total} slides
          </p>
        )}
      </div>
    );
  }

  if (renderingState.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 bg-red-50 rounded-lg border border-red-300">
        <div className="text-4xl">⚠️</div>
        <p className="text-lg font-semibold text-red-900">Erro ao renderizar</p>
        <p className="text-sm text-red-700">{renderingState.error}</p>
      </div>
    );
  }

  if (cardsVanderMaria.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-5xl">🎬</div>
        <p className="text-gray-500 font-medium">Gere um carrossel Vander Maria para visualizar</p>
      </div>
    );
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      for (let i = 0; i < cardsVanderMaria.length; i++) {
        const imageUrl = previewImages[cardsVanderMaria[i].id];
        if (!imageUrl) continue;

        // Converter data URL para blob e download
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vander-maria-slide-${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Pequeno delay entre downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar imagens');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-burgundy-900 to-burgundy-800 p-4 rounded-lg text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Vander Maria - 5 Slides Cinemáticos</h2>
          <p className="text-sm text-burgundy-100 mt-1">Carrossel pronto para publicar</p>
        </div>
        {cardsVanderMaria.length > 0 && renderingState.status === 'complete' && (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white text-burgundy-900 px-4 py-2 rounded-lg font-semibold hover:bg-burgundy-50 disabled:opacity-50 transition-all"
          >
            {isExporting ? 'Exportando...' : '⬇️ Exportar'}
          </button>
        )}
      </div>

      {/* Miniaturas em grid 4 colunas */}
      <div className="grid grid-cols-4 gap-4">
        {cardsVanderMaria.map((card, idx) => (
          <VanderMariaCardThumbnail
            key={card.id}
            card={card}
            index={idx}
            previewImage={previewImages[card.id]}
            onFullscreen={() => setFullscreenCard({ index: idx, imageUrl: previewImages[card.id] })}
          />
        ))}
      </div>

      {/* Modal fullscreen */}
      {fullscreenCard && (
        <VanderMariaFullscreenModal
          imageUrl={fullscreenCard.imageUrl}
          cardIndex={fullscreenCard.index}
          onClose={() => setFullscreenCard(null)}
        />
      )}
    </div>
  );
}

interface VanderMariaCardThumbnailProps {
  card: any;
  index: number;
  previewImage?: string;
  onFullscreen?: () => void;
}

function VanderMariaCardThumbnail({
  card,
  index,
  previewImage,
  onFullscreen,
}: VanderMariaCardThumbnailProps) {
  const typeEmojis: { [key: number]: string } = {
    1: '📸',
    2: '📷',
    3: '📝',
    4: '🎨',
    5: '✉️',
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Imagem Preview - Aspecto 9:12 (Instagram) */}
      <div
        className="relative w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden cursor-pointer group"
        onClick={onFullscreen}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">{typeEmojis[card.slideType]}</div>
              <div className="text-sm">Type {card.slideType}</div>
            </div>
          </div>
        )}

        {/* Badge com número do slide */}
        <div className="absolute top-2 right-2 bg-burgundy-900 text-white px-3 py-1 rounded text-sm font-bold shadow-lg">
          {index + 1}
        </div>

        {/* Ícone fullscreen no hover */}
        {previewImage && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="text-white text-3xl">⛶</div>
          </div>
        )}
      </div>

      {/* Informações compactas */}
      <div className="flex-1 flex flex-col gap-2">
        <p className="font-semibold text-gray-900 line-clamp-2 text-sm">{card.textInScreen}</p>
        <p className="text-gray-600 line-clamp-1 text-xs">
          {card.slideType === 1 && 'Cover'}
          {card.slideType === 2 && 'Supporting'}
          {card.slideType === 3 && 'Conceptual'}
          {card.slideType === 4 && 'High-Impact'}
          {card.slideType === 5 && 'CTA'}
        </p>
      </div>
    </div>
  );
}
