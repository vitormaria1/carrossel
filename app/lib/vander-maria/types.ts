/**
 * VANDER MARIA - Type Definitions
 * ISOLADO DO MODELO TWEET
 */

export type VanderSlideType = 1 | 2 | 3 | 4 | 5;

export interface VanderMariaSlideContent {
  slideType: VanderSlideType;
  textInScreen: string;        // Exact text to render (may be multi-line)
  dynamics?: string;            // Visual scene description (Types 1-2 only)
  imagePrompt?: string;         // Generated from dynamics (Types 1-2 only)
  generatedImageUrl?: string;   // After Gemini generates (Types 1-2 only)
}

export interface VanderMariaCard extends Record<string, any> {
  id: string;
  carouselTemplate: 'vanderMaria';
  slideType: VanderSlideType;
  order: number;

  // Content
  textInScreen: string;
  dynamics?: string;
  imagePrompt?: string;

  // Generated outputs
  generatedImageUrl?: string;
  base64?: string;              // After canvas rendering

  // Visual properties
  colors?: {
    bg: string;
    text: string;
    accent?: string;
  };
}

export interface VanderMariaCarouselState {
  topic: string;
  customization?: string;
  targetAudience?: string;
  cards: VanderMariaCard[];
  isGenerating: boolean;
  currentGeneratingStep?: 'copy' | 'image1' | 'image2' | 'rendering';
  error?: string;
}
