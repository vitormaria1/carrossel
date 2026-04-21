/**
 * VANDER MARIA - Canvas Renderers (5 Types)
 * RIGOROUSLY FAITHFUL TO SYSTEM INSTRUCTIONS
 * Each function renders exactly per specification
 */

import { VANDER_COLORS, VANDER_TYPOGRAPHY } from './constants';
import { VanderMariaCard } from './types';

interface RenderOptions {
  profileImg?: HTMLImageElement | null;
  cardImg?: HTMLImageElement | null;
}

/**
 * TYPE 1 - COVER SLIDE
 * Image from Gemini (already has text rendered on it)
 * Just display the image as-is
 */
export function renderVanderType1(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: VanderMariaCard,
  options: RenderOptions = {}
): void {
  canvas.width = 2160;
  canvas.height = 2880;

  // Draw the image from Gemini (text is already rendered on it)
  if (options.cardImg) {
    ctx.drawImage(options.cardImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fallback: solid color
    ctx.fillStyle = VANDER_COLORS.deepBurgundy;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * TYPE 2 - SUPPORTING SLIDE
 * Image from Gemini (already has text in top 40%)
 * Just display the image as-is
 */
export function renderVanderType2(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: VanderMariaCard,
  options: RenderOptions = {}
): void {
  canvas.width = 1080;
  canvas.height = 1440;

  // Draw the image from Gemini (text is already rendered on it)
  if (options.cardImg) {
    ctx.drawImage(options.cardImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fallback: solid color
    ctx.fillStyle = VANDER_COLORS.charcoal;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * TYPE 3 - CONCEPTUAL SLIDE
 * Image from Gemini (pure typography on dark background)
 */
export function renderVanderType3(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: VanderMariaCard,
  options: RenderOptions = {}
): void {
  canvas.width = 1080;
  canvas.height = 1440;

  // Draw the image from Gemini
  if (options.cardImg) {
    ctx.drawImage(options.cardImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fallback: near-black background
    ctx.fillStyle = VANDER_COLORS.nearBlack;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * TYPE 4 - HIGH-IMPACT SLIDE
 * Image from Gemini (editorial-poster with typography)
 */
export function renderVanderType4(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: VanderMariaCard,
  options: RenderOptions = {}
): void {
  canvas.width = 1080;
  canvas.height = 1440;

  // Draw the image from Gemini
  if (options.cardImg) {
    ctx.drawImage(options.cardImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fallback: charcoal background
    ctx.fillStyle = VANDER_COLORS.charcoal;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * TYPE 5 - CTA SLIDE
 * Image from Gemini (premium CTA with monogram and highlighted box)
 */
export function renderVanderType5(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  card: VanderMariaCard,
  options: RenderOptions = {}
): void {
  canvas.width = 1080;
  canvas.height = 1440;

  // Draw the image from Gemini
  if (options.cardImg) {
    ctx.drawImage(options.cardImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fallback: off-white background
    ctx.fillStyle = VANDER_COLORS.offWhite;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// HELPER FUNCTIONS

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';

  words.forEach((word) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);

    // Se palavra individual é maior que maxWidth, quebrar por caractere
    const wordMetrics = ctx.measureText(word);
    if (wordMetrics.width > maxWidth) {
      // Flush current line first
      if (line) {
        ctx.fillText(line.trim(), x, y);
        y += lineHeight;
        line = '';
      }

      // Quebrar palavra longa por caractere
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
      return;
    }

    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line.trim(), x, y);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
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

function drawVMonogram(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  // Subtle V monogram (upper right corner, ~12% of frame width, very small)
  const markSize = (canvas.width * 0.12) / 2; // Half-width for full mark
  const x = canvas.width - markSize - 40;
  const y = 40;

  ctx.font = `bold ${markSize * 1.5}px ${VANDER_TYPOGRAPHY.condensed}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';

  // Draw white outline para contraste
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = VANDER_COLORS.offWhite;
  ctx.lineWidth = 2;
  ctx.strokeStyle = VANDER_COLORS.offWhite;
  ctx.strokeText('V', x, y);

  // Draw V em burgundy no topo
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = VANDER_COLORS.deepBurgundy;
  ctx.fillText('V', x, y);
  ctx.restore();
}
