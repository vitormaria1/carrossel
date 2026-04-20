import { NextRequest, NextResponse } from 'next/server';

// Validar hex color format
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// Sanitizar string para SVG (escapar caracteres especiais)
function sanitizeForSVG(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(request: NextRequest) {
  try {
    const headline = request.nextUrl.searchParams.get('headline') || '';
    const text = request.nextUrl.searchParams.get('text') || '';
    const bgColor = request.nextUrl.searchParams.get('bgColor') || '#FFFFFF';
    const textColor = request.nextUrl.searchParams.get('textColor') || '#0C1014';

    // 🔴 VALIDAÇÃO CRÍTICA
    if (!isValidHexColor(bgColor)) {
      return NextResponse.json(
        { error: 'Invalid bgColor format. Use hex color (e.g., #FFFFFF)' },
        { status: 400 }
      );
    }
    if (!isValidHexColor(textColor)) {
      return NextResponse.json(
        { error: 'Invalid textColor format. Use hex color (e.g., #0C1014)' },
        { status: 400 }
      );
    }

    // Validar tamanho de texto
    if (headline.length > 100) {
      return NextResponse.json(
        { error: 'Headline must be <= 100 characters' },
        { status: 400 }
      );
    }
    if (text.length > 300) {
      return NextResponse.json(
        { error: 'Text must be <= 300 characters' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedHeadline = sanitizeForSVG(headline);
    const sanitizedText = sanitizeForSVG(text);

    // Gerar SVG com o conteúdo do slide (usando valores sanitizados)
    const svg = `
      <svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            text { font-family: 'Arial', sans-serif; }
            .headline { font-size: 72px; font-weight: 900; }
            .content { font-size: 48px; line-height: 1.4; }
          </style>
        </defs>

        <rect width="1080" height="1350" fill="${bgColor}"/>

        <text x="540" y="400" text-anchor="middle" fill="${textColor}" class="headline">
          <tspan x="540" dy="0">${sanitizedHeadline.substring(0, 50)}</tspan>
        </text>

        <text x="540" y="750" text-anchor="middle" fill="${textColor}" class="content">
          <tspan x="540" dy="0">${sanitizedText.substring(0, 80)}</tspan>
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
