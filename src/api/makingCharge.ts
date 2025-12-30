import { httpClient } from './httpClient';

export type ChargeMode = 'PER_GRAM' | 'PERCENT' | 'PER_PIECE';

export interface MakingCharge {
  id: string;
  chargeMode: ChargeMode;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMakingChargePayload {
  chargeMode: ChargeMode;
  value: number;
}

export interface UpdateMakingChargePayload extends Partial<CreateMakingChargePayload> {}

export const makingChargeApi = {
  getAll: async (): Promise<MakingCharge[]> => {
    return httpClient<MakingCharge[]>('/api/making-charges');
  },

  getById: async (id: string): Promise<MakingCharge> => {
    return httpClient<MakingCharge>(`/api/making-charges/${id}`);
  },

  create: async (payload: CreateMakingChargePayload): Promise<MakingCharge> => {
    return httpClient<MakingCharge>('/api/making-charges', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateMakingChargePayload): Promise<MakingCharge> => {
    return httpClient<MakingCharge>(`/api/making-charges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/making-charges/${id}`, {
      method: 'DELETE',
    });
  },
};
