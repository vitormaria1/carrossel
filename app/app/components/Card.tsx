'use client';

import { CarouselCard } from '@/lib/store';
import { useState, useRef } from 'react';
import { InstagramStoryPreview } from './InstagramStoryPreview';

interface CardProps {
  card: CarouselCard;
  onUpdate: (id: string, updates: Partial<CarouselCard>) => void;
  isEditing: boolean;
}

export function Card({ card, onUpdate, isEditing }: CardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🟡 Validar tamanho do arquivo (máx 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert('❌ Arquivo muito grande! Máximo: 5MB. Seu arquivo: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
      return;
    }

    setIsUploadingImage(true);

    // 🟡 Usar Blob URL em vez de base64 para arquivos grandes
    // Blob URL é mais eficiente e não consome RAM como base64
    try {
      const blobUrl = URL.createObjectURL(file);
      onUpdate(card.id, { imageUrl: blobUrl });
      setIsUploadingImage(false);
    } catch (error) {
      console.error('Erro ao criar Blob URL:', error);
      setIsUploadingImage(false);
      alert('Erro ao processar imagem');
    }
  };

  const handleRemoveImage = () => {
    onUpdate(card.id, { imageUrl: undefined });
  };

  // Estilos do Design System Davi
  const isLightBg = card.colors.bg === '#FFFFFF' || card.colors.bg.includes('255');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group">
      {/* Preview Area - Instagram Story Format Simulator */}
      <div
        className="w-full aspect-video flex flex-col items-center justify-between p-6 text-center space-y-4 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: card.colors.bg,
          color: card.colors.text,
          fontFamily: '-apple-system, "system-ui", "Segoe UI", Roboto',
        }}
        onClick={() => setPreviewOpen(true)}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Card Number Badge */}
        <div className="absolute top-3 right-3 text-xs font-bold opacity-60 z-20">
          #{card.order + 1}
        </div>

        {/* Headline - Large & Bold */}
        <div className="flex-1 flex items-center justify-center relative z-10 min-w-0">
          <h3
            className="font-black leading-tight max-w-full line-clamp-3 break-words"
            style={{
              fontSize: '28px',
              letterSpacing: '-0.5px',
            }}
          >
            {card.headline || '...'}
          </h3>
        </div>

        {/* Body Text - Medium */}
        <div className="flex-1 flex items-center justify-center relative z-10 min-w-0">
          <p
            className="leading-snug max-w-full line-clamp-2 break-words"
            style={{
              fontSize: '14px',
              opacity: 0.85,
            }}
          >
            {card.text || '...'}
          </p>
        </div>

        {/* CTA Button - Bottom */}
        <div className="mt-auto pt-2 relative z-10">
          <div
            className="px-4 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105"
            style={{
              backgroundColor: card.colors.accent || '#405DE6',
              color: isLightBg ? '#0C1014' : '#FFFFFF',
            }}
          >
            {card.cta || 'Próximo'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-blue-600 font-bold truncate">{card.cta || 'CTA'}</p>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">#{card.order + 1}</span>
        </div>

        {isEditing && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 py-2 rounded-lg hover:from-blue-100 hover:to-blue-200 transition border border-blue-200"
          >
            {isOpen ? '✕ Fechar' : '✏️ Editar'}
          </button>
        )}

        {isOpen && (
          <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">Headline</label>
              <input
                type="text"
                maxLength={50}
                value={card.headline || ''}
                onChange={(e) => onUpdate(card.id, { headline: e.target.value })}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">Texto</label>
              <textarea
                maxLength={100}
                value={card.text}
                onChange={(e) => onUpdate(card.id, { text: e.target.value })}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">CTA</label>
              <input
                type="text"
                maxLength={50}
                value={card.cta || ''}
                onChange={(e) => onUpdate(card.id, { cta: e.target.value })}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">Imagem</label>
              {card.imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={card.imageUrl}
                    alt="Card"
                    className="w-full h-24 object-cover rounded border border-gray-300"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      Trocar
                    </button>
                    <button
                      onClick={handleRemoveImage}
                      className="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full text-xs px-3 py-2 bg-gray-100 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-200 disabled:bg-gray-400 transition-colors"
                >
                  {isUploadingImage ? '⏳ Carregando...' : '📷 Adicionar Imagem'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Instagram Story Preview Modal */}
      <InstagramStoryPreview card={card} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
