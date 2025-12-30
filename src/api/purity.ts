import { httpClient } from './httpClient';

export interface Purity {
  id: string;
  purityLabel: string;
  purityPercent: number;
}

export interface CreatePurityPayload {
  purityLabel: string;
  purityPercent: number;
}

export interface UpdatePurityPayload {
  purityLabel: string;
  purityPercent: number;
}

export const purityApi = {
  getAll: async (): Promise<Purity[]> => {
    return httpClient<Purity[]>('/api/purities');
  },

  getById: async (id: string): Promise<Purity> => {
    return httpClient<Purity>(`/api/purities/${id}`);
  },

  create: async (payload: CreatePurityPayload): Promise<Purity> => {
    return httpClient<Purity>('/api/purities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdatePurityPayload): Promise<Purity> => {
    return httpClient<Purity>(`/api/purities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/purities/${id}`, {
      method: 'DELETE',
    });
  },
};
