'use client';

import { useCarouselStore } from '@/lib/store';
import { useState } from 'react';
import { TweetModelCard } from './TweetModelCard';
import { exportTweetCardAsPNG, exportAsJSON, copyToClipboard } from '@/lib/export';

export function TweetModelViewport() {
  const { cardsTweet, isGenerating } = useCarouselStore();
  const cards = cardsTweet;
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">🐦</div>
        <p className="text-lg font-semibold text-gray-500">Gere um carrossel Tweet para visualizar</p>
        <p className="text-sm text-gray-400 mt-1">Os cards aparecerão aqui em formato Twitter</p>
      </div>
    );
  }

  return (
    <>
      {/* Container principal */}
      <div className="h-full flex flex-col gap-4">
        {/* Export Button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setExportMenu(!exportMenu)}
            disabled={exporting || cards.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <span className="animate-spin">⏳</span>
                Exportando...
              </>
            ) : (
              <>
                📥 Exportar Carrossel
                <span className="text-xs ml-auto">▼</span>
              </>
            )}
          </button>

          {/* Export Menu */}
          {exportMenu && !exporting && cards.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={async () => {
                  setExporting(true);
                  try {
                    for (let i = 0; i < cards.length; i++) {
                      await exportTweetCardAsPNG(cards[i], `tweet-${String(i + 1).padStart(2, '0')}.png`);
                      await new Promise(r => setTimeout(r, 500));
                    }
                  } catch (error) {
                    console.error('Export error:', error);
                  } finally {
                    setExporting(false);
                    setExportMenu(false);
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition"
              >
                <p className="font-semibold text-gray-900">📸 Baixar cada card (PNG)</p>
                <p className="text-xs text-gray-500 mt-1">Salva {cards.length} arquivos</p>
              </button>

              <button
                onClick={() => {
                  exportAsJSON(cards, `tweet-carrossel-${Date.now()}.json`);
                  setExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition"
              >
                <p className="font-semibold text-gray-900">📋 JSON (para reeditar)</p>
                <p className="text-xs text-gray-500 mt-1">Salva estrutura completa</p>
              </button>

              <button
                onClick={async () => {
                  await copyToClipboard(cards);
                  setExportMenu(false);
                  alert('✅ Copiado para clipboard!');
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-lg transition"
              >
                <p className="font-semibold text-gray-900">📋 Copiar Texto</p>
                <p className="text-xs text-gray-500 mt-1">Copia todo o conteúdo</p>
              </button>
            </div>
          )}
        </div>

        {/* Cards Grid - Tweet Style */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {cards.map((card, idx) => (
              <TweetModelCard
                key={card.id}
                card={card}
                idx={idx}
                totalCards={cards.length}
                isFirst={idx === 0}
                isLast={idx === cards.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
