import sharp from 'sharp';

export interface ServerRenderCard {
  headline?: string;
  text: string;
  cta?: string;
  colors: { bg: string; text: string; accent?: string };
}

export type ServerCarouselTemplate = 'standard' | 'tweet' | 'tweetExpanded';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function approxLineWrap(text: string, maxCharsPerLine: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function linesToTspans(
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number
): string {
  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : lineHeight;
      return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');
}

function buildTweetSvg(card: ServerRenderCard, options: { width: number; height: number }): string {
  const { width, height } = options;
  const bg = card.colors.bg || '#FFFFFF';
  const text = card.colors.text || '#0C1014';
  const accent = card.colors.accent || '#5B51D8';
  const headline = (card.headline || '').trim();
  const body = (card.text || '').trim();
  const cta = (card.cta || '').trim();

  const headerLines = headline ? approxLineWrap(headline, 26).slice(0, 2) : [];
  const bodyLines = approxLineWrap(body, 34).slice(0, 8);
  const ctaLabel = cta || 'Salvar';

  const headerY = 222;
  const bodyY = headline ? 360 : 300;
  const ctaY = height - 160;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="${bg}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
      <rect x="0" y="0" width="${width}" height="110" fill="#111111" />
      <circle cx="80" cy="55" r="24" fill="${accent}" />
      <circle cx="80" cy="55" r="14" fill="#FFFFFF" opacity="0.9" />
      <text x="132" y="48" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">carrossel.ai</text>
      <text x="132" y="77" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#CFCFCF">@soudaviribas</text>

      ${headline ? `
        <text x="80" y="${headerY}" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="${text}">
          ${linesToTspans(headerLines, 80, headerY, 72)}
        </text>
      ` : ''}

      <text x="80" y="${bodyY}" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="500" fill="${text}" opacity="0.94">
        ${linesToTspans(bodyLines, 80, bodyY, 58)}
      </text>

      ${cta ? `
        <rect x="80" y="${ctaY}" rx="28" ry="28" width="320" height="92" fill="${accent}" />
        <text x="240" y="${ctaY + 58}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">${escapeXml(ctaLabel)}</text>
      ` : ''}
    </svg>
  `;
}

function buildStandardSvg(card: ServerRenderCard, options: { width: number; height: number }): string {
  const { width, height } = options;
  const bg = card.colors.bg || '#FFFFFF';
  const text = card.colors.text || '#0C1014';
  const accent = card.colors.accent || '#405DE6';
  const headline = (card.headline || '').trim();
  const body = (card.text || '').trim();
  const cta = (card.cta || '').trim();

  const headlineLines = headline ? approxLineWrap(headline, 20).slice(0, 3) : [];
  const bodyLines = approxLineWrap(body, 28).slice(0, 10);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bg}" />
      <rect x="0" y="0" width="${width}" height="120" fill="${accent}" />
      <text x="80" y="78" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">carrossel.ai</text>

      ${headline ? `
        <text x="80" y="260" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="900" fill="${text}">
          ${linesToTspans(headlineLines, 80, 260, 78)}
        </text>
      ` : ''}

      <text x="80" y="${headline ? 470 : 300}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="500" fill="${text}" opacity="0.94">
        ${linesToTspans(bodyLines, 80, headline ? 470 : 300, 54)}
      </text>

      ${cta ? `
        <rect x="80" y="${height - 170}" rx="28" ry="28" width="340" height="88" fill="${accent}" />
        <text x="250" y="${height - 115}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#FFFFFF">${escapeXml(cta)}</text>
      ` : ''}
    </svg>
  `;
}

export async function renderCardToBase64Server(
  card: ServerRenderCard,
  template: ServerCarouselTemplate
): Promise<string> {
  const width = 1080;
  const height = template === 'standard' ? 1080 : 1350;
  const svg =
    template === 'tweet'
      ? buildTweetSvg(card, { width, height })
      : buildStandardSvg(card, { width, height });

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer.toString('base64');
}
