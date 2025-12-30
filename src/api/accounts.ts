import { httpClient } from './httpClient';

export interface Ledger {
  id: string;
  name: string;
  group: 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Sundry Debtors' | 'Sundry Creditors';
  openingBalance: number;
  balanceType: 'Dr' | 'Cr';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLedgerPayload {
  name: string;
  group: string;
  openingBalance: number;
  balanceType: 'Dr' | 'Cr';
}

export interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  type: 'Payment' | 'Receipt' | 'Journal' | 'Contra';
  ledgerId: string;
  amount: number;
  typeDrCr: 'Dr' | 'Cr';
  narration: string;
  createdAt: string;
  ledger?: Ledger;
}

export interface CreateVoucherPayload {
  date: string;
  type: string;
  ledgerId: string;
  amount: number;
  typeDrCr: 'Dr' | 'Cr';
  narration: string;
}

export const accountsApi = {
  // Ledgers
  getLedgers: async (): Promise<Ledger[]> => {
    // In a real app, this would be an API call.
    // Since we don't have the backend, we might simulate or try to hit a generic endpoint if it existed.
    // For now, let's assume there is an endpoint or we will mock it in the client if this fails.
    try {
        return await httpClient<Ledger[]>('/api/ledgers');
    } catch (e) {
        console.warn("API /api/ledgers not found, returning empty array");
        return [];
    }
  },

  createLedger: async (payload: CreateLedgerPayload): Promise<Ledger> => {
    return httpClient<Ledger>('/api/ledgers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Vouchers
  getVouchers: async (): Promise<Voucher[]> => {
    try {
        return await httpClient<Voucher[]>('/api/vouchers');
    } catch (e) {
        return [];
    }
  },

  createVoucher: async (payload: CreateVoucherPayload): Promise<Voucher> => {
    return httpClient<Voucher>('/api/vouchers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
