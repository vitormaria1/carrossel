import { CarouselCard } from './store';
import { renderTweetCardOnCanvas } from './canvas-shared';

/**
 * Carrega imagem de forma segura
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Desenha imagem circular (para perfil)
 */
function drawCircleImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
  ctx.clip();

  // Calcular a melhor forma de encaixar a imagem
  const imgAspect = img.width / img.height;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgAspect > 1) {
    // Imagem mais larga, cortar dos lados
    sw = img.height;
    sx = (img.width - sw) / 2;
  } else {
    // Imagem mais alta, cortar do topo/bottom
    sh = img.width;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, radius * 2, radius * 2);
  ctx.restore();
}

/**
 * Exporta um card Tweet Model como imagem PNG - ALTA QUALIDADE
 */
export async function exportTweetCardAsPNG(card: CarouselCard, fileName: string = 'tweet.png') {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) throw new Error('Canvas context not available');

    // ALTA QUALIDADE: Proporção 3:4 exata (1080x1440)
    const baseWidth = 1080;
    const baseHeight = 1440;

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    // Enable image smoothing para melhor qualidade
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // MARGENS COMPACTAS - como nos posts reais
    const marginSides = 50;
    const marginBottom = 60;
    const profileImageSize = 110;

    // Se não tem imagem, centraliza verticalmente. Se tem, usa margem pequena.
    let marginTop = card.imageUrl ? 50 : 150;

    // Perfil (topo) - PEQUENO E COMPACTO
    const profileX = marginSides;
    const profileY = marginTop;

    // Carregar e desenhar imagem de perfil
    try {
      // 🟡 Usar variável de ambiente em vez de URL hardcoded
      const profileImageUrl = process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL;
      if (profileImageUrl) {
        const profileImg = await loadImage(profileImageUrl);
        drawCircleImage(ctx, profileImg, profileX, profileY, profileImageSize / 2);
      } else {
        throw new Error('Profile image URL não configurada');
      }
    } catch (error) {
      console.warn('Failed to load profile image, using placeholder:', error);
      // Desenhar círculo cinza como placeholder
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nome e @user - COMPACTO AO LADO/EMBAIXO
    ctx.font = 'bold 44px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Vitor Maria', profileX + profileImageSize + 30, profileY + 5);

    ctx.font = '40px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#7A7A7A';
    ctx.fillText('@vitor_smaria', profileX + profileImageSize + 30, profileY + 55);

    // Espaço reduzido entre perfil e texto
    const textX = marginSides;
    const textY = profileY + profileImageSize + 50;
    const textWidth = baseWidth - (marginSides * 2);

    // Texto do tweet - GRANDE
    ctx.font = '56px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = wrapTextForCanvas(ctx, card.text, textWidth, 56);
    let currentY = textY;

    for (const line of lines) {
      ctx.fillText(line, textX, currentY);
      currentY += 80;
    }

    // Espaço antes da imagem - AUMENTADO PARA CENTRALIZAR
    const imageGap = 100;
    let finalHeight = baseHeight;

    if (card.imageUrl) {
      try {
        const tweetImg = await loadImage(card.imageUrl);

        // Imagem GRANDE - máximo 550 de altura
        const maxImageHeight = 550;
        const maxImageWidth = (maxImageHeight * 16) / 9;

        const imageWidth = Math.min(maxImageWidth, baseWidth - (marginSides * 2));
        const imageHeight = (imageWidth * 9) / 16;

        const imageX = (baseWidth - imageWidth) / 2; // Centralizar
        const imageStartY = currentY + imageGap;
        const borderRadius = 20; // Cantos arredondados

        // Desenhar imagem com cantos arredondados
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(imageX + borderRadius, imageStartY);
        ctx.lineTo(imageX + imageWidth - borderRadius, imageStartY);
        ctx.quadraticCurveTo(imageX + imageWidth, imageStartY, imageX + imageWidth, imageStartY + borderRadius);
        ctx.lineTo(imageX + imageWidth, imageStartY + imageHeight - borderRadius);
        ctx.quadraticCurveTo(imageX + imageWidth, imageStartY + imageHeight, imageX + imageWidth - borderRadius, imageStartY + imageHeight);
        ctx.lineTo(imageX + borderRadius, imageStartY + imageHeight);
        ctx.quadraticCurveTo(imageX, imageStartY + imageHeight, imageX, imageStartY + imageHeight - borderRadius);
        ctx.lineTo(imageX, imageStartY + borderRadius);
        ctx.quadraticCurveTo(imageX, imageStartY, imageX + borderRadius, imageStartY);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(tweetImg, imageX, imageStartY, imageWidth, imageHeight);
        ctx.restore();

        finalHeight = imageStartY + imageHeight + marginBottom;
      } catch (error) {
        console.warn('Failed to load tweet image', error);
        finalHeight = currentY + imageGap + marginBottom;
      }
    } else {
      finalHeight = currentY + marginBottom;
    }

    // Criar canvas final com altura correta e proporção 3:4
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = baseWidth;
    finalCanvas.height = Math.max(finalHeight, baseHeight);

    const finalCtx = finalCanvas.getContext('2d');
    if (finalCtx) {
      finalCtx.fillStyle = '#FFFFFF';
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.drawImage(canvas, 0, 0);
    }

    // Download com JPEG alta qualidade
    return new Promise<void>((resolve) => {
      finalCanvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.replace('.png', '.jpg');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
          }
          resolve();
        },
        'image/jpeg',
        0.95 // 95% qualidade para JPEG
      );
    });
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

