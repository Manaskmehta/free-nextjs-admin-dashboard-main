import { httpClient } from './httpClient';

export interface SaleItem {
  id: string;
  saleId: string;
  stockItemId: string;
  barcodeId: string;
  categoryId: string;
  hsnId: string;
  pieces: number;
  grossWeight: number;
  netWeight: number;
  fineWeight: number;
  metalRate: number;
  metalAmount: number;
  stoneAmount: number;
  makingAmount: number;
  taxableAmount: number;
  gstPercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
  createdAt: string;
  stockItem?: any;
  category?: any;
}

export interface Sale {
  id: string;
  saleNo: string;
  saleDate: string;
  customerId: string;
  salesmanId: string;
  totalGrossWt: number;
  totalNetWt: number;
  totalFineWt: number;
  stoneAmount: number;
  makingAmount: number;
  wastageAmount: number;
  subTotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  salesman?: {
    id: string;
    name: string;
  };
  items?: SaleItem[];
}

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    return httpClient<Sale[]>('/api/sales');
  },

  getById: async (id: string): Promise<Sale> => {
    return httpClient<Sale>(`/api/sales/${id}`);
  },

  create: async (payload: any): Promise<Sale> => {
    return httpClient<Sale>('/api/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: any): Promise<Sale> => {
    return httpClient<Sale>(`/api/sales/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/sales/${id}`, {
      method: 'DELETE',
    });
  },
};
