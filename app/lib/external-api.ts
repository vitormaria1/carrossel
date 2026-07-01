import { NextRequest } from 'next/server';

const EXTERNAL_API_SECRET = process.env.N8N_TRIGGER_SECRET || process.env.EXTERNAL_TRIGGER_SECRET;

export function assertExternalApiAuthorized(request: NextRequest) {
  if (!EXTERNAL_API_SECRET) {
    throw new Error(
      'N8N_TRIGGER_SECRET não configurado. Defina esse secret para habilitar gatilhos externos.'
    );
  }

  const authorization = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');
  const bearerToken = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

  if (bearerToken !== EXTERNAL_API_SECRET && apiKey !== EXTERNAL_API_SECRET) {
    const error = new Error('Unauthorized');
    error.name = 'UnauthorizedError';
    throw error;
  }
}