/**
 * Exporta um card individual como imagem PNG (Padrão)
 */
export async function exportCardAsPNG(card: CarouselCard, fileName: string = 'card.png') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) throw new Error('Canvas context not available');

  // Dimensões Instagram Carousel/Feed (1080x1080 - quadrado)
  canvas.width = 1080;
  canvas.height = 1080;

  // Background
  ctx.fillStyle = card.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle gradient overlay para profundidade
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text color
  ctx.fillStyle = card.colors.text;
  ctx.textBaseline = 'top';

  // Headline - Otimizado para feed quadrado
  ctx.font = 'bold 56px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;

  const headlineY = 200;
  wrapText(ctx, card.headline || 'Headline', canvas.width / 2, headlineY, 950, 70);

  // Reset shadow para body text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Main text
  ctx.font = '24px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = card.colors.text;
  const textY = 500;
  wrapText(ctx, card.text, canvas.width / 2, textY, 850, 40);

  // CTA Button - Estilo mais profissional
  const ctaY = 830;
  const ctaWidth = 400;
  const ctaHeight = 100;
  const ctaX = (canvas.width - ctaWidth) / 2;
  const ctaRadius = 50;

  // Button background com borderRadius simulado
  ctx.fillStyle = card.colors.accent || '#405DE6';
  roundRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, ctaRadius);
  ctx.fill();

  // Button text
  ctx.fillStyle = isLightBg(card.colors.accent || '#405DE6') ? '#0C1014' : '#FFFFFF';
  ctx.font = 'bold 48px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.cta || 'Clique aqui', canvas.width / 2, ctaY + ctaHeight / 2);

  // Convert to blob and download com qualidade máxima
  return new Promise<void>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Delay revokeObjectURL para garantir download
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
        resolve();
      },
      'image/png',
      1.0 // Qualidade máxima para PNG
    );
  });
}

/**
 * Exporta todos os cards como um arquivo ZIP
 */
export async function exportAllCardsAsZip(cards: CarouselCard[]) {
  // Verifica se JSZip está disponível
  const JSZip = (window as any).JSZip;
  if (!JSZip) {
    console.error('JSZip not available');
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];
  const zip = new JSZip();
  const folder = zip.folder(`carrossel-${timestamp}`);

  if (!folder) throw new Error('Failed to create folder');

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const canvas = createCardCanvas(card);

    await new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          folder.file(`${String(i + 1).padStart(2, '0')}-card.png`, blob);
        }
        resolve();
      }, 'image/png');
    });
  }

  // README with instructions
  const readme = `# Seu Carrossel está Pronto! 🎉

## Como Usar

1. Abra o Instagram (app ou web)
2. Clique em "Criar" → "Carrossel"
3. Selecione as imagens na ordem (01, 02, 03... ${String(cards.length).padStart(2, '0')})
4. Adicione legenda e hashtags
5. Compartilhe! 🚀

## Tamanho
✅ 1080x1920 - Perfeito para Stories, Reels e Feed

Criado com ❤️ por carrossel.ai
`;

  folder.file('README.txt', readme);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `carrossel-${timestamp}.zip`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Exporta como JSON para reedição posterior
 */
