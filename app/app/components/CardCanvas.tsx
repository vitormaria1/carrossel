'use client';

import { CarouselCard, useCarouselStore } from '@/lib/store';
import { Card } from './Card';
import { useState } from 'react';
import { exportCardAsPNG, exportAsJSON, copyToClipboard } from '@/lib/export';

export function CardCanvas() {
  const { cards, updateCard, updateAllCards } = useCarouselStore();
  const [batchMode, setBatchMode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🎨</div>
        <p className="text-lg font-semibold text-gray-500">Gere um carrossel para visualizar</p>
        <p className="text-sm text-gray-400 mt-1">Os cards aparecerão aqui em tempo real</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{cards.length} Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Pronto para editar e publicar</p>
        </div>
        <button
          onClick={() => setBatchMode(!batchMode)}
          className={`px-4 py-2 rounded-lg font-bold transition transform hover:scale-105 ${
            batchMode
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {batchMode ? '✓ Edição em Lote' : '⚙️ Modo Lote'}
        </button>
      </div>

      {/* Batch Mode Panel */}
      {batchMode && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 space-y-4">
          <h3 className="font-bold text-purple-900 text-sm uppercase tracking-wide">Editar Todos os Cards</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide">Background</label>
              <input
                type="color"
                defaultValue="#405DE6"
                onChange={(e) => updateAllCards({ colors: { ...cards[0]?.colors, bg: e.target.value } })}
                className="w-full h-10 rounded-lg cursor-pointer border border-purple-300 hover:border-purple-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide">Texto</label>
              <input
                type="color"
                defaultValue="#FFFFFF"
                onChange={(e) => updateAllCards({ colors: { ...cards[0]?.colors, text: e.target.value } })}
                className="w-full h-10 rounded-lg cursor-pointer border border-purple-300 hover:border-purple-400 transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={updateCard}
            isEditing={true}
          />
        ))}
      </div>

      {/* Export Menu */}
      <div className="border-t border-gray-200 pt-6 mt-8 space-y-4">
        <div className="relative">
          <button
            onClick={() => setExportMenu(!exportMenu)}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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

          {exportMenu && !exporting && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={async () => {
                  setExporting(true);
                  try {
                    for (let i = 0; i < cards.length; i++) {
                      await exportCardAsPNG(cards[i], `card-${String(i + 1).padStart(2, '0')}.png`);
                      // Pequeno delay entre downloads
                      await new Promise(r => setTimeout(r, 500));
                    }
                  } catch (error) {
                    console.error('Export error:', error);
                  } finally {
                    setExporting(false);
                    setExportMenu(false);
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <p className="font-semibold text-gray-900">📸 Baixar cada card (PNG)</p>
                <p className="text-xs text-gray-500 mt-1">Salva {cards.length} arquivos</p>
              </button>

              <button
                onClick={() => {
                  exportAsJSON(cards, `carrossel-backup-${Date.now()}.json`);
                  setExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
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

        {/* Publish CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">Pronto para publicar?</p>
            <p className="text-xs text-blue-700 mt-1">Cole na galeria do Instagram</p>
          </div>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition transform hover:scale-105 text-sm"
          >
            📱 Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
