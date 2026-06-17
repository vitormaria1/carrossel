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
const businessAccountCache = new Map<string, string>();

function parseAccountsJson(raw: string | undefined): InstagramAccountConfig[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => ({
        id: String(entry?.id || '').trim(),
        label: String(entry?.label || '').trim(),
        accessToken: String(entry?.accessToken || '').trim(),
        businessAccountId: String(entry?.businessAccountId || '').trim() || undefined,
      }))
      .filter((entry) => entry.id && entry.label && entry.accessToken);
  } catch {
    return [];
  }
}

export function getInstagramAccounts(): InstagramAccountConfig[] {
  const configuredAccounts = parseAccountsJson(process.env.INSTAGRAM_ACCOUNTS_JSON);
  if (configuredAccounts.length > 0) {
    return configuredAccounts;
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
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
      'Nenhuma conta do Instagram configurada. Defina INSTAGRAM_ACCOUNTS_JSON ou INSTAGRAM_ACCESS_TOKEN.'
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

  const cached = businessAccountCache.get(account.id);
  if (cached) {
    return cached;
  }

  const response = await fetch(
    `https://graph.instagram.com/v20.0/me?fields=id,username&access_token=${account.accessToken}`
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Falha ao buscar Business Account ID');
  }

  const data = await response.json();
  if (!data?.id) {
    throw new Error('Business Account ID não retornado pela API do Instagram');
  }

  const businessAccountId = String(data.id);
  businessAccountCache.set(account.id, businessAccountId);
  return businessAccountId;
}
