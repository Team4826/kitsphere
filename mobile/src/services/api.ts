import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  const extra =
    (Constants.expoConfig && (Constants.expoConfig as any).extra) ||
    (Constants.manifest && (Constants.manifest as any).extra) ||
    {};

  const configuredUrl = extra.API_BASE_URL || '';
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  const hostUri =
    (Constants.expoConfig && (Constants.expoConfig as any).hostUri) ||
    (Constants.manifest && (Constants.manifest as any).debuggerHost) ||
    '';

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost') {
      return `http://${host}:5000/api`;
    }
  }

  return 'http://10.0.7.12:5000/api';
}

const API_BASE_URL = getApiBaseUrl();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong.');
  }

  return data;
}

export { API_BASE_URL };
