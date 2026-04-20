const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v20.0';
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;

export async function getInstagramBusinessAccount() {
  if (!ACCESS_TOKEN) throw new Error('Token não configurado');

  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API}/me?fields=id,username,name&access_token=${ACCESS_TOKEN}`
    );

    if (!response.ok) {
      throw new Error('Falha ao buscar conta do Instagram');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Instagram account:', error);
    throw error;
  }
}

export async function uploadImage(imageUrl: string): Promise<string> {
  if (!ACCESS_TOKEN) throw new Error('Token não configurado');

  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!businessAccountId) throw new Error('Business Account ID não configurado');

  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API}/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          is_carousel_item: true,
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Falha ao fazer upload');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function createCarousel(childrenIds: string[]): Promise<string> {
  if (!ACCESS_TOKEN) throw new Error('Token não configurado');

  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!businessAccountId) throw new Error('Business Account ID não configurado');

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
      throw new Error(error.error?.message || 'Falha ao criar carrossel');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating carousel:', error);
    throw error;
  }
}

export async function publishCarousel(creationId: string, caption: string): Promise<string> {
  if (!ACCESS_TOKEN) throw new Error('Token não configurado');

  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!businessAccountId) throw new Error('Business Account ID não configurado');

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
      throw new Error(error.error?.message || 'Falha ao publicar');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error publishing carousel:', error);
    throw error;
  }
}
