import { httpClient } from './httpClient';

// Vendors share the same structure as Salesmen
export interface Vendor {
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

export interface CreateVendorPayload {
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

export interface UpdateVendorPayload extends Partial<CreateVendorPayload> {}

export const vendorApi = {
  getAll: async (): Promise<Vendor[]> => {
    return httpClient<Vendor[]>('/api/vendors');
  },

  getById: async (id: string): Promise<Vendor> => {
    return httpClient<Vendor>(`/api/vendors/${id}`);
  },

  create: async (payload: CreateVendorPayload): Promise<Vendor> => {
    return httpClient<Vendor>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateVendorPayload): Promise<Vendor> => {
    return httpClient<Vendor>(`/api/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/vendors/${id}`, {
      method: 'DELETE',
    });
  },
};
