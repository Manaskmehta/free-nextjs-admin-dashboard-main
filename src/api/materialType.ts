import { httpClient } from './httpClient';

export interface MaterialType {
  id: string;
  typeName: string;
}

export interface CreateMaterialTypePayload {
  typeName: string;
}

export interface UpdateMaterialTypePayload {
  typeName: string;
}

export const materialTypeApi = {
  getAll: async (): Promise<MaterialType[]> => {
    return httpClient<MaterialType[]>('/api/material-types');
  },

  getById: async (id: string): Promise<MaterialType> => {
    return httpClient<MaterialType>(`/api/material-types/${id}`);
  },

  create: async (payload: CreateMaterialTypePayload): Promise<MaterialType> => {
    return httpClient<MaterialType>('/api/material-types', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateMaterialTypePayload): Promise<MaterialType> => {
    return httpClient<MaterialType>(`/api/material-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/material-types/${id}`, {
      method: 'DELETE',
    });
  },
};
