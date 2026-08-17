import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'kitsphere_auth_token';
const USER_KEY = 'kitsphere_user';

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');

    if (parts.length < 2) {
      return null;
    }

    const base64UrlPayload = parts[1];
    const normalizedPayload = base64UrlPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padding = normalizedPayload.length % 4 === 0 ? '' : '='.repeat(4 - (normalizedPayload.length % 4));
    const decoded = typeof atob === 'function'
      ? atob(normalizedPayload + padding)
      : null;

    if (!decoded) {
      return null;
    }

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function hasValidAuthToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    const payload = decodeJwtPayload(token);

    if (!payload || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) {
      return false;
    }

    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

export async function clearAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function logout(): Promise<void> {
  await clearAuth();
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function getCurrentUser(): Promise<any | null> {
  const user = await SecureStore.getItemAsync(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}