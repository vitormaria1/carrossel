'use client';

import { InputForm } from './components/InputForm';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateViewport } from './components/TemplateViewport';
import { UserContextForm } from './components/UserContextForm';
import { PublishButton } from './components/PublishButton';
import { useCarouselStore } from '@/lib/store';
import { useUserContext } from '@/lib/user-context';
import { useState } from 'react';
import { generateVanderMariaCarousel } from '@/lib/vander-maria';

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(false);
  const { idea, prompt, totalCards, setCards, setIsGenerating, carouselType, carouselTemplate } = useCarouselStore();
  const { expertise, yearsExperience, mainAchievement, productName, targetAudience, toneOfVoice, objective } =
    useUserContext();

  const handleGenerate = async () => {
    if (!idea) return;

    setIsLoading(true);
    setIsGenerating(true);

    try {
      if (carouselTemplate === 'vanderMaria') {
        console.log('🎬 Gerando carrossel VANDER MARIA...');

        const vanderCards = await generateVanderMariaCarousel(
          {
            topic: idea,
            customization: prompt,
            targetAudience: targetAudience || undefined,
          },
          (step) => console.log(`📍 ${step}`)
        );

        const formattedCards = vanderCards.map((card: any) => ({
          ...card,
          carouselTemplate: 'vanderMaria',
        }));

        setCards(formattedCards);
        console.log('✅ Carrossel Vander Maria gerado! 5 slides prontos.');
        return;
      }

      const res = await fetch('/api/generate-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          customization: prompt,
          totalCards,
          expertise,
          targetAudience,
          toneOfVoice,
          carouselTemplate: 'tweet',
          carouselType: carouselType === 'auto' ? undefined : carouselType,
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao gerar carrossel');
      }

      const data = await res.json();

      if (data.cards) {
        const cards = data.cards.map((card: any, idx: number) => {
          const colors = { bg: '#FFFFFF', text: '#0C1014' };
          return {
            id: `card-${idx}`,
            text: card.text,
            headline: card.headline,
            cta: card.cta,
            caption: idx === 0 ? data.caption : undefined,
            imageType: 'html' as const,
            colors,
            order: idx,
            carouselTemplate: 'tweet',
          };
        });

        setCards(cards);
        console.log('✅ Cards Tweet salvos!');
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Falha na geração'}`);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-700">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                carrossel<span className="text-blue-500">.</span>ai
              </h1>
              <p className="text-gray-400 mt-1 text-sm">Transforme ideias em carrosséis que convertem</p>
            </div>
            <div className="text-4xl">📱</div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-12">
        <div className="px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Do prompt para o Instagram em <span className="text-blue-600">30 segundos</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              IA que entende narrativa. Copy que converte. Design que inspira.
            </p>
          </div>
        </div>
      </section>

      <TemplateSelector />

      <div className="flex gap-8 px-6 py-8 min-h-[calc(100vh-280px)]">
        <div className="w-auto flex-shrink-0">
          <div className="sticky top-8 space-y-4 w-80">
            <UserContextForm />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-white font-bold text-lg">Criar Carrossel</h3>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
                <PublishButton />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <TemplateViewport />
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="px-6 text-center text-gray-500 text-sm">
          Carrosséis de alta conversão para Instagram
        </div>
      </footer>
    </main>
  );
}
