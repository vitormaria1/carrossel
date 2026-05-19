'use client';

import { useCarouselStore } from '@/lib/store';
import { useState } from 'react';
import { TweetExpandedCard } from './TweetExpandedCard';
import { exportTweetExpandedCardAsPNG, exportAsJSON, copyToClipboard } from '@/lib/export';

export function TweetExpandedViewport() {
  const { cardsTweetExpanded } = useCarouselStore();
  const cards = cardsTweetExpanded;
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">🟥</div>
        <p className="text-lg font-semibold text-gray-500">Gere um carrossel Tweet Expandido para visualizar</p>
        <p className="text-sm text-gray-400 mt-1">Os cards aparecerão aqui com o modelo minimalista dark</p>
      </div>
    );
  }

  const handleExportImages = async () => {
    setExporting(true);
    try {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const isLast = i === cards.length - 1;
        await exportTweetExpandedCardAsPNG(card, isLast, `tweet-expandido-${String(i + 1).padStart(2, '0')}.jpg`);
      }
    } finally {
      setExporting(false);
      setExportMenu(false);
    }
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      await exportAsJSON(cards, 'tweet-expandido.json');
    } finally {
      setExporting(false);
      setExportMenu(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(cards.map(c => c.text).join('\n\n---\n\n'));
    setExportMenu(false);
  };

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setExportMenu(!exportMenu)}
            disabled={exporting || cards.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#A8342F] to-[#7A1C1C] text-white font-bold rounded-lg hover:from-[#b43a34] hover:to-[#6b1717] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <span className="animate-spin">⏳</span>
                Exportando...
              </>
            ) : (
              <>
                <span>📦</span>
                Exportar
              </>
            )}
          </button>

          {exportMenu && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={handleExportImages}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
              >
                <span>🖼️</span>
                <div>
                  <div className="font-semibold text-sm">Exportar imagens</div>
                  <div className="text-xs text-gray-500">JPEG 1080x1350 (4:5)</div>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
              >
                <span>📄</span>
                <div>
                  <div className="font-semibold text-sm">Exportar JSON</div>
                  <div className="text-xs text-gray-500">Estrutura dos cards</div>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
              >
                <span>📋</span>
                <div>
                  <div className="font-semibold text-sm">Copiar texto</div>
                  <div className="text-xs text-gray-500">Todos os slides</div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <TweetExpandedCard
              key={card.id}
              card={card}
              idx={idx}
              totalCards={cards.length}
              isLast={idx === cards.length - 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}

