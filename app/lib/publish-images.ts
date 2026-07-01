import { sendImageToN8nWebhook } from './n8n-webhook';

export async function uploadBase64Images(
  base64Images: string[],
  headlines: Array<string | undefined>
) {
  const imageUrls: string[] = [];

  for (let index = 0; index < base64Images.length; index += 1) {
    const url = await sendImageToN8nWebhook(
      base64Images[index],
      index,
      headlines[index] || `Card ${index + 1}`
    );
    imageUrls.push(url);
  }

  return imageUrls;
}
