export interface N8nWebhookResponse {
  url: string;
}

// 🔴 RETRY LOGIC COM EXPONENTIAL BACKOFF
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;

      if (isLastAttempt) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      console.log(
        `⏳ Tentativa ${attempt + 1}/${maxRetries} falhou. Retry em ${delayMs}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Todas as tentativas falharam');
}

export async function sendImageToN8nWebhook(
  base64: string,
  cardIndex: number,
  cardHeadline: string
): Promise<string> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL não configurada');
  }

  // 🔴 USAR RETRY LOGIC
  return retryWithBackoff(async () => {
    console.log(`🌐 Enviando card ${cardIndex + 1} para webhook n8n...`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64,
        cardIndex,
        cardHeadline,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Webhook error (${response.status}):`, error);
      throw new Error(`Webhook retornou ${response.status}: ${error}`);
    }

    const responseText = await response.text();

    if (!responseText) {
      throw new Error('Webhook retornou resposta vazia');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(`❌ Invalid JSON from webhook:`, responseText);
      throw new Error(`Webhook retornou JSON inválido: ${responseText}`);
    }

    if (!data.url) {
      throw new Error(
        `Webhook não retornou URL. Response: ${JSON.stringify(data)}`
      );
    }

    console.log(`✅ Card ${cardIndex + 1} processado: ${data.url}`);
    return data.url;
  }, 3, 1000); // Max 3 tentativas, delay inicial 1s
}
