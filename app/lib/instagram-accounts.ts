export interface InstagramAccountConfig {
  id: string;
  label: string;
  accessToken: string;
  businessAccountId?: string;
}

export interface InstagramAccountSummary {
  id: string;
  label: string;
  isDefault: boolean;
}

const DEFAULT_ACCOUNT_ID = 'default';

function normalizeAccessToken(token: string): string {
  return token
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^Bearer\s+/i, '')
    .replace(/\s+/g, '');
}

export function getInstagramAccounts(): InstagramAccountConfig[] {
  const accessToken = normalizeAccessToken(process.env.INSTAGRAM_ACCESS_TOKEN || '');
  if (!accessToken) return [];

  return [
    {
      id: DEFAULT_ACCOUNT_ID,
      label: process.env.INSTAGRAM_ACCOUNT_LABEL?.trim() || 'Conta principal',
      accessToken,
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim() || undefined,
    },
  ];
}

export function getInstagramAccountSummaries(): InstagramAccountSummary[] {
  const accounts = getInstagramAccounts();
  return accounts.map((account, index) => ({
    id: account.id,
    label: account.label,
    isDefault: index === 0,
  }));
}

export function resolveInstagramAccount(accountId?: string): InstagramAccountConfig {
  const accounts = getInstagramAccounts();

  if (!accounts.length) {
    throw new Error(
      'Nenhuma conta do Instagram configurada. Defina INSTAGRAM_ACCESS_TOKEN.'
    );
  }

  if (!accountId) {
    return accounts[0];
  }

  const account = accounts.find((entry) => entry.id === accountId);
  if (!account) {
    throw new Error(`Conta do Instagram não encontrada: ${accountId}`);
  }

  return account;
}

export async function resolveBusinessAccountId(account: InstagramAccountConfig): Promise<string> {
  if (account.businessAccountId) {
    return account.businessAccountId;
  }

  const legacyBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  if (legacyBusinessAccountId) {
    return legacyBusinessAccountId;
  }

  throw new Error(
    'INSTAGRAM_BUSINESS_ACCOUNT_ID não configurado. ' +
      'Adicione o ID da conta profissional do Instagram.'
  );
}
