import {
  resolveBusinessAccountId,
  resolveInstagramAccount,
} from './instagram-accounts';

const GRAPH_API = 'https://graph.facebook.com/v20.0';

function normalizeAccessToken(token: string): string {
  return token.trim().replace(/^['"]|['"]$/g, '');
}

export interface PublishSlide {
  id: string;
  text: string;
  headline?: string;
  cta?: string;
  colors?: { bg: string; text: string; accent?: string };
  caption?: string;
}

async function readErrorResponse(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();

  if (!body) return '';

  if (contentType.includes('application/json')) {
    try {
      const data = JSON.parse(body);
      if (typeof data === 'string') return data;
      if (data?.error?.message) return data.error.message;
      if (data?.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      return JSON.stringify(data);
    } catch {
      return body;
    }
  }

  return body;
}

async function uploadImageToInstagram(
  imageUrl: string,
  businessAccountId: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(`${GRAPH_API}/${businessAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      image_url: imageUrl,
      media_type: 'IMAGE',
      is_carousel_item: 'true',
      access_token: normalizeAccessToken(accessToken),
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response) || 'Falha ao fazer upload');
  }

  const data = await response.json();
  return data.id;
}

async function createSingleImageContainer(
  imageUrl: string,
  businessAccountId: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(`${GRAPH_API}/${businessAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      image_url: imageUrl,
      media_type: 'IMAGE',
      access_token: normalizeAccessToken(accessToken),
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response) || 'Falha ao criar post simples');
  }

  const data = await response.json();
  return data.id;
}

async function createCarouselContainer(
  childrenIds: string[],
  businessAccountId: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(`${GRAPH_API}/${businessAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      media_type: 'CAROUSEL',
      children: childrenIds.join(','),
      access_token: normalizeAccessToken(accessToken),
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response) || 'Falha ao criar carrossel');
  }

  const data = await response.json();
  return data.id;
}

async function publishMedia(
  creationId: string,
  caption: string,
  businessAccountId: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(`${GRAPH_API}/${businessAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      creation_id: creationId,
      caption,
      access_token: normalizeAccessToken(accessToken),
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response) || 'Falha ao publicar');
  }

  const data = await response.json();
  return data.id;
}

async function getMediaPermalink(mediaId: string, accessToken: string): Promise<string | null> {
  const response = await fetch(
    `${GRAPH_API}/${mediaId}?fields=permalink&access_token=${normalizeAccessToken(accessToken)}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return typeof data.permalink === 'string' ? data.permalink : null;
}

export async function publishCarouselWithUrls(params: {
  slides: PublishSlide[];
  caption: string;
  imageUrls: string[];
  carouselTemplate?: 'standard' | 'tweet' | 'tweetExpanded' | 'vanderMaria';
  instagramAccountId?: string;
}) {
  const { slides, caption, imageUrls, instagramAccountId } = params;
  const account = resolveInstagramAccount(instagramAccountId);

  if (!slides.length || slides.length !== imageUrls.length) {
    throw new Error('Quantidade de slides e imagens não confere');
  }

  const businessAccountId = await resolveBusinessAccountId(account);

  if (imageUrls.length === 1) {
    const containerId = await createSingleImageContainer(
      imageUrls[0],
      businessAccountId,
      account.accessToken
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const publishedId = await publishMedia(containerId, caption, businessAccountId, account.accessToken);
    const permalink = await getMediaPermalink(publishedId, account.accessToken);

    return {
      postId: publishedId,
      url: permalink || `https://instagram.com/p/${publishedId}`,
    };
  }

  const childrenIds: string[] = [];
  for (const imageUrl of imageUrls) {
    const containerId = await uploadImageToInstagram(imageUrl, businessAccountId, account.accessToken);
    childrenIds.push(containerId);
  }

  const carouselId = await createCarouselContainer(childrenIds, businessAccountId, account.accessToken);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const publishedId = await publishMedia(carouselId, caption, businessAccountId, account.accessToken);
  const permalink = await getMediaPermalink(publishedId, account.accessToken);

  return {
    postId: publishedId,
    url: permalink || `https://instagram.com/p/${publishedId}`,
  };
}
