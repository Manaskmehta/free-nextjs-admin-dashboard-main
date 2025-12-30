import { httpClient } from './httpClient';

export interface Customer {
  id: string;
  customerType: 'B2B' | 'B2C';
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  gstNo?: string;
  panNo?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate?: string;
  anniversary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  customerType: 'B2B' | 'B2C';
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  gstNo?: string;
  panNo?: string;
  gender?: string;
  birthDate?: string;
  anniversary?: string;
}

export interface UpdateCustomerPayload extends Partial<CreateCustomerPayload> {}

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    return httpClient<Customer[]>('/api/customers');
  },

  getById: async (id: string): Promise<Customer> => {
    return httpClient<Customer>(`/api/customers/${id}`);
  },

  create: async (payload: CreateCustomerPayload): Promise<Customer> => {
    return httpClient<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateCustomerPayload): Promise<Customer> => {
    return httpClient<Customer>(`/api/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  },
};
