/**
 * VANDER MARIA - Generate Image (Gemini 3 Pro Image Preview)
 * REQUISIÇÃO 2: Gemini gera fotografias para Types 1 e 2
 *
 * Input: slideType (1 ou 2), textInScreen, dynamics
 * Output: base64 image
 *
 * CRITICAL: System instructions COMPLETAS (paleta, tipografia, composição)
 * para garantir fidelidade ao brand Vander Maria
 */

import { NextRequest, NextResponse } from 'next/server';
import { VANDER_SYSTEM_PROMPT_IMAGE } from '@/lib/vander-maria/constants';

const GEMINI_API_KEY = process.env.VANDER_GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

interface GenerateImageRequest {
  slideType: 1 | 2 | 3 | 4 | 5;
  textInScreen: string;
  highlights?: string[];
  ctaButtonText?: string;
}

interface GenerateImageResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    const { slideType, textInScreen, highlights = [], ctaButtonText } = (await req.json()) as GenerateImageRequest;

    if (!slideType || ![1, 2, 3, 4, 5].includes(slideType)) {
      return NextResponse.json(
        { success: false, error: 'slideType must be 1, 2, 3, 4, or 5' },
        { status: 400 }
      );
    }

    if (!textInScreen) {
      return NextResponse.json(
        { success: false, error: 'textInScreen is required' },
        { status: 400 }
      );
    }

    const isCta = slideType === 5;
    if (isCta && (!ctaButtonText || String(ctaButtonText).trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'ctaButtonText is required for CTA (slideType 5)' },
        { status: 400 }
      );
    }

    const highlightList = Array.isArray(highlights) ? highlights.filter(Boolean).slice(0, 3) : [];
    const highlightText = highlightList.length ? highlightList.map((h) => `- ${h}`).join('\n') : '(none)';

    const userPrompt = isCta
      ? `Generate the FINAL CTA slide (Tweet Expanded style).

Tweet/CTA text:
${textInScreen}

Button text (CTA):
${ctaButtonText}

Words/phrases to highlight in burgundy:
${highlightText}

Remember: no tweet header on CTA slide, but keep the standard footer.`
      : `Generate a REGULAR Tweet Expanded slide.

Tweet text:
${textInScreen}

Words/phrases to highlight in burgundy:
${highlightText}

Remember: include the tweet header at the top and the standard footer at the bottom.`;

    // Call Gemini 3 Pro Vision
    const geminiResponse = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: VANDER_SYSTEM_PROMPT_IMAGE,
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Very low to focus on image generation, not thinking
          maxOutputTokens: 32768, // Max allowed for image generation model
        },
      }),
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini image generation error:', error);
      return NextResponse.json(
        { success: false, error: `Gemini error: ${geminiResponse.status}` },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();

    // DEBUG: Log full Gemini response
    console.log('🔍 Gemini raw response:', JSON.stringify(data, null, 2).substring(0, 1000));

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts;

    if (!parts || !Array.isArray(parts)) {
      console.error('❌ No parts array in Gemini response. Full data:', JSON.stringify(data));
      return NextResponse.json(
        { success: false, error: 'Gemini response has no content parts' },
        { status: 500 }
      );
    }

    console.log('📦 Parts in response:', parts.length, 'Types:', parts.map((p: any) => Object.keys(p).join(',')));

    const imagePart = parts.find((part: any) => part.inlineData);

    if (!imagePart?.inlineData) {
      console.error('❌ No inlineData in parts. Parts count:', parts.length, 'Keys:', parts[0] ? Object.keys(parts[0]) : 'N/A');
      return NextResponse.json(
        { success: false, error: 'Gemini did not generate an image' },
        { status: 500 }
      );
    }

    const { mimeType, data: base64Data } = imagePart.inlineData;

    // Validate base64 data
    if (!base64Data || typeof base64Data !== 'string') {
      console.error('❌ Invalid base64 data type:', typeof base64Data);
      return NextResponse.json(
        { success: false, error: 'Invalid image data format' },
        { status: 500 }
      );
    }

    const base64Length = base64Data.length;
    if (base64Length < 1000) {
      console.error(`❌ Base64 data too short: ${base64Length} chars (expected ~50KB+)`);
      return NextResponse.json(
        { success: false, error: 'Image data appears truncated or invalid' },
        { status: 500 }
      );
    }

    // Verify ends properly (JPEG end marker)
    if (!base64Data.endsWith('/') && !base64Data.endsWith('=')) {
      console.warn(`⚠️ Base64 may be truncated (unusual ending): ...${base64Data.slice(-10)}`);
    }

    console.log(`✅ Image generated: ${(base64Length / 1024).toFixed(1)}KB (${mimeType})`);

    // Return base64 (client-side handles data URL to avoid CORS tainted canvas)
    return NextResponse.json({
      success: true,
      mimeType,
      imageBase64: base64Data,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Generate image fatal error:', errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
