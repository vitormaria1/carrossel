'use client';

import { useCarouselStore } from '@/lib/store';
import { CardViewport } from './CardViewport';
import { TweetModelViewport } from './TweetModelViewport';
import { TweetExpandedViewport } from './TweetExpandedViewport';
import { VanderMariaViewport } from './VanderMariaViewport';

export function TemplateViewport() {
  const { carouselTemplate } = useCarouselStore();

  return (
    <div className="h-full w-full overflow-y-auto p-6 bg-white">
      {carouselTemplate === 'tweet' && <TweetModelViewport />}
      {carouselTemplate === 'tweetExpanded' && <TweetExpandedViewport />}
      {carouselTemplate === 'vanderMaria' && <VanderMariaViewport />}
      {(carouselTemplate === 'standard' || !carouselTemplate) && <CardViewport />}
    </div>
  );
}

