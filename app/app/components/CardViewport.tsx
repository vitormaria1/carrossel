'use client';

import { CarouselCard, useCarouselStore } from '@/lib/store';
import { useState } from 'react';
import { InstagramStoryPreview } from './InstagramStoryPreview';
import { PublishDialog } from './PublishDialog';
import { exportCardAsPNG, exportAsJSON, copyToClipboard } from '@/lib/export';

export function CardViewport() {
  const { cardsStandard } = useCarouselStore();
  const cards = cardsStandard;
  const [previewCard, setPreviewCard] = useState<CarouselCard | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!previewCard) return;

    if (e.key === 'ArrowRight') {
      const idx = cards.findIndex(c => c.id === previewCard.id);
      if (idx < cards.length - 1) {
        setPreviewCard(cards[idx + 1]);
      }
    } else if (e.key === 'ArrowLeft') {
      const idx = cards.findIndex(c => c.id === previewCard.id);
      if (idx > 0) {
        setPreviewCard(cards[idx - 1]);
      }
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">🎨</div>
        <p className="text-lg font-semibold text-gray-500">Gere um carrossel para visualizar</p>
        <p className="text-sm text-gray-400 mt-1">Os cards aparecerão aqui em tamanho proporcional</p>
      </div>
    );
  }

  return (
    <>
      {/* Container principal com flex column */}
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
                onClick={() => {
                  setShowPublishDialog(true);
                  setExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 bg-blue-50/50 transition"
              >
                <p className="font-semibold text-blue-900">📱 Publicar no Instagram</p>
                <p className="text-xs text-blue-700 mt-1">Modo guiado + Download automático</p>
              </button>

              <button
                onClick={async () => {
                  setExporting(true);
                  try {
                    for (let i = 0; i < cards.length; i++) {
                      await exportCardAsPNG(cards[i], `card-${String(i + 1).padStart(2, '0')}.png`);
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

        {/* Container com galeria de cards - VISÃO COMPLETA */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-auto p-4">
          {/* Grid: 4 columns no desktop, 2 no tablet, 1 no mobile - ESTILO INSTAGRAM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {cards.map((card, idx) => (
              <div key={card.id} className="flex flex-col">
                {/* Card Counter */}
                <div className="mb-2 text-xs font-semibold text-gray-600">
                  Card {idx + 1}
                </div>

                {/* Card - Tamanho compacto mas completo */}
                <div
                  className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-black cursor-pointer"
                  onClick={() => setPreviewCard(card)}
                  style={{
                    backgroundColor: card.colors.bg,
                    aspectRatio: '3 / 4',
                  }}
                >
                  {/* Status Bar */}
                  <div className="bg-black px-3 py-1.5 z-20">
                    <div className="flex justify-between items-center text-white text-xs">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-0.5 flex-1 bg-white opacity-70"
                          ></div>
                        ))}
                      </div>
                      <span>9:41</span>
                    </div>
                  </div>

                  {/* Content - Completo, sem truncamento */}
                  <div
                    className="flex flex-col p-4 text-center h-full"
                    style={{
                      backgroundColor: card.colors.bg,
                      color: card.colors.text,
                      fontFamily: '-apple-system, "system-ui", "Segoe UI", Roboto',
                    }}
                  >
                    {/* Headline - Mostrar apenas se existir */}
                    {card.headline && (
                      <div className="px-2 pt-2 flex-shrink-0">
                        <h3
                          className="font-black leading-tight break-words"
                          style={{
                            fontSize: '18px',
                            letterSpacing: '-0.5px',
                            marginBottom: '12px',
                          }}
                        >
                          {card.headline}
                        </h3>
                      </div>
                    )}

                    {/* Body Text - Completo, sem cortar, com scroll se necessário */}
                    <div className="px-2 py-4 flex-1 overflow-y-auto min-h-0 w-full">
                      <p
                        className="leading-relaxed break-words"
                        style={{
                          fontSize: '13px',
                          opacity: 0.9,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {card.text || '...'}
                      </p>
                    </div>

                    {/* Card Number */}
                    <div
                      className="absolute top-8 right-2 text-xs font-bold opacity-50"
                      style={{ color: card.colors.text }}
                    >
                      #{card.order + 1}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {previewCard && (
        <div onKeyDown={handleKeyDown} tabIndex={0}>
          <InstagramStoryPreview
            card={previewCard}
            isOpen={true}
            onClose={() => setPreviewCard(null)}
          />
        </div>
      )}

      {/* Publish Dialog */}
      <PublishDialog
        cards={cards}
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
      />
    </>
  );
}
