'use client';

import { CarouselCard, useCarouselStore } from '@/lib/store';
import { useState, useRef } from 'react';

interface TweetModelCardProps {
  card: CarouselCard;
  idx: number;
  totalCards: number;
  isFirst: boolean;
  isLast: boolean;
}

export function TweetModelCard({ card, idx, totalCards, isFirst, isLast }: TweetModelCardProps) {
  const { updateCard } = useCarouselStore();
  const [imageHover, setImageHover] = useState(false);
  const [textHover, setTextHover] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [editedText, setEditedText] = useState(card.text);
  const [editedHeadline, setEditedHeadline] = useState(card.headline || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const headlineInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateCard(card.id, { imageUrl: dataUrl });
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    updateCard(card.id, { imageUrl: undefined });
  };

  const handleSaveText = () => {
    updateCard(card.id, { text: editedText });
    setIsEditingText(false);
  };

  const handleCancelEdit = () => {
    setEditedText(card.text);
    setIsEditingText(false);
  };

  const handleSaveHeadline = () => {
    updateCard(card.id, { headline: editedHeadline });
    setIsEditingHeadline(false);
  };

  const handleCancelHeadlineEdit = () => {
    setEditedHeadline(card.headline || '');
    setIsEditingHeadline(false);
  };

  // Apenas mostrar foto no primeiro e último card
  const shouldShowImage = isFirst || isLast;

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Tweet Header com Perfil */}
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <img
            src="https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/teste01/@viniwaknin-2.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start flex-col">
              <span className="font-bold text-gray-900">Vitor Maria</span>
              <span className="text-gray-500 text-sm">@vitor_smaria</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet Headline (se existir) */}
      {card.headline && (
        <div className="px-4 py-2 border-b border-gray-100 relative group">
          {!isEditingHeadline ? (
            <>
              <h3 className="font-bold text-gray-900 text-sm break-words">
                {card.headline}
              </h3>
              <button
                onClick={() => setIsEditingHeadline(true)}
                className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                ✏️
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <input
                ref={headlineInputRef}
                type="text"
                maxLength={50}
                value={editedHeadline}
                onChange={(e) => setEditedHeadline(e.target.value)}
                className="w-full px-3 py-2 border border-blue-500 rounded text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveHeadline}
                  className="flex-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
                >
                  ✅
                </button>
                <button
                  onClick={handleCancelHeadlineEdit}
                  className="flex-1 px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded hover:bg-gray-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tweet Text */}
      <div
        className="px-4 py-3 flex-1 relative group"
        onMouseEnter={() => setTextHover(true)}
        onMouseLeave={() => setTextHover(false)}
      >
        {!isEditingText ? (
          <>
            <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {card.text || '...'}
            </p>
            {textHover && (
              <button
                onClick={() => setIsEditingText(true)}
                className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                ✏️ Editar
              </button>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full px-3 py-2 border border-blue-500 rounded text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveText}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
              >
                ✅ Salvar
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-3 py-2 bg-gray-400 text-white text-xs font-semibold rounded hover:bg-gray-500 transition-colors"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tweet Image (se for primeiro ou último) */}
      {shouldShowImage && (
        <div
          className="relative bg-gray-100 overflow-hidden"
          style={{ aspectRatio: '16 / 9' }}
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          {card.imageUrl ? (
            <>
              <img
                src={card.imageUrl}
                alt="Card"
                className="w-full h-full object-cover"
              />
              {imageHover && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
                  >
                    Trocar
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-gray-600 text-xs font-medium">Adicionar Imagem</p>
              </div>
            </div>
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
      )}
    </div>
  );
}
