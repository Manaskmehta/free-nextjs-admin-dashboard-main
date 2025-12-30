import { httpClient } from './httpClient';

// Job Workers share the same structure as Salesmen/Vendors
export interface JobWorker {
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

export interface CreateJobWorkerPayload {
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

export interface UpdateJobWorkerPayload extends Partial<CreateJobWorkerPayload> {}

export const jobWorkerApi = {
  getAll: async (): Promise<JobWorker[]> => {
    return httpClient<JobWorker[]>('/api/job-workers');
  },

  getById: async (id: string): Promise<JobWorker> => {
    return httpClient<JobWorker>(`/api/job-workers/${id}`);
  },

  create: async (payload: CreateJobWorkerPayload): Promise<JobWorker> => {
    return httpClient<JobWorker>('/api/job-workers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateJobWorkerPayload): Promise<JobWorker> => {
    return httpClient<JobWorker>(`/api/job-workers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/job-workers/${id}`, {
      method: 'DELETE',
    });
  },
};
