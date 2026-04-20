/**
 * VANDER MARIA - Generate Content (Copy + Dynamics)
 * REQUISIÇÃO 1: Gemini gera os 5 slides com texto + dinâmica
 *
 * Input: tema do carrossel
 * Output: 5 VanderMariaSlideContent com textInScreen + dynamics
 */

import { NextRequest, NextResponse } from 'next/server';
import { VANDER_SYSTEM_PROMPT_COPY } from '@/lib/vander-maria/constants';

const GEMINI_API_KEY = process.env.VANDER_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('VANDER_GEMINI_API_KEY não configurada em .env');
}
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
- Each slide has specific text structure (see system prompt)
- Types 1-2 need compelling visual dynamics for image generation
- Types 3-5 are typography-only, no dynamics needed
- Return ONLY JSON, no markdown or extra text`;

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
      return NextResponse.json(
        { error: 'Gemini API error' },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    const responseText = data.candidates[0]?.content?.parts[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { error: 'No content from Gemini' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let parsedResponse;
    try {
      // Try direct JSON parse
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
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
      return NextResponse.json(
        {
          error: 'Invalid response: expected 5 slides',
          received: parsedResponse,
        },
        { status: 500 }
      );
    }

    // Validate each slide has required fields AND all 5 types are present
    const typesSeen = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const slide = parsedResponse.slides[i];
      if (!slide.slideType || !slide.textInScreen) {
        console.error(`❌ Slide ${i + 1} missing fields:`, slide);
        return NextResponse.json(
          { error: `Slide ${i + 1} missing required fields` },
          { status: 500 }
        );
      }
      if (![1, 2, 3, 4, 5].includes(slide.slideType)) {
        console.error(`❌ Slide ${i + 1} invalid type:`, slide.slideType);
        return NextResponse.json(
          { error: `Slide ${i + 1} has invalid slideType: ${slide.slideType}` },
          { status: 500 }
        );
      }
      typesSeen.add(slide.slideType);
    }

    // Verify all 5 types are present
    if (typesSeen.size !== 5) {
      const missing = [1, 2, 3, 4, 5].filter(t => !typesSeen.has(t));
      console.error('❌ Missing types:', missing);
      return NextResponse.json(
        { error: `Missing slide types: ${missing.join(', ')}` },
        { status: 500 }
      );
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
