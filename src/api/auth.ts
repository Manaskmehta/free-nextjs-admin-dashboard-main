import { httpClient } from './httpClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return httpClient<LoginResponse>('/api/auth/tenant/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
