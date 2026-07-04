/**
 * VANDER MARIA - Generate Content (Copy + Dynamics)
 * REQUISIÇÃO 1: Gemini gera os 5 slides com texto + dinâmica
 *
 * Input: tema do carrossel
 * Output: 5 VanderMariaSlideContent com textInScreen + dynamics
 */

import { NextRequest, NextResponse } from 'next/server';
import { VANDER_SYSTEM_PROMPT_COPY } from '@/lib/vander-maria/constants';
import type { VanderMariaSlideContent } from '@/lib/vander-maria/types';

const GEMINI_API_KEY = process.env.VANDER_GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function buildFallbackSlides(
  topic: string,
  customization?: string,
  targetAudience?: string
): VanderMariaSlideContent[] {
  const audienceText = targetAudience?.trim() || 'seu público';
  const directionText = customization?.trim() ? ` Direção adicional: ${customization.trim()}.` : '';

  return [
    {
      slideType: 1,
      textInScreen: `Você pode transformar ${topic} em uma mensagem que prende atenção.${directionText}`,
      highlights: ['transformar'],
      dynamics: `Abertura forte sobre ${topic} para ${audienceText}.`,
    },
    {
      slideType: 2,
      textInScreen: `O primeiro passo é clareza: fale com ${audienceText} sobre o problema certo e o desejo certo.`,
      highlights: ['clareza', 'problema certo'],
      dynamics: 'Slide de desenvolvimento com foco em mensagem e direção.',
    },
    {
      slideType: 3,
      textInScreen: `Depois, mostre estrutura. Quando a pessoa entende o caminho, ela confia mais no que você diz.`,
      highlights: ['estrutura', 'confia'],
      dynamics: 'Slide de autoridade com narrativa objetiva.',
    },
    {
      slideType: 4,
      textInScreen: `Por fim, conecte valor com ação. Um bom carrossel guia a leitura até o próximo passo natural.`,
      highlights: ['valor', 'próximo passo'],
      dynamics: 'Slide de conversão com fechamento progressivo.',
    },
    {
      slideType: 5,
      textInScreen: `Se você quer aplicar isso em ${topic}, comece hoje e ajuste a mensagem para ${audienceText}.`,
      highlights: ['comece hoje', audienceText],
      ctaButtonText: 'Quero aplicar agora',
      dynamics: 'CTA final limpo e direto.',
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { topic, customization, targetAudience } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Build user prompt
    const userPrompt = `Generate 5 slides for a Vander Maria carousel about: "${topic}"

${customization ? `Direction: ${customization}` : ''}
${targetAudience ? `Target audience: ${targetAudience}` : ''}

IMPORTANT:
- Each slide is "Tweet Expanded" style (pure typography, no photography)
- Provide highlights array for each slide (must appear in textInScreen)
- Slide 5 is CTA and must include ctaButtonText
- Return ONLY JSON, no markdown or extra text`;

    if (!GEMINI_API_KEY?.trim()) {
      console.warn('Gemini API key missing for Vander Maria; using fallback slides.');
      return NextResponse.json({
        success: true,
        slides: buildFallbackSlides(topic, customization, targetAudience),
      });
    }

    // Call Gemini 3 Pro
    const geminiResponse = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: VANDER_SYSTEM_PROMPT_COPY }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini error:', error);
      return NextResponse.json({
        success: true,
        slides: buildFallbackSlides(topic, customization, targetAudience),
      });
    }

    const data = await geminiResponse.json();
    const responseText = data.candidates[0]?.content?.parts[0]?.text;

    if (!responseText) {
      return NextResponse.json({
        success: true,
        slides: buildFallbackSlides(topic, customization, targetAudience),
      });
    }

    // Parse JSON response
    let parsedResponse;
    try {
      // Try direct JSON parse
      parsedResponse = JSON.parse(responseText);
    } catch {
      console.log('📋 Raw Gemini response (first 1000 chars):', responseText.substring(0, 1000));
      // Try extracting JSON from markdown code block
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Last resort: try to find JSON object
        const objMatch = responseText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          parsedResponse = JSON.parse(objMatch[0]);
        } else {
          throw new Error('Could not extract JSON');
        }
      }
    }

    if (!parsedResponse.slides || parsedResponse.slides.length !== 5) {
      console.error('❌ Expected 5 slides, got:', parsedResponse.slides?.length);
      return NextResponse.json({
        success: true,
        slides: buildFallbackSlides(topic, customization, targetAudience),
      });
    }

    // Validate each slide has required fields AND all 5 types are present
    const typesSeen = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const slide = parsedResponse.slides[i];
      if (!slide.slideType || !slide.textInScreen) {
        console.error(`❌ Slide ${i + 1} missing fields:`, slide);
        return NextResponse.json({
          success: true,
          slides: buildFallbackSlides(topic, customization, targetAudience),
        });
      }
      if (!Array.isArray(slide.highlights) || slide.highlights.length < 1) {
        console.error(`❌ Slide ${i + 1} missing/invalid highlights:`, slide.highlights);
        return NextResponse.json({
          success: true,
          slides: buildFallbackSlides(topic, customization, targetAudience),
        });
      }
      // Ensure highlights appear in text (verbatim)
      const text = String(slide.textInScreen);
      for (const h of slide.highlights) {
        if (typeof h !== 'string' || h.trim().length === 0 || !text.includes(h)) {
          console.error(`❌ Slide ${i + 1} highlight not found in text:`, h);
          return NextResponse.json({
            success: true,
            slides: buildFallbackSlides(topic, customization, targetAudience),
          });
        }
      }
      if (slide.slideType === 5) {
        if (typeof slide.ctaButtonText !== 'string' || slide.ctaButtonText.trim().length === 0) {
          console.error(`❌ Slide ${i + 1} missing ctaButtonText:`, slide.ctaButtonText);
          return NextResponse.json({
            success: true,
            slides: buildFallbackSlides(topic, customization, targetAudience),
          });
        }
      }
      if (![1, 2, 3, 4, 5].includes(slide.slideType)) {
        console.error(`❌ Slide ${i + 1} invalid type:`, slide.slideType);
        return NextResponse.json({
          success: true,
          slides: buildFallbackSlides(topic, customization, targetAudience),
        });
      }
      typesSeen.add(slide.slideType);
    }

    // Verify all 5 types are present
    if (typesSeen.size !== 5) {
      const missing = [1, 2, 3, 4, 5].filter(t => !typesSeen.has(t));
      console.error('❌ Missing types:', missing);
      return NextResponse.json({
        success: true,
        slides: buildFallbackSlides(topic, customization, targetAudience),
      });
    }

    console.log('✅ All 5 slide types validated successfully');

    return NextResponse.json({
      success: true,
      slides: parsedResponse.slides,
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
