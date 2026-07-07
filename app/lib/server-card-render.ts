import { join } from 'path';
import { PassThrough } from 'stream';
import * as PImage from 'pureimage';

export interface ServerRenderCard {
  headline?: string;
  text: string;
  cta?: string;
  colors: { bg: string; text: string; accent?: string };
}

export type ServerCarouselTemplate = 'standard' | 'tweet' | 'tweetExpanded';

const FONT_REGULAR = join(process.cwd(), 'lib/fonts/Arial.ttf');
const FONT_BOLD = join(process.cwd(), 'lib/fonts/Arial-Bold.ttf');

let fontsReady = false;

function ensureFontsLoaded() {
  if (fontsReady) return;

  const regular = PImage.registerFont(FONT_REGULAR, 'Arial');
  const bold = PImage.registerFont(FONT_BOLD, 'Arial Bold');

  regular.loadSync();
  bold.loadSync();

  fontsReady = true;
}

function escapeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function setFont(ctx: PImage.Context, size: number, bold = false) {
  ctx.font = `${bold ? '700 ' : ''}${size}pt ${bold ? '"Arial Bold"' : 'Arial'}`;
}

function measureWidth(ctx: PImage.Context, text: string): number {
  return ctx.measureText(text).width;
}

function wrapText(ctx: PImage.Context, text: string, maxWidth: number, fontSize: number): string[] {
  const words = escapeText(text).split(' ').filter(Boolean);
  if (!words.length) return [];

  setFont(ctx, fontSize, false);

  const lines: string[] = [];
  let current = words[0];

  for (let index = 1; index < words.length; index += 1) {
    const word = words[index];
    const candidate = `${current} ${word}`;
    if (measureWidth(ctx, candidate) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function fillRoundedRect(
  ctx: PImage.Context,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  void radius;
  ctx.fillRect(x, y, width, height);
}

function drawCenteredLines(
  ctx: PImage.Context,
  lines: string[],
  centerX: number,
  startY: number,
  lineHeight: number,
  fontSize: number,
  bold = false,
  color = '#0C1014'
) {
  setFont(ctx, fontSize, bold);
  ctx.fillStyle = color;
  let y = startY;

  for (const line of lines) {
    const width = measureWidth(ctx, line);
    ctx.fillText(line, centerX - width / 2, y);
    y += lineHeight;
  }
}

function drawLeftAlignedLines(
  ctx: PImage.Context,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
  fontSize: number,
  bold = false,
  color = '#0C1014'
) {
  setFont(ctx, fontSize, bold);
  ctx.fillStyle = color;
  let y = startY;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
}

function drawTweetCard(ctx: PImage.Context, card: ServerRenderCard) {
  const width = 1080;
  const height = 1350;
  const bg = card.colors.bg || '#FFFFFF';
  const text = card.colors.text || '#0C1014';
  const accent = card.colors.accent || '#5B51D8';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, width, 118);

  ctx.fillStyle = accent;
  ctx.fillRect(60, 34, 52, 52);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(78, 52, 16, 16);

  drawLeftAlignedLines(ctx, ['carrossel.ai'], 130, 68, 0, 26, true, '#FFFFFF');
  drawLeftAlignedLines(ctx, ['@soudaviribas'], 130, 96, 0, 18, false, '#CFCFCF');

  const headline = card.headline?.trim() || '';
  const body = card.text.trim();
  const cta = card.cta?.trim() || '';

  const headlineLines = headline ? wrapText(ctx, headline, 900, 58).slice(0, 2) : [];
  const bodyLines = wrapText(ctx, body, 900, 38).slice(0, 10);

  if (headlineLines.length) {
    drawLeftAlignedLines(ctx, headlineLines, 80, 250, 72, 58, true, text);
  }

  drawLeftAlignedLines(ctx, bodyLines, 80, headlineLines.length ? 420 : 320, 56, 38, false, text);

  if (cta) {
    ctx.fillStyle = accent;
    fillRoundedRect(ctx, 80, height - 180, 320, 90, 28);
    drawCenteredLines(ctx, [cta || 'Salvar'], 240, height - 122, 0, 32, true, '#FFFFFF');
  }
}

function drawStandardCard(ctx: PImage.Context, card: ServerRenderCard) {
  const width = 1080;
  const height = 1080;
  const bg = card.colors.bg || '#FFFFFF';
  const text = card.colors.text || '#0C1014';
  const accent = card.colors.accent || '#405DE6';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, width, 124);

  drawLeftAlignedLines(ctx, ['carrossel.ai'], 80, 80, 0, 28, true, '#FFFFFF');

  const headline = card.headline?.trim() || '';
  const body = card.text.trim();
  const cta = card.cta?.trim() || '';

  const headlineLines = headline ? wrapText(ctx, headline, 920, 64).slice(0, 3) : [];
  const bodyLines = wrapText(ctx, body, 920, 40).slice(0, 10);

  if (headlineLines.length) {
    drawLeftAlignedLines(ctx, headlineLines, 80, 275, 78, 64, true, text);
  }

  drawLeftAlignedLines(ctx, bodyLines, 80, headlineLines.length ? 500 : 320, 58, 40, false, text);

  if (cta) {
    ctx.fillStyle = accent;
    fillRoundedRect(ctx, 80, height - 170, 340, 88, 28);
    drawCenteredLines(ctx, [cta], 250, height - 112, 0, 32, true, '#FFFFFF');
  }
}

async function canvasToBase64(canvas: PImage.Bitmap): Promise<string> {
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  stream.on('data', (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  const done = new Promise<string>((resolve, reject) => {
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    stream.on('error', reject);
  });

  await PImage.encodePNGToStream(canvas, stream);
  stream.end();

  return done;
}

export async function renderCardToBase64Server(
  card: ServerRenderCard,
  template: ServerCarouselTemplate
): Promise<string> {
  ensureFontsLoaded();

  const width = 1080;
  const height = template === 'standard' ? 1080 : 1350;
  const canvas = PImage.make(width, height);
  const ctx = canvas.getContext('2d');

  if (template === 'standard') {
    drawStandardCard(ctx, card);
  } else {
    drawTweetCard(ctx, card);
  }

  return canvasToBase64(canvas);
}