export function exportAsJSON(cards: CarouselCard[], fileName: string = 'carrossel.json') {
  const dataStr = JSON.stringify(cards, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copia cards como texto para clipboard
 */
export async function copyToClipboard(cards: CarouselCard[]) {
  const text = cards
    .map(
      (card, idx) =>
        `Card ${idx + 1}\nHeadline: ${card.headline}\nText: ${card.text}\nCTA: ${card.cta}`
    )
    .join('\n\n---\n\n');

  await navigator.clipboard.writeText(text);
}

// Helpers

/**
 * Desenha retângulo com bordas arredondadas
 */
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

/**
 * Quebra texto para o canvas (Tweet Model)
 */
function wrapTextForCanvas(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function createCardCanvas(card: CarouselCard, template: 'standard' | 'tweet' = 'standard'): HTMLCanvasElement {
  // Para uso síncrono (ex: exportação manual), tentar usar imagem do cache ou fallback
  if (template === 'tweet') {
    return createTweetCardCanvasSync(card, profileImageCache?.img || null, null);
  }
  return createStandardCardCanvas(card);
}

function createCardCanvasInternal(card: CarouselCard, template: 'standard' | 'tweet', profileImg: HTMLImageElement | null): HTMLCanvasElement {
  if (template === 'tweet') {
    // Para template tweet, renderizar sem imagens (async é feito em generateCardBase64Internal)
    return createTweetCardCanvasSync(card, profileImg, null);
  }
  return createStandardCardCanvas(card);
}

function createStandardCardCanvas(card: CarouselCard): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) throw new Error('Canvas context not available');

  // Instagram Carousel: 1080x1080 (quadrado 1:1)
  canvas.width = 1080;
  canvas.height = 1080;

  ctx.fillStyle = card.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = card.colors.text;
  ctx.font = 'bold 56px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  wrapText(ctx, card.headline || 'Headline', canvas.width / 2, 200, 950, 70);

  ctx.font = '24px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  wrapText(ctx, card.text, canvas.width / 2, 500, 850, 40);

  const ctaY = 830;
  const ctaWidth = 400;
  const ctaHeight = 100;
  const ctaX = (canvas.width - ctaWidth) / 2;
  const ctaRadius = 50;

  ctx.fillStyle = card.colors.accent || '#405DE6';
  roundRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, ctaRadius);
  ctx.fill();

  ctx.fillStyle = isLightBg(card.colors.accent || '#405DE6') ? '#0C1014' : '#FFFFFF';
  ctx.font = 'bold 40px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.cta || 'Clique aqui', canvas.width / 2, ctaY + ctaHeight / 2);

  return canvas;
}

// Validar tamanho de imageUrl (data URL muito grande = browser congela)
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return true;
  if (url.startsWith('data:')) {
    // Data URL: limitar tamanho a 5MB (~6.6M chars)
    if (url.length > 6_600_000) {
      console.warn(`⚠️ Imagem muito grande (${(url.length / 1_000_000).toFixed(1)}MB). Max 5MB.`);
      return false;
    }
  }
  return true;
}

// Cache com TTL para imagem de perfil (15 minutos)
interface CachedImage {
  img: HTMLImageElement;
  timestamp: number;
}
let profileImageCache: CachedImage | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos

// Carrega imagem de perfil com cache + TTL
async function loadProfileImage(): Promise<HTMLImageElement | null> {
  const now = Date.now();

  // Se tem cache válido, retornar
  if (profileImageCache && (now - profileImageCache.timestamp) < CACHE_TTL_MS) {
    console.log(`✅ Usando cache de perfil (${((now - profileImageCache.timestamp) / 1000).toFixed(0)}s atrás)`);
    return profileImageCache.img;
  }

  // Cache expirou ou não existe, recarregar
  if (profileImageCache && (now - profileImageCache.timestamp) >= CACHE_TTL_MS) {
    console.log('🔄 Cache de perfil expirou, recarregando...');
    profileImageCache = null;
  }

  const profileImageUrl = 'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/teste01/@viniwaknin-2.jpg';

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      profileImageCache = { img, timestamp: now };
      console.log('✅ Imagem de perfil carregada e cacheada (15min TTL)');
      resolve(img);
    };
    img.onerror = () => {
      console.warn('⚠️ Falha ao carregar imagem de perfil');
      resolve(null);
    };
    img.src = profileImageUrl;
  });
}

