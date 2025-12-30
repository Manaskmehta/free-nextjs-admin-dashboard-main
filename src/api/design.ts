import { httpClient } from './httpClient';

export interface Category {
  id: string;
  name: string;
  // Add other category fields if known
}

export interface Design {
  id: string;
  designNo: string;
  categoryId: string;
  category?: Category; // Included in response as per description
  s3Key: string;
  gwt: number;
  nwt: number;
  owt: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateDesignPayload {
  designNo: string;
  categoryId: string;
  s3Key: string;
  gwt: number;
  nwt: number;
  owt: number;
}

export interface UpdateDesignPayload {
  designNo?: string;
  categoryId?: string;
  s3Key?: string;
  gwt?: number;
  nwt?: number;
  owt?: number;
}

export const designApi = {
  // 1. Get All Designs
  getAll: async (): Promise<Design[]> => {
    return httpClient<Design[]>('/api/designs');
  },

  // 2. Get Single Design
  getById: async (id: string): Promise<Design> => {
    return httpClient<Design>(`/api/designs/${id}`);
  },

  // 3. Create Design
  create: async (payload: CreateDesignPayload): Promise<Design> => {
    return httpClient<Design>('/api/designs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 4. Update Design
  update: async (id: string, payload: UpdateDesignPayload): Promise<Design> => {
    return httpClient<Design>(`/api/designs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // 5. Delete Design (Soft Delete)
  delete: async (id: string): Promise<Design> => {
    return httpClient<Design>(`/api/designs/${id}`, {
      method: 'DELETE',
    });
  },
};
