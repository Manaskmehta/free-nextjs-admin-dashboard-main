import { httpClient } from './httpClient';

export interface StockItem {
  id: string;
  materialTypeId: string;
  categoryId: string;
  sizeId: string;
  purityId: string;
  pieces: number;
  grossWeight: number;
  stoneWeight: number;
  netWeight: number;
  wastagePercent: number;
  fineWeight: number;
  huid: string;
  stoneCost: number;
  approxSalesPrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  salesVoucherNo: string | null;
  orderNo: string | null;
  barcode?: string;
  barcodeDetails?: {
    barcode: string;
  };
  // Expanded fields for display if returned by API
  materialType?: { typeName: string };
  category?: { name: string };
  size?: { sizeLabel: string };
  purity?: { purityLabel: string };
}

export interface CreateStockItemPayload {
  materialTypeId: string;
  categoryId: string;
  sizeId: string;
  purityId: string;
  pieces: number;
  grossWeight: number;
  stoneWeight: number;
  netWeight: number;
  wastagePercent: number;
  fineWeight: number;
  huid: string;
  stoneCost: number;
  approxSalesPrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  salesVoucherNo?: string | null;
  orderNo?: string | null;
  barcode?: string;
}

export interface UpdateStockItemPayload extends Partial<CreateStockItemPayload> {}

export const stockApi = {
  getAll: async (): Promise<StockItem[]> => {
    return httpClient<StockItem[]>('/api/stock-items');
  },

  getById: async (id: string): Promise<StockItem> => {
    return httpClient<StockItem>(`/api/stock-items/${id}`);
  },

  create: async (payload: CreateStockItemPayload): Promise<StockItem> => {
    return httpClient<StockItem>('/api/stock-items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateStockItemPayload): Promise<StockItem> => {
    return httpClient<StockItem>(`/api/stock-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return httpClient<void>(`/api/stock-items/${id}`, {
      method: 'DELETE',
    });
  },
};
