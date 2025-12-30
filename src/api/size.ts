import { httpClient } from './httpClient';

export interface Size {
  id: string;
  sizeLabel: string;
}

export interface CreateSizePayload {
  sizeLabel: string;
}

export interface UpdateSizePayload {
  sizeLabel: string;
}

export const sizeApi = {
  getAll: async (): Promise<Size[]> => {
    return httpClient<Size[]>('/api/sizes');
  },

  getById: async (id: string): Promise<Size> => {
    return httpClient<Size>(`/api/sizes/${id}`);
  },

  create: async (payload: CreateSizePayload): Promise<Size> => {
    return httpClient<Size>('/api/sizes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateSizePayload): Promise<Size> => {
    return httpClient<Size>(`/api/sizes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/sizes/${id}`, {
      method: 'DELETE',
    });
  },
};
