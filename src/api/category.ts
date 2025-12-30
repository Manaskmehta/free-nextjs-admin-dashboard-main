import { httpClient } from './httpClient';

export interface Category {
  id: string;
  name: string;
  code: string;
  parentId?: string | null;
  isSubcategory: boolean;
  description?: string;
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'OTHER';
  image?: string;
  hsnId?: string;
  parent?: Category;
  children?: Category[];
  hsn?: any; // Will update type once HSN interface is defined
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  code: string;
  parentId?: string;
  isSubcategory: boolean;
  description?: string;
  metalType: string;
  image?: string;
  hsnId?: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return httpClient<Category[]>('/api/categories');
  },
  getAllMain: async (): Promise<Category[]> => {
    return httpClient<Category[]>('/api/categories?isSubcategory=false');
  },
  getById: async (id: string): Promise<Category> => {
    return httpClient<Category>(`/api/categories/${id}`);
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    return httpClient<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
    return httpClient<Category>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
