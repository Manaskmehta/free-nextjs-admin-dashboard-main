import { httpClient } from './httpClient';

export interface BarcodeDetails {
  id: string;
  barcode: string;
  categoryId: string;
  pieces: number;
  purityId: string;
  grossWeight: string;
  stoneWeight: string;
  netWeight: string;
  wastagePercent: string;
  fineWeight: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    code: string;
    parentId: string | null;
    isSubcategory: boolean;
    description: string;
    metalType: string;
    image: string;
    hsnId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  purity: {
    id: string;
    purityLabel: string;
    purityPercent: string;
  };
  stockItems: Array<{
    id: string;
    materialTypeId: string;
    categoryId: string;
    barcodeDetailsId: string;
    sizeId: string;
    purityId: string;
    pieces: number;
    grossWeight: string;
    stoneWeight: string;
    netWeight: string;
    wastagePercent: string;
    fineWeight: string;
    huid: string;
    stoneCost: string;
    approxSalesPrice: string;
    status: string;
    salesVoucherNo: string;
    orderNo: string;
    createdAt: string;
    updatedAt: string;
    materialType: {
      id: string;
      typeName: string;
      createdAt: string;
    };
    size: {
      id: string;
      sizeLabel: string;
    };
  }>;
}

export const barcodeApi = {
  search: async (query: string): Promise<BarcodeDetails[]> => {
    return httpClient<BarcodeDetails[]>(`/api/barcode-details/search/${query}`);
  },
};
