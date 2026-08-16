import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'kitsphere_auth_token';
const USER_KEY = 'kitsphere_user';

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
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