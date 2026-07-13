'use client';

import { useState } from 'react';
import { CarouselCard } from '@/lib/store';

interface PublishDialogProps {
  cards: CarouselCard[];
  isOpen: boolean;
  onClose: () => void;
}

export function PublishDialog({ cards, isOpen, onClose }: PublishDialogProps) {
  const [step, setStep] = useState<'ready' | 'exporting' | 'instructions' | 'success'>('ready');
  const [selectedFormat, setSelectedFormat] = useState<'individual' | 'workspace'>('workspace');

  const handleExport = async () => {
    setStep('exporting');
    try {
      const { exportAsJSON, exportCardAsPNG } = await import('@/lib/export');
      for (let i = 0; i < cards.length; i++) {
        await exportCardAsPNG(cards[i], `card-${String(i + 1).padStart(2, '0')}.png`);
        await new Promise(r => setTimeout(r, 300));
      }

      if (selectedFormat === 'workspace') {
        exportAsJSON(cards, `carrossel-${Date.now()}.json`);
        downloadInstructions(cards.length);
      }
      setStep('instructions');
    } catch (error) {
      console.error('Export error:', error);
      setStep('ready');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Step 1: Ready to Export */}
        {step === 'ready' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📱 Publicar no Instagram</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Escolha como deseja baixar seus cards. O modo workspace também salva um JSON para reedição posterior.
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
                onClick={() => setSelectedFormat('workspace')}
              >
                <input
                  type="radio"
                  checked={selectedFormat === 'workspace'}
                  onChange={() => setSelectedFormat('workspace')}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">🗂️ Workspace completo</p>
                  <p className="text-sm text-gray-500">Baixa imagens + JSON + instruções</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
                onClick={() => setSelectedFormat('individual')}
              >
                <input
                  type="radio"
                  checked={selectedFormat === 'individual'}
                  onChange={() => setSelectedFormat('individual')}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">📸 Somente imagens</p>
                  <p className="text-sm text-gray-500">Um arquivo PNG por card</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                ⬇️ Começar Download
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Exporting */}
        {step === 'exporting' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-block">
                <div className="animate-spin text-4xl">⏳</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Processando...</h3>
            <p className="text-gray-600">Gerando imagens de alta qualidade (1080x1920)</p>
          </div>
        )}

        {/* Step 3: Instructions */}
        {step === 'instructions' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📲 Como Postar no Instagram</h2>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Abra o Instagram</h3>
                  <p className="text-sm text-gray-600">App ou web em instagram.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Clique em Criar e depois Carrossel</h3>
                  <p className="text-sm text-gray-600">Ou toque no ícone + para novo post</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Selecione todos os {cards.length} cards</h3>
                  <p className="text-sm text-gray-600">Na ordem (01, 02, 03... 10)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adicione legenda e hashtags</h3>
                  <p className="text-sm text-gray-600">Ex: #MeuCarrossel #Copy #Instagram</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Clique em Compartilhar</h3>
                  <p className="text-sm text-gray-600">E pronto! Seu carrossel está live 🎉</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>💡 Dica:</strong> Os cards já estão no tamanho correto (1080x1920) para Stories, Reels e Feed do Instagram!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('ready')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                ← Voltar
              </button>
              <button
                onClick={() => {
                  onClose();
                  setStep('ready');
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                ✓ Entendi, Vou Postar!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function downloadInstructions(cardCount: number) {
  const content = `Seu carrossel está pronto.

1. Abra o Instagram.
2. Crie um post em carrossel.
3. Selecione os arquivos na ordem: 01, 02, 03...
4. Use o JSON salvo para reeditar ou reaproveitar a copy depois.

Total de cards: ${cardCount}
Formato sugerido: Feed 4:5 ou Story, dependendo do template exportado.
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'README-carrossel.txt';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
