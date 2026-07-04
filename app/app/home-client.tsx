'use client';

import { InputForm } from './components/InputForm';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateViewport } from './components/TemplateViewport';
import { UserContextForm } from './components/UserContextForm';
import { PublishButton } from './components/PublishButton';
import { useCarouselStore, type CarouselCard } from '@/lib/store';
import { useUserContext } from '@/lib/user-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateVanderMariaCarousel } from '@/lib/vander-maria';
import Link from 'next/link';

type VanderMariaStoreCard = CarouselCard & {
  textInScreen: string;
  slideType: number;
  generatedImageUrl?: string;
  highlights?: string[];
  ctaButtonText?: string;
  dynamics?: string;
};

export default function HomeClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    idea,
    prompt,
    totalCards,
    setCards,
    setIsGenerating,
    setPostCaption,
    carouselType,
    carouselTemplate,
    cards,
    docs,
  } = useCarouselStore();
  const { expertise, yearsExperience, mainAchievement, productName, targetAudience, toneOfVoice, objective } =
    useUserContext();

  useEffect(() => {
    let active = true;

    Promise.resolve(useCarouselStore.persist.rehydrate()).finally(() => {
      if (active) setIsHydrated(true);
    });

    return () => {
      active = false;
    };
  }, []);

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

        const formattedCards: VanderMariaStoreCard[] = vanderCards.map((card) => ({
          ...card,
          text: card.textInScreen,
          imageType: 'html' as const,
          colors: card.colors ?? { bg: '#F4F0E8', text: '#1A0F0F' },
          carouselTemplate: 'vanderMaria' as const,
        }));

        setCards(formattedCards);
        setPostCaption(formattedCards[0]?.caption || '');
        console.log('✅ Carrossel Vander Maria gerado! 5 slides prontos.');
        return;
      }

      const endpoint = docs.length > 0 ? '/api/generate' : '/api/generate-agent';
      const requestBody = {
        idea,
        prompt,
        customization: prompt,
        totalCards,
        docIds: docs.map((doc) => doc.id),
        expertise,
        yearsExperience,
        mainAchievement,
        productName,
        targetAudience,
        toneOfVoice,
        objective,
        carouselTemplate,
        carouselType: carouselType === 'auto' ? undefined : carouselType,
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao gerar carrossel');
      }

      const data = (await res.json()) as {
        cards?: Array<{
          text?: string;
          headline?: string;
          cta?: string;
          colors?: { bg: string; text: string; accent?: string };
        }>;
        caption?: string;
      };

      if (data.cards) {
        const cards = data.cards.map((card, idx) => {
          return {
            id: `card-${idx}`,
            text: card.text || '',
            headline: card.headline,
            cta: card.cta,
            caption: idx === 0 ? data.caption : undefined,
            imageType: 'html' as const,
            colors:
              'colors' in card && card.colors && typeof card.colors === 'object'
                ? (card.colors as { bg: string; text: string; accent?: string })
                : { bg: '#FFFFFF', text: '#0C1014' },
            order: idx,
            carouselTemplate: carouselTemplate,
          };
        });

        setCards(cards);
        setPostCaption(data.caption || cards[0]?.caption || '');
        console.log(`✅ Cards salvos! Template: ${carouselTemplate}`);
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Falha na geração'}`);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff,white_40%,#f3f4f6)]">
      <header className="border-b border-gray-700 bg-gradient-to-r from-gray-950 via-gray-900 to-black">
        <div className="px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gray-500">
                CONSULTÓRIO
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white">
                carrossel<span className="text-blue-500">.</span>ai
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Transforme ideias, ofertas e documentos em carrosséis prontos para publicar.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid grid-cols-3 gap-3 text-center text-white">
                <StatPill label="Template" value={carouselTemplate === 'tweetExpanded' ? 'Expandido' : carouselTemplate === 'tweet' ? 'Tweet' : 'Standard'} />
                <StatPill label="Cards" value={String(cards.length || totalCards)} />
                <StatPill label="Objetivo" value={objective} />
              </div>
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Central
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-12">
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

      <div className="flex min-h-[calc(100vh-280px)] gap-8 px-6 py-8">
        <div className="w-auto flex-shrink-0">
          <div className="sticky top-8 w-80 space-y-4">
            <UserContextForm />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-white font-bold text-lg">Criar Carrossel</h3>
                <p className="mt-1 text-xs text-blue-100">
                  Defina o briefing e gere uma versão pronta para editar e exportar.
                </p>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
                <PublishButton />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          {isHydrated ? (
            <TemplateViewport />
          ) : (
            <div className="flex h-full min-h-[32rem] items-center justify-center rounded-xl border border-gray-200 bg-white">
              <div className="text-center text-sm text-gray-500">
                Restaurando carrossel salvo...
              </div>
            </div>
          )}
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{label}</div>
      <div className="mt-1 text-sm font-semibold capitalize">{value}</div>
    </div>
  );
}
