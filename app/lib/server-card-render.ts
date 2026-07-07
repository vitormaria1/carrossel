import fs from 'fs';
import os from 'os';
import { join } from 'path';
import { PassThrough } from 'stream';
import * as PImage from 'pureimage';
import { ARIAL_REGULAR_BASE64 } from './embedded-fonts';

export interface ServerRenderCard {
  headline?: string;
  text: string;
  cta?: string;
  colors: { bg: string; text: string; accent?: string };
}

export type ServerCarouselTemplate = 'standard' | 'tweet' | 'tweetExpanded';

const FONT_RUNTIME_DIR = join(os.tmpdir(), 'carrossel-fonts');
const FONT_REGULAR = join(FONT_RUNTIME_DIR, 'Arial.ttf');

let fontsReady = false;

function ensureFontsLoaded() {
  if (fontsReady) return;

  if (!fs.existsSync(FONT_RUNTIME_DIR)) {
    fs.mkdirSync(FONT_RUNTIME_DIR, { recursive: true });
  }

  if (!fs.existsSync(FONT_REGULAR)) {
    fs.writeFileSync(FONT_REGULAR, Buffer.from(ARIAL_REGULAR_BASE64, 'base64'));
  }

  const regular = PImage.registerFont(FONT_REGULAR, 'Arial');

  regular.loadSync();

  fontsReady = true;
}

function escapeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function setFont(ctx: PImage.Context, size: number) {
  ctx.font = `${size}pt Arial`;
}

function measureWidth(ctx: PImage.Context, text: string): number {
  return ctx.measureText(text).width;
}

function wrapText(ctx: PImage.Context, text: string, maxWidth: number, fontSize: number): string[] {
  const words = escapeText(text).split(' ').filter(Boolean);
  if (!words.length) return [];

  setFont(ctx, fontSize);

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
  color = '#0C1014'
) {
  setFont(ctx, fontSize);
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
  color = '#0C1014'
) {
  setFont(ctx, fontSize);
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
  const left = 80;
  const right = 80;
  const contentWidth = width - left - right;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, width, 132);

  ctx.fillStyle = accent;
  ctx.fillRect(60, 40, 52, 52);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(78, 58, 16, 16);

  drawLeftAlignedLines(ctx, ['carrossel.ai'], 130, 74, 0, 24, '#FFFFFF');
  drawLeftAlignedLines(ctx, ['@soudaviribas'], 130, 104, 0, 16, '#CFCFCF');

  const headline = card.headline?.trim() || '';
  const body = card.text.trim();
  const cta = card.cta?.trim() || '';

  const headlineLines = headline ? wrapText(ctx, headline, contentWidth, 30).slice(0, 2) : [];
  const bodyLines = wrapText(ctx, body, contentWidth, 26).slice(0, 11);

  if (headlineLines.length) {
    drawLeftAlignedLines(ctx, headlineLines, left, 240, 36, 30, text);
  }

  drawLeftAlignedLines(ctx, bodyLines, left, headlineLines.length ? 360 : 300, 34, 26, text);

  if (cta) {
    ctx.fillStyle = accent;
    fillRoundedRect(ctx, left, height - 176, 300, 84, 28);
    drawCenteredLines(ctx, [cta || 'Salvar'], left + 150, height - 122, 0, 26, '#FFFFFF');
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

  drawLeftAlignedLines(ctx, ['carrossel.ai'], 80, 80, 0, 28, '#FFFFFF');

  const headline = card.headline?.trim() || '';
  const body = card.text.trim();
  const cta = card.cta?.trim() || '';

  const headlineLines = headline ? wrapText(ctx, headline, 920, 64).slice(0, 3) : [];
  const bodyLines = wrapText(ctx, body, 920, 40).slice(0, 10);

  if (headlineLines.length) {
    drawLeftAlignedLines(ctx, headlineLines, 80, 255, 46, 36, text);
  }

  drawLeftAlignedLines(ctx, bodyLines, 80, headlineLines.length ? 390 : 320, 40, 28, text);

  if (cta) {
    ctx.fillStyle = accent;
    fillRoundedRect(ctx, 80, height - 170, 340, 88, 28);
    drawCenteredLines(ctx, [cta], 250, height - 112, 0, 28, '#FFFFFF');
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
