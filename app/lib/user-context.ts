import { create } from 'zustand';

export type ToneOfVoice = 'formal' | 'casual' | 'inspirador' | 'urgente' | 'educacional';
export type Objective = 'leads' | 'vendas' | 'awareness' | 'engagement';
export type Audience = 'empreendedores' | 'corporativo' | 'criadores' | 'estudantes' | 'outro';

export interface UserContext {
  // Expertise
  expertise: string;
  yearsExperience: number;
  mainAchievement: string;

  // Produto/Serviço
  productName: string;
  productDescription: string;
  productPrice?: string;
  uniqueDifferential: string;
  problemSolves: string;

  // Público
  targetAudience: Audience;
  audiencePainPoints: string;

  // Preferências
  toneOfVoice: ToneOfVoice;
  objective: Objective;

  // Métodos
  setExpertise: (expertise: string, years: number, achievement: string) => void;
  setProduct: (name: string, desc: string, differential: string, problem: string, price?: string) => void;
  setAudience: (audience: Audience, painPoints: string) => void;
  setPreferences: (tone: ToneOfVoice, objective: Objective) => void;
  reset: () => void;
}

const defaultState = {
  expertise: '',
  yearsExperience: 0,
  mainAchievement: '',
  productName: '',
  productDescription: '',
  productPrice: '',
  uniqueDifferential: '',
  problemSolves: '',
  targetAudience: 'outro' as Audience,
  audiencePainPoints: '',
  toneOfVoice: 'educacional' as ToneOfVoice,
  objective: 'engagement' as Objective,
};

export const useUserContext = create<UserContext>((set) => ({
  ...defaultState,

  setExpertise: (expertise, years, achievement) =>
    set({ expertise, yearsExperience: years, mainAchievement: achievement }),

  setProduct: (name, desc, differential, problem, price) =>
    set({
      productName: name,
      productDescription: desc,
      uniqueDifferential: differential,
      problemSolves: problem,
      productPrice: price,
    }),

  setAudience: (audience, painPoints) =>
    set({ targetAudience: audience, audiencePainPoints: painPoints }),

  setPreferences: (tone, objective) => set({ toneOfVoice: tone, objective }),

  reset: () => set(defaultState),
}));
