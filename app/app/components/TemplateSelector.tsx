'use client';

import { useCarouselStore } from '@/lib/store';
import type { CarouselTemplate } from '@/lib/store';

export function TemplateSelector() {
  const {
    carouselTemplate,
    setCarouselTemplate,
    cardsStandard,
    cardsTweet,
    cardsTweetExpanded,
  } = useCarouselStore();

  const templates = [
    {
      id: 'standard',
      label: 'Standard',
      description: 'Carrossel clássico com hook, desenvolvimento e CTA',
      icon: '🎨',
      count: cardsStandard.length,
    },
    {
      id: 'tweet',
      label: 'Tweet Model',
      description: 'Estilo Twitter com narrativa clara',
      icon: '🐦',
      count: cardsTweet.length,
    },
    {
      id: 'tweetExpanded',
      label: 'Tweet Expandido',
      description: 'Minimalista dark com destaques',
      icon: '🟥',
      count: cardsTweetExpanded.length,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Templates</p>
          <p className="text-sm text-gray-600">Escolha o formato antes de gerar. Cada template mantém seus próprios cards.</p>
        </div>
        <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
          Template ativo: {templates.find((template) => template.id === carouselTemplate)?.label}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setCarouselTemplate(template.id as CarouselTemplate)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              carouselTemplate === template.id
                ? 'border-blue-600 bg-blue-50 text-gray-900 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg">{template.icon}</span>
              <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-gray-500">
                {template.count} cards
              </span>
            </div>
            <div>
              <div className="font-semibold text-sm">{template.label}</div>
              <div className="mt-1 text-xs text-gray-500">{template.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
