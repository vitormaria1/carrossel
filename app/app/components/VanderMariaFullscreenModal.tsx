'use client';

import { useEffect } from 'react';

interface VanderMariaFullscreenModalProps {
  imageUrl: string;
  onClose: () => void;
  cardIndex: number;
}

export function VanderMariaFullscreenModal({
  imageUrl,
  onClose,
  cardIndex,
}: VanderMariaFullscreenModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-screen w-full h-full flex flex-col">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
          title="Fechar (Esc)"
        >
          ✕
        </button>

        {/* Imagem */}
        <img
          src={imageUrl}
          alt={`Slide ${cardIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Info */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded text-sm">
          Slide {cardIndex + 1} • Pressione ESC para fechar
        </div>
      </div>
    </div>
  );
}
