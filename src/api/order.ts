import { httpClient } from './httpClient';
import { Customer } from './customer';
import { Salesman } from './salesman';
import { Design } from './design';

export interface OrderItem {
  id: string;
  orderId: string;
  designId?: string;
  approxNetWeight: string;
  approxGrossWeight: string;
  otherWeight: string;
  quantity: number;
  customizationNotes?: string;
  s3Key?: string;
  createdAt: string;
  design?: Design;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  changedBy?: string | null;
  remarks?: string;
  changedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: 'DESIGN' | 'CUSTOM';
  customerId: string;
  salesmanId: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deliveryDate: string;
  remarks?: string;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  salesman?: Salesman;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface CreateOrderPayload {
  orderNumber: string;
  customerId: string;
  salesmanId: string;
  orderType: 'DESIGN' | 'CUSTOM';
  deliveryDate: string;
  remarks?: string;
  items: {
    designId?: string;
    approxNetWeight: number;
    approxGrossWeight: number;
    otherWeight: number;
    quantity: number;
    customizationNotes?: string;
    s3Key?: string; // For custom orders
  }[];
}

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    return httpClient<Order[]>('/api/orders');
  },

  getById: async (id: string): Promise<Order> => {
    return httpClient<Order>(`/api/orders/${id}`);
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    return httpClient<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus: async (id: string, status: string, remarks?: string): Promise<Order> => {
    return httpClient<Order>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    });
  },
  
  delete: async (id: string): Promise<void> => {
      return httpClient<void>(`/api/orders/${id}`, {
        method: 'DELETE',
      });
  }
};
