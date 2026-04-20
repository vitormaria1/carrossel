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
if (!GEMINI_API_KEY) {
  throw new Error('VANDER_GEMINI_API_KEY não configurada em .env');
}
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

interface GenerateImageRequest {
  slideType: 1 | 2 | 3 | 4 | 5;
  textInScreen: string;
  dynamics: string;
}

interface GenerateImageResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    const { slideType, textInScreen, dynamics } = (await req.json()) as GenerateImageRequest;

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

    let userPrompt = '';

    switch (slideType) {
      case 1:
        userPrompt = `RENDER this text on a cinematic photograph (Type 1):\n\n${textInScreen}\n\nPhoto mood: ${dynamics || 'Intimate, moody, professional'}`;
        break;
      case 2:
        userPrompt = `RENDER this text in top 40% with cinematic photo in bottom 60% (Type 2):\n\n${textInScreen}\n\nPhoto mood: ${dynamics || 'Continuation of narrative, sharp focus'}`;
        break;
      case 3:
        userPrompt = `GENERATE INSTAGRAM CARD TYPE 3: PURE TYPOGRAPHY

Canvas: 1080x1440px
Background: NEAR-BLACK (#1A0F0F) - must fill entire canvas

Text Content to Render:
${textInScreen}

Layout Instructions (CRITICAL):
1. Background MUST be solid #1A0F0F (no gradients, no patterns)
2. Text sections separated by \\n\\n
3. Top section: Small intro text, WHITE (#F4F0E8), font size 24-28px, top 15% of canvas
4. Middle section: MASSIVE IMPACT text, BRIGHT BURGUNDY (#A8342F), font size 72-96px, centered, middle 60%
5. Bottom section: Small closer text, WHITE (#F4F0E8), font size 24-28px, bottom 15% of canvas
6. Fonts: Bold, condensed, uppercase (Bebas Neue/Anton style)
7. All text MUST be clearly visible and readable

CRITICAL: Generate a COMPLETE IMAGE with all text rendered. NOT BLANK.`;
        break;
      case 4:
        userPrompt = `GENERATE INSTAGRAM CARD TYPE 4: HIGH-IMPACT EDITORIAL

Canvas: 1080x1440px
Background: CHARCOAL (#1A1A1A) with subtle grid overlay

Text Content to Render:
${textInScreen}

Layout Instructions (CRITICAL):
1. Background MUST be solid #1A1A1A with optional subtle grid
2. Text sections separated by \\n\\n
3. Top-left section: Small intro text, WHITE (#F4F0E8), font size 24-28px, top-left with 40px padding
4. Center section: ONE LARGE WORD, BRIGHT BURGUNDY (#A8342F), font size 88-108px, centered, breaks composition
5. Bottom-left section: Small remark text, WHITE (#F4F0E8), font size 24-28px, bottom-left with 40px padding
6. Fonts: Bold, condensed, uppercase (Bebas Neue/Anton style)
7. All text MUST be clearly visible and readable

CRITICAL: Generate a COMPLETE IMAGE with all text rendered. NOT BLANK.`;
        break;
      case 5:
        userPrompt = `GENERATE INSTAGRAM CARD TYPE 5: CTA SLIDE

Canvas: 1080x1440px
Background: OFF-WHITE (#F4F0E8) - must fill entire canvas

Text Content to Render:
${textInScreen}

Layout Instructions (CRITICAL):
1. Background MUST be solid #F4F0E8 (no patterns)
2. Top (y ~60px): Small "VM" monogram in DEEP BURGUNDY (#7A1C1C), font size 32px, right-aligned
3. Text sections separated by \\n\\n
4. Main text block (y ~180px): Text in CHARCOAL (#1A1A1A), font size 28-32px, centered, 40% height
5. Highlighted box (y ~900px): Background DEEP BURGUNDY (#7A1C1C), height 200px, 80% width, centered
   - Text inside: OFF-WHITE (#F4F0E8), font size 28px, bold
6. Fonts: Bold, condensed, uppercase (Bebas Neue/Anton style)
7. Vertical connectors between sections, DEEP BURGUNDY (#7A1C1C), opacity 0.3
8. All text MUST be clearly visible and readable

CRITICAL: Generate a COMPLETE IMAGE with all text rendered. NOT BLANK. Premium aesthetic.`;
        break;
    }

    // Call Gemini 3 Pro Vision
    const geminiResponse = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY,
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

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts;

    if (!parts || !Array.isArray(parts)) {
      console.error('❌ No parts array in Gemini response. Data:', JSON.stringify(data).substring(0, 300));
      return NextResponse.json(
        { success: false, error: 'Gemini response has no content parts' },
        { status: 500 }
      );
    }

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
