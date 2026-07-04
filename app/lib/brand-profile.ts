export interface BrandProfile {
  displayName: string;
  handle: string;
  profileImageUrl?: string;
  markImageUrl?: string;
}

export const TWEET_PROFILE_IMAGE_URL =
  'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/teste01/@viniwaknin-2.jpg';

function normalizeHandle(handle: string) {
  if (!handle) return '';
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export function getTweetBrandProfile(): BrandProfile {
  return {
    displayName: process.env.NEXT_PUBLIC_TWEET_PROFILE_NAME?.trim() || 'Vitor Maria',
    handle: normalizeHandle(process.env.NEXT_PUBLIC_TWEET_PROFILE_HANDLE?.trim() || '@vitor_smaria'),
    profileImageUrl: TWEET_PROFILE_IMAGE_URL,
  };
}

export function getVanderBrandProfile(): BrandProfile {
  return {
    displayName: process.env.NEXT_PUBLIC_VANDER_PROFILE_NAME?.trim() || 'Vander Maria',
    handle: normalizeHandle(
      process.env.NEXT_PUBLIC_VANDER_PROFILE_HANDLE?.trim() || '@vandermarias'
    ),
    profileImageUrl:
      process.env.NEXT_PUBLIC_VANDER_PROFILE_IMAGE_URL?.trim() ||
      process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL?.trim() ||
      undefined,
    markImageUrl: process.env.NEXT_PUBLIC_VANDER_MARK_IMAGE_URL?.trim() || '/vm-mark.png',
  };
}
