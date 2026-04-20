import { createCanvas } from 'canvas';
import { CarouselCard } from './store';

function wrapText(ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function isLightBg(bgColor: string): boolean {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export async function generateCardBase64(card: CarouselCard, template: 'standard' | 'tweet' = 'standard'): Promise<string> {
  if (template === 'tweet') {
    return generateTweetCardBase64(card);
  }
  return generateStandardCardBase64(card);
}

async function generateStandardCardBase64(card: CarouselCard): Promise<string> {
  try {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = card.colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text color
    ctx.fillStyle = card.colors.text;
    ctx.textBaseline = 'top';

    // Headline
    ctx.font = 'bold 56px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';

    const headlineY = 200;
    const headlineText = card.headline || 'Headline';
    const headlineLines = headlineText.split(' ');
    let headlineLine = '';
    let currentY = headlineY;

    for (const word of headlineLines) {
      const testLine = headlineLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 950 && headlineLine) {
        ctx.fillText(headlineLine, canvas.width / 2, currentY);
        headlineLine = word + ' ';
        currentY += 70;
      } else {
        headlineLine = testLine;
      }
    }
    ctx.fillText(headlineLine, canvas.width / 2, currentY);

    // Body text
    ctx.font = '42px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';

    currentY += 120;
    const bodyText = card.text || 'Conteúdo';
    const bodyLines = bodyText.split(' ');
    let bodyLine = '';

    for (const word of bodyLines) {
      const testLine = bodyLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && bodyLine) {
        ctx.fillText(bodyLine, canvas.width / 2, currentY);
        bodyLine = word + ' ';
        currentY += 60;
      } else {
        bodyLine = testLine;
      }
    }
    ctx.fillText(bodyLine, canvas.width / 2, currentY);

    // CTA
    if (card.cta) {
      currentY += 100;

      // CTA button background
      ctx.fillStyle = card.colors.accent || card.colors.text;
      ctx.fillRect(canvas.width / 2 - 150, currentY, 300, 60);

      // CTA text
      ctx.fillStyle = isLightBg(card.colors.bg) ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 32px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(card.cta, canvas.width / 2, currentY + 15);
    }

    // Convert canvas to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');

    return base64;
  } catch (error) {
    console.error('Error generating standard card base64:', error);
    throw error;
  }
}

async function generateTweetCardBase64(card: CarouselCard): Promise<string> {
  try {
    const canvas = createCanvas(1080, 1440);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = card.colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text color
    ctx.fillStyle = card.colors.text;
    ctx.textBaseline = 'top';

    // Headline (top)
    ctx.font = 'bold 48px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';

    let currentY = 80;
    const headlineText = card.headline || 'Headline';
    const headlineLines = headlineText.split(' ');
    let headlineLine = '';

    for (const word of headlineLines) {
      const testLine = headlineLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 950 && headlineLine) {
        ctx.fillText(headlineLine, canvas.width / 2, currentY);
        headlineLine = word + ' ';
        currentY += 60;
      } else {
        headlineLine = testLine;
      }
    }
    ctx.fillText(headlineLine, canvas.width / 2, currentY);

    // Body text (center)
    ctx.font = '38px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';

    currentY += 120;
    const bodyText = card.text || 'Conteúdo';
    const bodyLines = bodyText.split(' ');
    let bodyLine = '';

    for (const word of bodyLines) {
      const testLine = bodyLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && bodyLine) {
        ctx.fillText(bodyLine, canvas.width / 2, currentY);
        bodyLine = word + ' ';
        currentY += 50;
      } else {
        bodyLine = testLine;
      }
    }
    ctx.fillText(bodyLine, canvas.width / 2, currentY);

    // CTA (bottom)
    if (card.cta) {
      currentY = canvas.height - 140;

      // CTA button background
      ctx.fillStyle = card.colors.accent || card.colors.text;
      ctx.fillRect(canvas.width / 2 - 150, currentY, 300, 60);

      // CTA text
      ctx.fillStyle = isLightBg(card.colors.bg) ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 32px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(card.cta, canvas.width / 2, currentY + 15);
    }

    // Convert canvas to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');

    return base64;
  } catch (error) {
    console.error('Error generating tweet card base64:', error);
    throw error;
  }
}
