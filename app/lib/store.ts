import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { generateCardBase64 } from './export';

export interface CarouselCard {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  caption?: string;
  imageUrl?: string;
  imageType: 'html' | 'ai' | 'stock';
  colors: { bg: string; text: string; accent?: string };
  order: number;
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
}

export type CarouselTemplate = 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
export type CarouselType = 'transformacao' | 'autoridade' | 'ideologico' | 'educacional' | 'vendas' | 'auto';

type TemplateBuckets = Record<CarouselTemplate, CarouselCard[]>;

export interface CarouselState {
  idea: string;
  prompt: string;
  postCaption: string;
  cards: CarouselCard[];
  totalCards: number;
  isGenerating: boolean;
  docs: UploadedDoc[];
  carouselTemplate: CarouselTemplate;
  carouselType: CarouselType;
  cardsStandard: CarouselCard[];
  cardsTweet: CarouselCard[];
  cardsTweetExpanded: CarouselCard[];
  cardsVanderMaria: CarouselCard[];  // ISOLADO: Vander Maria cards separados

  setIdea: (idea: string) => void;
  setPrompt: (prompt: string) => void;
  setPostCaption: (caption: string) => void;
  setCards: (cards: CarouselCard[]) => void;
  setTotalCards: (total: number) => void;
  setIsGenerating: (generating: boolean) => void;
  setCarouselTemplate: (template: CarouselTemplate) => void;
  setCarouselType: (type: CarouselType) => void;
  updateCard: (id: string, updates: Partial<CarouselCard>) => void;
  updateAllCards: (updates: Partial<CarouselCard>) => void;
  addDoc: (doc: UploadedDoc) => void;
  removeDoc: (id: string) => void;
  setDocs: (docs: UploadedDoc[]) => void;
  clearAllCards: () => void;
}

const EMPTY_TEMPLATE_BUCKETS: TemplateBuckets = {
  standard: [],
  tweet: [],
  tweetExpanded: [],
  vanderMaria: [],
};

function detectTemplate(cards: CarouselCard[]): CarouselTemplate {
  const firstCard = cards[0];
  return firstCard?.carouselTemplate || 'standard';
}

function selectCardsForTemplate(
  buckets: TemplateBuckets,
  template: CarouselTemplate
): CarouselCard[] {
  return buckets[template];
}

function patchTemplateBuckets(
  state: CarouselState,
  template: CarouselTemplate,
  cards: CarouselCard[]
): Partial<CarouselState> {
  const nextBuckets: TemplateBuckets = {
    standard: template === 'standard' ? cards : state.cardsStandard,
    tweet: template === 'tweet' ? cards : state.cardsTweet,
    tweetExpanded: template === 'tweetExpanded' ? cards : state.cardsTweetExpanded,
    vanderMaria: template === 'vanderMaria' ? cards : state.cardsVanderMaria,
  };

  return {
    cards: selectCardsForTemplate(nextBuckets, state.carouselTemplate === template ? template : state.carouselTemplate),
    cardsStandard: nextBuckets.standard,
    cardsTweet: nextBuckets.tweet,
    cardsTweetExpanded: nextBuckets.tweetExpanded,
    cardsVanderMaria: nextBuckets.vanderMaria,
  };
}

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set) => ({
      idea: '',
      prompt: '',
      postCaption: '',
      cards: [],
      cardsStandard: [],
      cardsTweet: [],
      cardsTweetExpanded: [],
      cardsVanderMaria: [],
      totalCards: 10,
      isGenerating: false,
      docs: [],
      carouselTemplate: 'standard',
      carouselType: 'auto',

      setIdea: (idea) => set({ idea }),
      setPrompt: (prompt) => set({ prompt }),
      setPostCaption: (postCaption) => set({ postCaption }),
      setCards: (cards) => set((state) => patchTemplateBuckets(state, detectTemplate(cards), cards)),
      setTotalCards: (total) => set({ totalCards: total }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setCarouselTemplate: (template) => set((state) => ({
        carouselTemplate: template,
        cards: selectCardsForTemplate(
          {
            standard: state.cardsStandard,
            tweet: state.cardsTweet,
            tweetExpanded: state.cardsTweetExpanded,
            vanderMaria: state.cardsVanderMaria,
          },
          template
        ),
      })),
      setCarouselType: (type) => set({ carouselType: type }),
      updateCard: (id, updates) => set((state) => {
        const updateCards = (cards: CarouselCard[]) =>
          cards.map((card) => (card.id === id ? { ...card, ...updates } : card));

        const cardsStandard = updateCards(state.cardsStandard);
        const cardsTweet = updateCards(state.cardsTweet);
        const cardsTweetExpanded = updateCards(state.cardsTweetExpanded);
        const cardsVanderMaria = updateCards(state.cardsVanderMaria);

        return {
          cardsStandard,
          cardsTweet,
          cardsTweetExpanded,
          cardsVanderMaria,
          cards: selectCardsForTemplate(
            {
              standard: cardsStandard,
              tweet: cardsTweet,
              tweetExpanded: cardsTweetExpanded,
              vanderMaria: cardsVanderMaria,
            },
            state.carouselTemplate
          ),
        };
      }),
      updateAllCards: (updates) => set((state) => {
        const activeCards = state.cards.map((card) => ({ ...card, ...updates }));
        return patchTemplateBuckets(state, state.carouselTemplate, activeCards);
      }),
      addDoc: (doc) => set((state) => ({
        docs: [...state.docs, doc]
      })),
      removeDoc: (id) => set((state) => ({
        docs: state.docs.filter(d => d.id !== id)
      })),
      setDocs: (docs) => set({ docs }),
      clearAllCards: () =>
        set({
          cards: [],
          cardsStandard: EMPTY_TEMPLATE_BUCKETS.standard,
          cardsTweet: EMPTY_TEMPLATE_BUCKETS.tweet,
          cardsTweetExpanded: EMPTY_TEMPLATE_BUCKETS.tweetExpanded,
          cardsVanderMaria: EMPTY_TEMPLATE_BUCKETS.vanderMaria,
        }),
    }),
    {
      name: 'carousel-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        idea: state.idea,
        prompt: state.prompt,
        postCaption: state.postCaption,
        cards: state.cards,
        totalCards: state.totalCards,
        carouselTemplate: state.carouselTemplate,
        carouselType: state.carouselType,
        cardsStandard: state.cardsStandard,
        cardsTweet: state.cardsTweet,
        cardsTweetExpanded: state.cardsTweetExpanded,
        cardsVanderMaria: state.cardsVanderMaria,
      }),
    }
  )
);
