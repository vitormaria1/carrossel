import { NextRequest, NextResponse } from 'next/server';
import { sendImageToN8nWebhook } from '@/lib/n8n-webhook';

// 🟡 CORS helper - adicionar headers de segurança
function addCORSHeaders(response: NextResponse): NextResponse {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);

  const origin = process.env.NODE_ENV === 'development' ? '*' : 'http://localhost:3000';

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCORSHeaders(response);
}

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v20.0';

let BUSINESS_ACCOUNT_ID: string | null = null;

interface CarouselSlide {
  id: string;
  text: string;
  headline: string;
  cta?: string;
  colors?: { bg: string; text: string };
  caption?: string;
}

interface PublishRequest {
  slides: CarouselSlide[];
  caption: string;
  carouselTemplate?: 'standard' | 'tweet';
  base64Images?: string[];
}

interface EnrichedSlide extends CarouselSlide {
  colors?: { bg: string; text: string; accent?: string };
  carouselType?: string;
  cardIndex?: number;
  totalCards?: number;
}

async function uploadImageToInstagram(imageUrl: string, businessAccountId: string): Promise<string> {
  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API}/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          media_type: 'IMAGE',
          is_carousel_item: true,
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API error:', error);
      throw new Error(error.error?.message || 'Falha ao fazer upload');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function createCarouselContainer(childrenIds: string[], businessAccountId: string): Promise<string> {
  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API}/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: childrenIds.join(','),
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Carousel creation error:', error);
      throw new Error(error.error?.message || 'Falha ao criar carrossel');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating carousel:', error);
    throw error;
  }
}

async function publishMedia(creationId: string, caption: string, businessAccountId: string): Promise<string> {
  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API}/${businessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          caption: caption,
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Publish error:', error);
      throw new Error(error.error?.message || 'Falha ao publicar');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error publishing:', error);
    throw error;
  }
}

async function generateImageUrl(slide: CarouselSlide, index: number): Promise<string> {
  const bgColor = (slide.colors?.bg || '#FFFFFF').replace('#', '%23');
  const textColor = (slide.colors?.text || '#0C1014').replace('#', '%23');
  const headline = encodeURIComponent(slide.headline || 'Carrossel');
  const text = encodeURIComponent(slide.text || 'Conteúdo');

  // Use uma imagem pública e real que o Instagram aceita
  // Por enquanto, usar Unsplash como fallback confiável
  return `https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&h=1350&fit=crop&crop=entropy&cs=tinysrgb&q=80`;
}

async function getBusinessAccountId(): Promise<string> {
  if (BUSINESS_ACCOUNT_ID) return BUSINESS_ACCOUNT_ID;

  try {
    console.log('🔍 Buscando Business Account ID...');

    const meResponse = await fetch(
      `${INSTAGRAM_GRAPH_API}/me?fields=id,username&access_token=${ACCESS_TOKEN}`
    );

    if (!meResponse.ok) {
      const error = await meResponse.json();
      console.error('Error getting user:', error);
      throw new Error(error.error?.message || 'Falha ao buscar usuário');
    }

    const meData = await meResponse.json();
    const userId = meData.id;

    console.log(`Instagram User ID encontrado: ${userId}`);

    BUSINESS_ACCOUNT_ID = userId;
    console.log(`✅ Business Account ID: ${BUSINESS_ACCOUNT_ID}`);
    return userId;
  } catch (error) {
    console.error('Failed to get business account:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'INSTAGRAM_ACCESS_TOKEN não configurado' },
        { status: 500 }
      );
    }

    const body: PublishRequest = await request.json();

    if (!body.slides || body.slides.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum slide fornecido' },
        { status: 400 }
      );
    }

    if (body.slides.length > 10) {
      return NextResponse.json(
        { error: 'Máximo de 10 slides por carrossel' },
        { status: 400 }
      );
    }

    if (!body.base64Images || body.base64Images.length !== body.slides.length) {
      return NextResponse.json(
        { error: 'Base64 images não fornecidos ou quantidade incorreta' },
        { status: 400 }
      );
    }

    // Extrair template (padrão: 'standard')
    const template = body.carouselTemplate || 'standard';
    console.log(`📐 Template: ${template}`);
    console.log(`✅ Recebido: ${body.base64Images.length} base64s do browser`);

    // Obter Business Account ID dinâmicamente
    const businessAccountId = await getBusinessAccountId();

    console.log(`📱 Publicando carrossel com ${body.slides.length} slides em formato ${template}...`);
    console.log(`📱 Business Account ID: ${businessAccountId}`);

    const childrenIds: string[] = [];
    const publicImageUrls: string[] = [];

    console.log('🖼️ Enviando base64s para webhook n8n...');

    for (let i = 0; i < body.slides.length; i++) {
      const slide = body.slides[i] as EnrichedSlide;
      const base64 = body.base64Images[i];

      console.log(`Processando slide ${i + 1}/${body.slides.length}: "${slide.headline?.substring(0, 50) || 'Sem headline'}..."`);

      try {
        console.log(`🌐 Slide ${i + 1}: enviando base64 para webhook n8n (${base64.length} chars)...`);

        // Send base64 to n8n webhook and get public URL
        const publicImageUrl = await sendImageToN8nWebhook(
          base64,
          i,
          slide.headline || 'Card'
        );

        publicImageUrls.push(publicImageUrl);
        console.log(`✅ Slide ${i + 1} processado pelo n8n: ${publicImageUrl}`);

        // Upload to Instagram using the public URL from Supabase
        const containerId = await uploadImageToInstagram(publicImageUrl, businessAccountId);
        childrenIds.push(containerId);
        console.log(`✅ Slide ${i + 1} feito upload no Instagram: ${containerId}`);
      } catch (error) {
        console.error(`❌ Erro no slide ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(`✅ Todos os ${childrenIds.length} slides feitos upload`);
    console.log('🎬 Criando container do carrossel...');

    const carouselId = await createCarouselContainer(childrenIds, businessAccountId);
    console.log(`✅ Container criado: ${carouselId}`);

    // Aguardar o Instagram processar o container
    console.log('⏳ Aguardando processamento do Instagram...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📤 Publicando carrossel...');
    const publishedId = await publishMedia(carouselId, body.caption || '', businessAccountId);
    console.log(`✅ Publicado! ID: ${publishedId}`);

    const response = NextResponse.json({
      success: true,
      postId: publishedId,
      url: `https://instagram.com/p/${publishedId}`,
      message: 'Carrossel publicado com sucesso!'
    });

    return addCORSHeaders(response);

  } catch (error) {
    console.error('❌ Publish error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao publicar';

    // 🟡 NÃO expor stack traces em produção
    const details = process.env.NODE_ENV === 'development' ? error?.toString() : undefined;

    const response = NextResponse.json(
      {
        error: errorMessage,
        details,
      },
      { status: 500 }
    );

    return addCORSHeaders(response);
  }
}
