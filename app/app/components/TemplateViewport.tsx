'use client';

import { useCarouselStore } from '@/lib/store';
import { TweetModelViewport } from './TweetModelViewport';
import { VanderMariaViewport } from './VanderMariaViewport';

export function TemplateViewport() {
  const { carouselTemplate } = useCarouselStore();

  // ISOLADO: Mostrar viewport específico baseado no template selecionado
  if (carouselTemplate === 'vanderMaria') {
    return <VanderMariaViewport />;
  }

  // Default para Tweet/Standard
  return <TweetModelViewport />;
}
