'use client';

import { CarouselCard, useCarouselStore } from '@/lib/store';
import { useMemo, useRef, useState } from 'react';

interface TweetExpandedCardProps {
  card: CarouselCard;
  idx: number;
  totalCards: number;
  isLast: boolean;
}

function renderHighlightedText(text: string) {
  // Highlight syntax: **texto destacado**
  const parts: Array<{ text: string; highlighted: boolean }> = [];
  const re = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), highlighted: false });
    }
    parts.push({ text: match[1], highlighted: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlighted: false });
  }

  return parts.map((p, i) => (
    <span key={i} className={p.highlighted ? 'text-[#A8342F]' : 'text-[#F4F0E8]'}>
      {p.text}
    </span>
  ));
}

export function TweetExpandedCard({ card, idx, totalCards, isLast }: TweetExpandedCardProps) {
  const profileImageUrl =
    'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/teste01/@viniwaknin-2.jpg';

  const { updateCard } = useCarouselStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingCta, setIsEditingCta] = useState(false);
  const [editedText, setEditedText] = useState(card.text);
  const [editedCta, setEditedCta] = useState(card.cta || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const isCtaSlide = isLast;
  const shouldShowImage = idx === 0 || idx === 1 || isLast;

  const mainText = useMemo(() => renderHighlightedText(card.text), [card.text]);

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

  const saveText = () => {
    updateCard(card.id, { text: editedText });
    setIsEditingText(false);
  };

  const cancelText = () => {
    setEditedText(card.text);
    setIsEditingText(false);
  };

  const saveCta = () => {
    updateCard(card.id, { cta: editedCta });
    setIsEditingCta(false);
  };

  const cancelCta = () => {
    setEditedCta(card.cta || '');
    setIsEditingCta(false);
  };

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div
        className="relative w-full aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: '#1A0F0F' }}
      >
        {/* Paddings fixos */}
        <div className="absolute inset-0 px-[50px] pt-[40px] pb-[40px] flex flex-col">
          {/* Header (não aparece no CTA) */}
          {!isCtaSlide && (
            <div className="flex items-center gap-3">
              <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#7A1C1C' }}
              >
                <img
                  src={profileImageUrl}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-tight">
                <div className="text-[14px] font-bold text-[#F4F0E8]">Vander Maria</div>
                <div className="text-[12px] text-[#888]">@vandermarias</div>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 flex items-center justify-center">
            {!isCtaSlide ? (
              <div className="relative w-full group">
                {!isEditingText ? (
                  <>
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div
                        className="w-full text-left font-semibold whitespace-pre-wrap"
                        style={{
                          fontSize: card.text.length < 80 ? 28 : card.text.length <= 150 ? 22 : 21,
                          lineHeight: 1.3,
                        }}
                      >
                        {mainText}
                      </div>

                      {shouldShowImage && (
                        <div className="w-full">
                          {card.imageUrl ? (
                            <div className="relative">
                              <img
                                src={card.imageUrl}
                                alt="Imagem do card"
                                className="w-full max-h-64 object-cover rounded-lg border border-[#333]"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-3 py-1 rounded bg-[#333] text-[#F4F0E8] text-xs font-semibold"
                                >
                                  Trocar
                                </button>
                                <button
                                  onClick={handleRemoveImage}
                                  className="px-3 py-1 rounded bg-[#A8342F] text-[#F4F0E8] text-xs font-semibold"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-4 rounded-lg border border-dashed border-[#333] text-[#F4F0E8] text-sm font-semibold bg-[#120909] hover:bg-[#160b0b] transition"
                              disabled={isUploadingImage}
                            >
                              {isUploadingImage ? 'Carregando...' : '＋ Adicionar imagem'}
                            </button>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditingText(true)}
                      className="absolute -top-10 right-0 px-3 py-1 bg-[#A8342F] text-[#F4F0E8] text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✏️ Editar
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full min-h-40 p-3 rounded border border-[#333] bg-[#120909] text-[#F4F0E8] text-sm outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveText}
                        className="px-3 py-2 rounded bg-[#A8342F] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelText}
                        className="px-3 py-2 rounded bg-[#333] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                    <div className="text-xs text-[#888]">
                      Destaque com <span className="font-mono">**texto**</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full text-center space-y-5">
                <div className="flex justify-center">
                  <img
                    src="/vm-mark.png"
                    alt="Logo"
                    className="h-[72px] w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }}
                  />
                </div>

                {!isEditingText ? (
                  <div className="relative group">
                    <div className="text-[#F4F0E8] font-semibold whitespace-pre-wrap text-[22px] leading-[1.3]">
                      {card.text}
                    </div>
                    <button
                      onClick={() => setIsEditingText(true)}
                      className="absolute -top-10 right-1/2 translate-x-1/2 px-3 py-1 bg-[#A8342F] text-[#F4F0E8] text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✏️ Editar texto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full min-h-32 p-3 rounded border border-[#333] bg-[#120909] text-[#F4F0E8] text-sm outline-none"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={saveText}
                        className="px-3 py-2 rounded bg-[#A8342F] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelText}
                        className="px-3 py-2 rounded bg-[#333] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {shouldShowImage && (
                  <div className="w-full">
                    {card.imageUrl ? (
                      <div className="relative">
                        <img
                          src={card.imageUrl}
                          alt="Imagem do card"
                          className="w-full max-h-56 object-cover rounded-lg border border-[#333]"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1 rounded bg-[#333] text-[#F4F0E8] text-xs font-semibold"
                          >
                            Trocar
                          </button>
                          <button
                            onClick={handleRemoveImage}
                            className="px-3 py-1 rounded bg-[#A8342F] text-[#F4F0E8] text-xs font-semibold"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 rounded-lg border border-dashed border-[#333] text-[#F4F0E8] text-sm font-semibold bg-[#120909] hover:bg-[#160b0b] transition"
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? 'Carregando...' : '＋ Adicionar imagem'}
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {!isEditingCta ? (
                  <div className="relative group flex justify-center">
                    <button className="px-6 py-3 rounded bg-[#A8342F] text-[#F4F0E8] font-bold uppercase tracking-wide">
                      {card.cta || 'SAIBA MAIS'}
                    </button>
                    <button
                      onClick={() => setIsEditingCta(true)}
                      className="absolute -top-10 right-1/2 translate-x-1/2 px-3 py-1 bg-[#333] text-[#F4F0E8] text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✏️ Editar botão
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      value={editedCta}
                      onChange={(e) => setEditedCta(e.target.value)}
                      className="w-full p-3 rounded border border-[#333] bg-[#120909] text-[#F4F0E8] text-sm outline-none text-center"
                      placeholder="Texto do botão"
                      maxLength={32}
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={saveCta}
                        className="px-3 py-2 rounded bg-[#A8342F] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelCta}
                        className="px-3 py-2 rounded bg-[#333] text-[#F4F0E8] text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="h-px w-full bg-[#333]" />
            <div className="flex justify-between pt-2 text-[11px] text-[#666]">
              <span>Vander Maria</span>
              <span>@vandermarias</span>
            </div>
            <div className="pt-2 text-[10px] text-[#444] text-center">
              {idx + 1}/{totalCards}
            </div>
          </div>
        </div>
      </div>

      {/* Metadados / Debug */}
      <div className="px-4 py-3 text-xs text-gray-500 flex items-center justify-between">
        <span>Tweet Expandido</span>
        <span>{isCtaSlide ? 'CTA' : `Slide ${idx + 1}`}</span>
      </div>
    </div>
  );
}
