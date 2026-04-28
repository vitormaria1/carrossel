/**
 * Lógica COMPARTILHADA de renderização de canvas
 * Usada tanto no browser quanto no servidor
 * Garante que preview (UI) = imagem publicada (Instagram)
 */

import { CarouselCard } from './store';

export interface RenderOptions {
  profileImg?: HTMLImageElement | null;
  cardImg?: HTMLImageElement | null;
}

/**
 * Renderiza um card no canvas (implementation compartilhada)
 * Chamada tanto do browser (createTweetCardCanvasSync)
 * quanto do servidor (server-image-generator.ts)
 */
export function renderTweetCardOnCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: CarouselCard,
  options: RenderOptions = {}
): void {
  const { profileImg = null, cardImg = null } = options;

  // Dimensões
  canvas.width = 1080;
  canvas.height = 1440;

  // Fundo branco com gradient
  ctx.fillStyle = card.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Medidas de espaçamento
  const padding = 50;
  const textWidth = canvas.width - padding * 2;
  const profileImageSize = 110;
  const imageMaxHeight = 550;
  const imageMaxWidth = canvas.width - padding * 2;
  const imageWidth = imageMaxWidth;
  const imageHeight = (imageWidth * 9) / 16;
  const ctaHeight = 60;
  const ctaWidth = 300;

  // Cálcular altura total de conteúdo
  let contentHeight = 0;

  // Profile: imagem + espaço
  contentHeight += profileImageSize + 20;

  // Headline
  let headlineHeight = 0;
  if (card.headline) {
    ctx.font = 'bold 48px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    headlineHeight = estimateTextHeight(ctx, card.headline, textWidth, 60);
    contentHeight += headlineHeight + 20;
  }

  // Body text
  ctx.font = '52px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  const bodyHeight = estimateTextHeight(ctx, card.text, textWidth, 38);
  contentHeight += bodyHeight + 20;

  // Card image se existir
  if (cardImg) {
    contentHeight += imageHeight + 20;
  }

  // CTA button
  contentHeight += ctaHeight + 20;

  // Calcular posição inicial para centralizar (centro vertical)
  const totalAvailableHeight = canvas.height;
  const topMargin = Math.max(10, (totalAvailableHeight - contentHeight) / 2);

  // Começar posicionamento
  let currentY = topMargin;

  // 1. Profile info
  const profileX = padding;
  const profileY = currentY;

  // Desenhar profile image
  if (profileImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(profileImg, profileX, profileY, profileImageSize, profileImageSize);
    ctx.restore();
  } else {
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nome + @user (ao lado da foto)
  const textStartX = profileX + profileImageSize + 30;
  ctx.font = 'bold 44px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Vitor Maria', textStartX, profileY + 5);

  ctx.font = '40px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#7A7A7A';
  ctx.fillText('@vitor_smaria', textStartX, profileY + 55);

  currentY += profileImageSize + 20;

  // 2. Headline
  if (card.headline) {
    ctx.font = 'bold 48px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = card.colors.text;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    wrapText(ctx, card.headline, padding, currentY, textWidth, 60);
    currentY += headlineHeight + 20;
  }

  // 3. Body text
  ctx.font = '52px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = card.colors.text;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  wrapText(ctx, card.text, padding, currentY, textWidth, 38);
  currentY += bodyHeight + 20;

  // 4. Card image (se existir)
  if (cardImg) {
    try {
      const imageX = (canvas.width - imageWidth) / 2;
      const imageStartY = currentY;
      const targetRatio = 16 / 9;

      // Calculate center crop para manter proporção 16:9 natural
      const sourceWidth = cardImg.width;
      const sourceHeight = cardImg.height;
      const sourceRatio = sourceWidth / sourceHeight;

      let cropX = 0;
      let cropY = 0;
      let cropWidth = sourceWidth;
      let cropHeight = sourceHeight;

      if (sourceRatio > targetRatio) {
        // Imagem muito larga: crop horizontal
        cropWidth = sourceHeight * targetRatio;
        cropX = (sourceWidth - cropWidth) / 2;
      } else if (sourceRatio < targetRatio) {
        // Imagem muito estreita: crop vertical
        cropHeight = sourceWidth / targetRatio;
        cropY = (sourceHeight - cropHeight) / 2;
      }

      // Desenhar com cantos arredondados + center crop
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(imageX + 15, imageStartY);
      ctx.lineTo(imageX + imageWidth - 15, imageStartY);
      ctx.quadraticCurveTo(imageX + imageWidth, imageStartY, imageX + imageWidth, imageStartY + 15);
      ctx.lineTo(imageX + imageWidth, imageStartY + imageHeight - 15);
      ctx.quadraticCurveTo(imageX + imageWidth, imageStartY + imageHeight, imageX + imageWidth - 15, imageStartY + imageHeight);
      ctx.lineTo(imageX + 15, imageStartY + imageHeight);
      ctx.quadraticCurveTo(imageX, imageStartY + imageHeight, imageX, imageStartY + imageHeight - 15);
      ctx.lineTo(imageX, imageStartY + 15);
      ctx.quadraticCurveTo(imageX, imageStartY, imageX + 15, imageStartY);
      ctx.closePath();
      ctx.clip();

      // drawImage com source crop: (image, sx, sy, sw, sh, dx, dy, dw, dh)
      ctx.drawImage(cardImg, cropX, cropY, cropWidth, cropHeight, imageX, imageStartY, imageWidth, imageHeight);
      ctx.restore();

      currentY += imageHeight + 20;
    } catch (e) {
      console.warn('Erro ao desenhar imagem:', e);
    }
  }

  // 5. CTA button
  if (card.cta) {
    const ctaX = (canvas.width - ctaWidth) / 2;
    const ctaY = currentY;
    const ctaRadius = 30;

    ctx.fillStyle = card.colors.accent || '#405DE6';
    roundRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, ctaRadius);
    ctx.fill();

    const isLight = isLightBg(card.colors.accent || '#405DE6');
    ctx.fillStyle = isLight ? '#0C1014' : '#FFFFFF';
    ctx.font = 'bold 32px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.cta, canvas.width / 2, ctaY + ctaHeight / 2);
  }
}

// Helpers
function estimateTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let lines = 1;

  words.forEach((word) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      lines++;
      line = word + ' ';
    } else {
      line = testLine;
    }
  });

  return lines * lineHeight;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function isLightBg(bgColor: string): boolean {
  if (bgColor === '#FFFFFF') return true;
  if (bgColor === '#000000') return false;

  const match = bgColor.match(/\d+/g);
  if (!match || match.length < 3) return true;

  const [r, g, b] = match.map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  words.forEach((word) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineHeight;
    } else if (metrics.width > maxWidth && !line) {
      // Palavra é tão longa que não cabe mesmo sozinha - quebrar por caractere
      let charLine = '';
      for (const char of word) {
        const charTestLine = charLine + char;
        const charMetrics = ctx.measureText(charTestLine);

        if (charMetrics.width > maxWidth && charLine) {
          ctx.fillText(charLine, x, y);
          y += lineHeight;
          charLine = char;
        } else {
          charLine = charTestLine;
        }
      }
      line = charLine + ' ';
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line.trim(), x, y);
  }
}
