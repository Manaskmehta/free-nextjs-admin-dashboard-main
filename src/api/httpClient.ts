import { getAccessToken } from '@/utils/auth';

const BASE_URL =  'https://api.macanx.in' ;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const httpClient = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};
