import { httpClient } from './httpClient';

export interface Salesman {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aadhaarNo?: string;
  panNo?: string;
  accountNo?: string;
  ifsc?: string;
  bankName?: string;
  bankAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesmanPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  aadhaarNo?: string;
  panNo?: string;
  accountNo?: string;
  ifsc?: string;
  bankName?: string;
  bankAddress?: string;
}

export interface UpdateSalesmanPayload extends Partial<CreateSalesmanPayload> {}

export const salesmanApi = {
  getAll: async (): Promise<Salesman[]> => {
    return httpClient<Salesman[]>('/api/salesmen');
  },

  getById: async (id: string): Promise<Salesman> => {
    return httpClient<Salesman>(`/api/salesmen/${id}`);
  },

  create: async (payload: CreateSalesmanPayload): Promise<Salesman> => {
    return httpClient<Salesman>('/api/salesmen', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateSalesmanPayload): Promise<Salesman> => {
    return httpClient<Salesman>(`/api/salesmen/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/salesmen/${id}`, {
      method: 'DELETE',
    });
  },
};
