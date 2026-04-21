/**
 * VANDER MARIA - Orchestration Service
 * Coordena: Gemini (copy) → Gemini (images) → Canvas rendering
 */

import { VanderMariaSlideContent, VanderMariaCard, VanderSlideType } from './types';

export interface GenerateCarouselOptions {
  topic: string;
  customization?: string;
  targetAudience?: string;
}

interface GenerateContentResponse {
  success: boolean;
  slides?: VanderMariaSlideContent[];
  error?: string;
}

interface GenerateImageResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Main orchestration function
 * 1. Call Gemini to generate copy (5 slides)
 * 2. For Type 1 and 2: Call Gemini to generate images
 * 3. Return complete cards ready for rendering
 */
export async function generateVanderMariaCarousel(
  options: GenerateCarouselOptions,
  onProgress?: (step: string) => void
): Promise<VanderMariaCard[]> {
  onProgress?.('Gerando copy com Gemini...');

  // STEP 1: Generate copy + dynamics
  const contentResponse = await fetch('/api/vander-maria/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  if (!contentResponse.ok) {
    const error = await contentResponse.json();
    throw new Error(`Falha ao gerar copy: ${error.error}`);
  }

  const contentData = (await contentResponse.json()) as GenerateContentResponse;
  if (!contentData.success || !contentData.slides) {
    throw new Error('Resposta inválida do Gemini');
  }

  const slides = contentData.slides;

  // Validate all slides have text
  for (const slide of slides) {
    if (!slide.textInScreen || slide.textInScreen.trim().length === 0) {
      console.error(`⚠️ Type ${slide.slideType}: textInScreen is empty!`);
      throw new Error(`Slide Type ${slide.slideType} has no text content`);
    }
  }

  // STEP 2: Generate images for ALL 5 types (SEQUENTIALLY to avoid rate limit)
  onProgress?.('Gerando imagens para todos os 5 slides...');

  let images: { [key: number]: GenerateImageResponse | null } = {};

  try {
    // Sequential generation with delay between requests
    for (const slide of slides) {
      console.log(`Generating Type ${slide.slideType}...`);
      const result = await generateImageForSlide(slide);
      console.log(`Type ${slide.slideType}: ${result.success ? '✅ OK' : '❌ FAILED'} | Text length: ${slide.textInScreen?.length || 0} chars`);
      if (!result.success) {
        console.error(`  Error: ${result.error}`);
      }
      images[slide.slideType] = result;

      // Add delay between requests to avoid rate limiting
      if (slides.indexOf(slide) < slides.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error('⚠️ Image generation error:', error);
    // Continue anyway - cards still render
  }

  // STEP 3: Build complete cards
  onProgress?.('Preparando cards...');

  const cards: VanderMariaCard[] = slides.map((slide, idx) => {
    const card: VanderMariaCard = {
      id: `vander-${slide.slideType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      carouselTemplate: 'vanderMaria',
      slideType: slide.slideType as VanderSlideType,
      order: idx,
      textInScreen: slide.textInScreen,
      dynamics: slide.dynamics || '',
      colors: {
        bg: '#F4F0E8',
        text: '#1A0F0F',
        accent: '#7A1C1C',
      },
    };

    // Attach generated image for ALL types if available and successful
    const imageData = images[slide.slideType];
    if (imageData?.success && imageData.imageBase64) {
      card.generatedImageUrl = `data:${imageData.mimeType || 'image/jpeg'};base64,${imageData.imageBase64}`;
    }

    return card;
  });

  return cards;
}

/**
 * Generate image for a single slide (ALL types)
 * Includes retry logic and comprehensive error handling
 */
async function generateImageForSlide(
  slide: VanderMariaSlideContent,
  retryCount: number = 0,
  maxRetries: number = 3
): Promise<GenerateImageResponse> {
  if (![1, 2, 3, 4, 5].includes(slide.slideType)) {
    return { success: false, error: 'Invalid slideType' };
  }

  try {
    // Validate required fields
    if (!slide.textInScreen || slide.textInScreen.trim().length === 0) {
      return { success: false, error: 'Missing or empty textInScreen' };
    }

    if (!slide.dynamics) {
      console.warn(`⚠️ Type ${slide.slideType}: dynamics is empty, using fallback`);
    }

    console.log(`📸 Type ${slide.slideType} (attempt ${retryCount + 1}/${maxRetries + 1}): text="${slide.textInScreen.substring(0, 50)}..."`);
    console.log(`   Full text length: ${slide.textInScreen.length} characters`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await fetch('/api/vander-maria/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slideType: slide.slideType,
        textInScreen: slide.textInScreen,
        dynamics: slide.dynamics || 'Photorealistic, cinematic scene for Vander Maria carousel',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = errorText;

      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error || errorText;
      } catch (e) {
        // Not JSON, use text as-is
      }

      console.error(`❌ Type ${slide.slideType} image error (${response.status}):`, errorMsg);

      // Retry on server errors (5xx)
      if (response.status >= 500 && retryCount < maxRetries) {
        const delayMs = 2000 * Math.pow(2, retryCount); // Exponential backoff
        console.log(`⏱️ Retry ${retryCount + 1}/${maxRetries} in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return generateImageForSlide(slide, retryCount + 1, maxRetries);
      }

      return { success: false, error: `API error ${response.status}: ${errorMsg}` };
    }

    const data = await response.json();

    // Validate response format
    if (!data.success) {
      console.error(`❌ Type ${slide.slideType}: ${data.error}`);
      return { success: false, error: data.error };
    }

    if (!data.imageBase64) {
      console.error(`❌ Type ${slide.slideType}: No base64 data in response`);
      return { success: false, error: 'No image data returned' };
    }

    // Validate base64 length (rough check)
    if (data.imageBase64.length < 100) {
      console.error(`❌ Type ${slide.slideType}: base64 too short (${data.imageBase64.length} chars)`);
      return { success: false, error: 'Invalid or truncated image' };
    }

    console.log(`✅ Type ${slide.slideType} image: ${(data.imageBase64.length / 1024).toFixed(1)}KB`);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Type ${slide.slideType} fetch error:`, errorMsg);

    // Retry on network errors
    if (retryCount < maxRetries) {
      const delayMs = 2000 * Math.pow(2, retryCount); // Exponential backoff
      console.log(`⏱️ Retry ${retryCount + 1}/${maxRetries} in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return generateImageForSlide(slide, retryCount + 1, maxRetries);
    }

    return { success: false, error: `Network error: ${errorMsg}` };
  }
}

/**
 * Render a single Vander Maria card to base64
 */
export async function renderVanderMariaCardToBase64(
  card: VanderMariaCard
): Promise<string> {
  // Validar que estamos em client-side (browser)
  if (typeof document === 'undefined') {
    throw new Error('Canvas rendering only works in browser (client-side)');
  }

  const { renderVanderType1, renderVanderType2, renderVanderType3, renderVanderType4, renderVanderType5 } = await import('./canvas-renderers');

  // Garantir que fonts carregaram
  if (typeof (document as any).fonts !== 'undefined') {
    try {
      await (document as any).fonts.ready;
    } catch (e) {
      console.warn('Fonts may not have loaded:', e);
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível criar context do canvas');
  }

  // Load image if exists
  let cardImg: HTMLImageElement | null = null;
  if (card.generatedImageUrl) {
    cardImg = await loadImageFromUrl(card.generatedImageUrl);
  }

  // Load watermark
  let watermarkImg: HTMLImageElement | null = null;
  try {
    watermarkImg = await loadImageFromUrl('/vander-watermark.png');
  } catch (e) {
    console.warn('Watermark failed to load, continuing without it');
  }

  // Render based on type
  const options = { cardImg, watermarkImg };

  switch (card.slideType) {
    case 1:
      renderVanderType1(ctx, canvas, card, options);
      break;
    case 2:
      renderVanderType2(ctx, canvas, card, options);
      break;
    case 3:
      renderVanderType3(ctx, canvas, card, options);
      break;
    case 4:
      renderVanderType4(ctx, canvas, card, options);
      break;
    case 5:
      renderVanderType5(ctx, canvas, card, options);
      break;
  }

  // Convert to base64 JPEG
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          try {
            if (!blob) {
              reject(new Error('Falha ao criar blob'));
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error('Erro ao ler blob'));
            };
            reader.readAsDataURL(blob);
          } catch (e) {
            reject(e);
          }
        },
        'image/jpeg',
        0.92
      );
    } catch (e) {
      reject(e);
    } finally {
      // Cleanup canvas
      canvas.width = 0;
      canvas.height = 0;
    }
  });
}

/**
 * Load image from URL and return HTMLImageElement
 */
function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Não usar crossOrigin para data: URLs (evita CORS tainted canvas)
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${url}`));
    img.src = url;
  });
}

/**
 * Export all cards as base64 array (for publishing)
 */
export async function exportVanderMariaCarouselAsBase64(
  cards: VanderMariaCard[]
): Promise<string[]> {
  const base64Array: string[] = [];

  for (const card of cards) {
    try {
      const base64 = await renderVanderMariaCardToBase64(card);
      base64Array.push(base64);
    } catch (error) {
      console.error(`Erro renderizando card ${card.slideType}:`, error);
      throw error;
    }
  }

  return base64Array;
}
