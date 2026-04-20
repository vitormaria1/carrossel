'use client';

import { useState } from 'react';
import { CarouselCard } from '@/lib/store';
import { exportAllCardsAsZip } from '@/lib/export';

interface PublishDialogProps {
  cards: CarouselCard[];
  isOpen: boolean;
  onClose: () => void;
}

export function PublishDialog({ cards, isOpen, onClose }: PublishDialogProps) {
  const [step, setStep] = useState<'ready' | 'exporting' | 'instructions' | 'success'>('ready');
  const [selectedFormat, setSelectedFormat] = useState<'zip' | 'individual'>('zip');

  const handleExport = async () => {
    setStep('exporting');
    try {
      if (selectedFormat === 'zip') {
        await exportCardsAsZip(cards);
      } else {
        // Exportar individual
        const { exportCardAsPNG } = await import('@/lib/export');
        for (let i = 0; i < cards.length; i++) {
          await exportCardAsPNG(cards[i], `card-${String(i + 1).padStart(2, '0')}.png`);
          await new Promise(r => setTimeout(r, 300));
        }
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
              Escolha como deseja baixar seus cards. Recomendamos o <strong>ZIP</strong> para ter tudo organizado.
            </p>

            <div className="space-y-3 mb-6">
              {/* ZIP Option */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
                onClick={() => setSelectedFormat('zip')}
              >
                <input
                  type="radio"
                  checked={selectedFormat === 'zip'}
                  onChange={() => setSelectedFormat('zip')}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">📦 Baixar como ZIP</p>
                  <p className="text-sm text-gray-500">Todos os {cards.length} cards em 1 arquivo + instruções</p>
                </div>
              </label>

              {/* Individual Option */}
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
                  <p className="font-semibold text-gray-900">📸 Baixar cards individuais</p>
                  <p className="text-sm text-gray-500">Um arquivo PNG por card (mais lento)</p>
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
                  <h3 className="font-semibold text-gray-900">Clique em "Criar" → "Carrossel"</h3>
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
                  <h3 className="font-semibold text-gray-900">Clique "Compartilhar"</h3>
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

/**
 * Export cards as ZIP com melhorias
 */
async function exportCardsAsZip(cards: CarouselCard[]) {
  const JSZip = (window as any).JSZip;
  if (!JSZip) {
    console.error('JSZip not available');
    return;
  }

  const { exportCardAsPNG, createCardCanvas } = await import('@/lib/export');
  const zip = new JSZip();

  // Criar pasta com data/timestamp
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];
  const folder = zip.folder(`carrossel-${timestamp}`);

  if (!folder) throw new Error('Failed to create folder');

  // Adicionar cards
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // Dinamicamente importar para evitar circular dependency
    const { createCardCanvas: createCanvas } = await import('@/lib/export');
    const canvas = createCanvas(card);

    await new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          folder.file(`${String(i + 1).padStart(2, '0')}-card.png`, blob);
        }
        resolve();
      }, 'image/png');
    });
  }

  // Adicionar README com instruções
  const readme = `# Seu Carrossel está Pronto! 🎉

## Como Usar

1. **Abra o Instagram**
   - App ou web em instagram.com

2. **Clique em "Criar" → "Carrossel"**
   - Ou toque no ícone + para novo post

3. **Selecione as imagens na ordem**
   - 01-card.png, 02-card.png, ... ${String(cards.length).padStart(2, '0')}-card.png

4. **Adicione legenda e hashtags**
   - Use: #MeuCarrossel #Copy #Instagram

5. **Compartilhe!** 🚀

## Tamanho

✅ Todas as imagens estão em **1080x1920**
✅ Perfeito para Stories, Reels e Feed do Instagram

---

Criado com ❤️ por carrossel.ai
`;

  folder.file('README.txt', readme);

  // Gerar ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `carrossel-${timestamp}.zip`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
