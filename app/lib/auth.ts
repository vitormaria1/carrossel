export const AUTH_COOKIE_NAME = 'carrossel_session';
export const AUTH_USERNAME = 'admin123';
export const AUTH_PASSWORD = '140301';

export function isValidCredentials(username: string, password: string) {
  return username === AUTH_USERNAME && password === AUTH_PASSWORD;
}

export function isAuthenticatedSession(value: string | undefined | null) {
  return value === 'authenticated';
}
