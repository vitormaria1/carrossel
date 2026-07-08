import fs from 'fs';
import os from 'os';
import { join } from 'path';
import { PassThrough, Readable } from 'stream';
import * as PImage from 'pureimage';
import { ARIAL_REGULAR_BASE64 } from './embedded-fonts';

export interface ServerRenderCard {
  headline?: string;
  text: string;
  cta?: string;
  colors: { bg: string; text: string; accent?: string };
  imageUrl?: string;
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

function drawPseudoBoldLines(
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
    ctx.fillText(line, x + 0.8, y);
    ctx.fillText(line, x, y + 0.8);
    y += lineHeight;
  }
}

function fillRoundedRect(
  ctx: PImage.Context,
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

function bufferToStream(buffer: Buffer): Readable {
  return Readable.from(buffer);
}

async function loadImageFromUrl(url: string): Promise<PImage.Bitmap | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    const buffer = Buffer.from(await response.arrayBuffer());
    const streamFactory = () => bufferToStream(buffer);

    if (contentType.includes('png') || url.toLowerCase().includes('.png')) {
      return await PImage.decodePNGFromStream(streamFactory());
    }

    return await PImage.decodeJPEGFromStream(streamFactory());
  } catch {
    return null;
  }
}

async function loadProfileImage(): Promise<PImage.Bitmap | null> {
  const profileUrl =
    process.env.NEXT_PUBLIC_TWEET_PROFILE_IMAGE_URL?.trim() ||
    'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/teste01/@viniwaknin-2.jpg';

  return loadImageFromUrl(profileUrl);
}

function drawCircleImage(
  ctx: PImage.Context,
  img: PImage.Bitmap,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

function drawRoundedImage(
  ctx: PImage.Context,
  img: PImage.Bitmap,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.save();
  fillRoundedRect(ctx, x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
}

async function drawTweetCard(ctx: PImage.Context, card: ServerRenderCard) {
  const width = 1080;
  const height = 1350;
  const bg = '#1A0F0F';
  const textColor = '#F4F0E8';
  const accent = card.colors.accent || '#A8342F';
  const profileName = process.env.NEXT_PUBLIC_TWEET_PROFILE_NAME?.trim() || 'Vitor Maria';
  const profileHandle = process.env.NEXT_PUBLIC_TWEET_PROFILE_HANDLE?.trim() || '@vitor_smaria';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const paddingX = 50;
  const paddingY = 40;
  const profileImageSize = 44;
  const textWidth = width - paddingX * 2;
  const profileX = paddingX;
  const profileY = paddingY;
  const footerHeight = 90;
  const headerHeight = 80;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const profileImg = await loadProfileImage();
  if (profileImg) {
    drawCircleImage(ctx, profileImg, profileX, profileY, profileImageSize);
  } else {
    ctx.fillStyle = '#7A1C1C';
    ctx.beginPath();
    ctx.arc(
      profileX + profileImageSize / 2,
      profileY + profileImageSize / 2,
      profileImageSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = '#F4F0E8';
    setFont(ctx, 22);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VM', profileX + profileImageSize / 2, profileY + profileImageSize / 2 + 1);
  }

  // Header text
  drawLeftAlignedLines(
    ctx,
    [profileName],
    profileX + profileImageSize + 14,
    profileY + 4,
    0,
    14,
    '#F4F0E8'
  );

  setFont(ctx, 12);
  ctx.fillStyle = '#888888';
  ctx.fillText(profileHandle, profileX + profileImageSize + 14, profileY + 24);

  const contentTop = paddingY + headerHeight + 20;
  const contentBottom = height - paddingY - footerHeight - 30;
  const textX = paddingX;

  const headline = card.headline?.trim() || '';
  const headlineLines = headline ? wrapText(ctx, headline, textWidth, 28).slice(0, 2) : [];
  const bodyFontSize = 22;
  const bodyLines = wrapText(ctx, card.text, textWidth, bodyFontSize);

  let currentY = contentTop + 10;

  if (headlineLines.length) {
    drawPseudoBoldLines(ctx, headlineLines, textX, currentY, 38, 28, '#F4F0E8');
    currentY += headlineLines.length * 38 + 22;
  }

  // Body copy
  const bodyBlockHeight = bodyLines.length * 32;
  const bodyStartY = currentY;
  drawLeftAlignedLines(ctx, bodyLines, textX, bodyStartY, 32, bodyFontSize, textColor);
  currentY += bodyBlockHeight;

  if (card.imageUrl) {
    const tweetImg = await loadImageFromUrl(card.imageUrl);
    if (tweetImg) {
      const maxImageHeight = 320;
      const imageGap = 36;
      const maxImageWidth = textWidth;
      const aspect = tweetImg.width / tweetImg.height || 1;
      let imageWidth = maxImageWidth;
      let imageHeight = imageWidth / aspect;
      if (imageHeight > maxImageHeight) {
        imageHeight = maxImageHeight;
        imageWidth = imageHeight * aspect;
      }
      imageWidth = Math.min(imageWidth, maxImageWidth);
      imageHeight = Math.min(imageHeight, maxImageHeight);
      const imageX = (width - imageWidth) / 2;
      const imageStartY = Math.min(currentY + imageGap, contentBottom - imageHeight);

      drawRoundedImage(ctx, tweetImg, imageX, imageStartY, imageWidth, imageHeight, 20);
    }
  }

  if (card.cta) {
    const ctaY = 1180;
    const ctaWidth = 400;
    const ctaHeight = 100;
    const ctaX = (width - ctaWidth) / 2;
    const ctaRadius = 50;

    ctx.fillStyle = accent;
    fillRoundedRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, ctaRadius);
    ctx.fill();

    const ctaTextColor = isLightBg(accent) ? '#0C1014' : '#FFFFFF';
    setFont(ctx, 22);
    ctx.fillStyle = ctaTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.cta || 'Clique aqui', width / 2, ctaY + ctaHeight / 2);
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
    drawPseudoBoldLines(ctx, headlineLines, 80, 255, 46, 36, text);
  }

  drawLeftAlignedLines(ctx, bodyLines, 80, headlineLines.length ? 390 : 320, 40, 28, text);

  if (cta) {
    ctx.fillStyle = accent;
    fillRoundedRect(ctx, 80, height - 170, 340, 88, 28);
    ctx.fill();
    ctx.fillStyle = isLightBg(accent) ? '#0C1014' : '#FFFFFF';
    setFont(ctx, 28);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cta, 250, height - 112);
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
  const height = template === 'standard' ? 1080 : 1440;
  const canvas = PImage.make(width, height);
  const ctx = canvas.getContext('2d');

  if (template === 'standard') {
    drawStandardCard(ctx, card);
  } else {
    await drawTweetCard(ctx, card);
  }

  return canvasToBase64(canvas);
}
