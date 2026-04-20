'use client';

import { useCarouselStore } from '@/lib/store';

export function TemplateSelector() {
  const { carouselTemplate, setCarouselTemplate } = useCarouselStore();

  const templates = [
    {
      id: 'tweet',
      label: 'Tweet Model',
      description: 'Estilo Twitter com narrativa clara',
      icon: '🐦',
    },
    {
      id: 'vanderMaria',
      label: 'Vander Maria',
      description: 'Carrossel cinemático com 5 slides profissionais',
      icon: '🎬',
    },
  ];

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setCarouselTemplate(template.id as any)}
            className={`flex gap-2 pb-2 border-b-2 transition-all ${
              carouselTemplate === template.id
                ? 'border-blue-600 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-lg">{template.icon}</span>
            <div className="text-left">
              <div className="font-semibold text-sm">{template.label}</div>
              <div className="text-xs text-gray-500">{template.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