// Renderiza foto de perfil no canvas
function drawProfileImage(ctx: CanvasRenderingContext2D, profileX: number, profileY: number, profileImageSize: number, img: HTMLImageElement | null) {
  if (!img) {
    // Fallback: círculo cinza se não tiver imagem
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  try {
    // Desenhar imagem com clipping circular
    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, profileX, profileY, profileImageSize, profileImageSize);
    ctx.restore();
  } catch (e) {
    console.error('Erro ao desenhar imagem de perfil:', e);
    // Fallback: círculo cinza
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.arc(profileX + profileImageSize / 2, profileY + profileImageSize / 2, profileImageSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

async function createTweetCardCanvasSyncWithImages(card: CarouselCard, profileImg: HTMLImageElement | null = null): Promise<HTMLCanvasElement> {
  // Pré-carregar cardImage se existir
  let cardImg: HTMLImageElement | null = null;
  if (card.imageUrl) {
    // 🟡 Validar tamanho antes de tentar carregar
    if (!isValidImageUrl(card.imageUrl)) {
      throw new Error(`Imagem muito grande. Máximo: 5MB`);
    }

    // 🎯 Timeout de 8s para carregar imagem (evitar pendurar indefinidamente)
    cardImg = await Promise.race([
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = card.imageUrl!;
      }),
      new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('⏱️ Timeout ao carregar imagem (8s). Continuando sem imagem.');
          resolve(null);
        }, 8000);
      })
    ]);
  }

  return createTweetCardCanvasSync(card, profileImg, cardImg);
}

function createTweetCardCanvasSync(card: CarouselCard, profileImg: HTMLImageElement | null = null, cardImg: HTMLImageElement | null = null): HTMLCanvasElement {
  // 🎯 Usar lógica compartilhada de rendering
  // Garante que preview (browser) = imagem publicada (Instagram)

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) throw new Error('Canvas context not available');

  // Usar imagem cached se não foi passada
  const cachedImg = profileImageCache?.img || null;
  const finalProfileImg = profileImg || cachedImg;

  // Renderizar usando lógica compartilhada
  renderTweetCardOnCanvas(ctx, canvas, card, {
    profileImg: finalProfileImg,
    cardImg
  });

  return canvas;
}

/**
 * Gera base64 de um card no browser (verdade visual garantida)
 */
export async function generateCardBase64(card: CarouselCard, template: 'standard' | 'tweet' = 'standard'): Promise<string> {
  // Para tweet template, pré-carregar imagem de perfil
  if (template === 'tweet') {
    const profileImg = await loadProfileImage();
    console.log(`🎨 generateCardBase64: card="${card.headline || 'sem headline'}", template="${template}", profile_loaded=${!!profileImg}`);
    return generateCardBase64Internal(card, template, profileImg);
  }

  return generateCardBase64Internal(card, template, null);
}

async function generateCardBase64Internal(card: CarouselCard, template: 'standard' | 'tweet', profileImg: HTMLImageElement | null): Promise<string> {
  try {
    console.log(`   colors: bg="${card.colors.bg}", text="${card.colors.text}"`);

    let canvas: HTMLCanvasElement;
    if (template === 'tweet') {
      canvas = await createTweetCardCanvasSyncWithImages(card, profileImg);
    } else {
      canvas = createCardCanvasInternal(card, template, profileImg);
    }

    // 🎯 Usar toBlob() para evitar construir string base64 gigante na memória
    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Falha ao converter canvas para blob'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            console.log(`✅ Base64 gerado com sucesso (${base64.length} chars, comprimido)`);
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error('Erro ao ler blob'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.92); // JPEG 92% para reduzir tamanho
    });
  } catch (error) {
    console.error(`❌ Erro em generateCardBase64:`, error);
    throw error;
  }
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
    } else {
      line = testLine;
    }
  });

  if (line) ctx.fillText(line.trim(), x, y);
}
