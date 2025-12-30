import { httpClient } from './httpClient';

export interface HSN {
  id: string;
  hsnCode: string;
  gstPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHSNPayload {
  hsnCode: string;
  gstPercent: number;
}

export interface UpdateHSNPayload extends Partial<CreateHSNPayload> {}

export const hsnApi = {
  getAll: async (): Promise<HSN[]> => {
    return httpClient<HSN[]>('/api/hsn-master');
  },

  getById: async (id: string): Promise<HSN> => {
    return httpClient<HSN>(`/api/hsn-master/${id}`);
  },

  create: async (payload: CreateHSNPayload): Promise<HSN> => {
    return httpClient<HSN>('/api/hsn-master', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateHSNPayload): Promise<HSN> => {
    return httpClient<HSN>(`/api/hsn-master/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/hsn-master/${id}`, {
      method: 'DELETE',
    });
  },
};
