import { create } from 'zustand';
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
  carouselTemplate?: 'standard' | 'tweet' | 'vanderMaria';
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
}

export type CarouselTemplate = 'standard' | 'tweet' | 'vanderMaria';
export type CarouselType = 'transformacao' | 'autoridade' | 'ideologico' | 'educacional' | 'vendas' | 'auto';

export interface CarouselState {
  idea: string;
  prompt: string;
  cards: CarouselCard[];
  totalCards: number;
  isGenerating: boolean;
  docs: UploadedDoc[];
  carouselTemplate: CarouselTemplate;
  carouselType: CarouselType;
  cardsStandard: CarouselCard[];
  cardsTweet: CarouselCard[];
  cardsVanderMaria: CarouselCard[];  // ISOLADO: Vander Maria cards separados

  setIdea: (idea: string) => void;
  setPrompt: (prompt: string) => void;
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
}

export const useCarouselStore = create<CarouselState>((set) => ({
  idea: '',
  prompt: '',
  cards: [],
  cardsStandard: [],
  cardsTweet: [],
  cardsVanderMaria: [],  // ISOLADO: Vander Maria state separado
  totalCards: 10,
  isGenerating: false,
  docs: [],
  carouselTemplate: 'standard',
  carouselType: 'auto',

  setIdea: (idea) => set({ idea }),
  setPrompt: (prompt) => set({ prompt }),
  setCards: (cards) => set((state) => {
    // Salvar nos arrays separados baseado no template do card
    const cardsStandard = cards.filter(c => (c.carouselTemplate || 'standard') === 'standard');
    const cardsTweet = cards.filter(c => (c.carouselTemplate || 'standard') === 'tweet');
    const cardsVanderMaria = cards.filter(c => (c.carouselTemplate || 'standard') === 'vanderMaria');

    return {
      cards,
      cardsStandard,
      cardsTweet,
      cardsVanderMaria,  // ISOLADO: Mantém separado
    };
  }),
  setTotalCards: (total) => set({ totalCards: total }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setCarouselTemplate: (template) => set({ carouselTemplate: template }),
  setCarouselType: (type) => set({ carouselType: type }),
  updateCard: (id, updates) => set((state) => {
    // 🟡 CRÍTICO: Quando atualiza um card, precisa re-filtrar para cardsStandard/cardsTweet/cardsVanderMaria
    const updatedCards = state.cards.map(c => c.id === id ? { ...c, ...updates } : c);
    const cardsStandard = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'standard');
    const cardsTweet = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'tweet');
    const cardsVanderMaria = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'vanderMaria');

    return {
      cards: updatedCards,
      cardsStandard,
      cardsTweet,
      cardsVanderMaria,  // ISOLADO: Re-filtra também
    };
  }),
  updateAllCards: (updates) => set((state) => {
    // 🟡 CRÍTICO: Quando atualiza todos os cards, precisa re-filtrar também
    const updatedCards = state.cards.map(c => ({ ...c, ...updates }));
    const cardsStandard = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'standard');
    const cardsTweet = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'tweet');
    const cardsVanderMaria = updatedCards.filter(c => (c.carouselTemplate || 'standard') === 'vanderMaria');

    return {
      cards: updatedCards,
      cardsStandard,
      cardsTweet,
      cardsVanderMaria,  // ISOLADO: Re-filtra também
    };
  }),
  addDoc: (doc) => set((state) => ({
    docs: [...state.docs, doc]
  })),
  removeDoc: (id) => set((state) => ({
    docs: state.docs.filter(d => d.id !== id)
  })),
  setDocs: (docs) => set({ docs })
}));
