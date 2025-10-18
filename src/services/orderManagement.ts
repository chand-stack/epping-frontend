// Order Management Service
// Handles order tracking, status updates, and customer notifications

import { apiClient } from '@/config/api';

export interface OrderStatus {
  _id?: string;
  id?: string; // For backward compatibility
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: string;
  actualTime?: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address?: string;
    paymentMethod?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    brand?: string;
  }>;
  total: number;
  orderType: 'delivery' | 'pickup';
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
}

class OrderManagementService {
  private listeners: Array<() => void> = [];

  // Get all orders from backend
  async getOrders(filters?: { 
    status?: string; 
    orderType?: string;
    customerPhone?: string;
    customerEmail?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrderStatus[]> {
    try {
      const response = await apiClient.get('/orders', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get orders:', error);
      return [];
    }
  }

  // Store order in backend
  async storeOrder(order: Omit<OrderStatus, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderStatus | null> {
    try {
      const response = await apiClient.post('/orders', order);
      this.notify();
      return response.data.data;
    } catch (error) {
      console.error('Failed to store order:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, newStatus: string): Promise<OrderStatus | null> {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      this.notify();
      return response.data.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  // Update entire order
  async updateOrder(orderId: string, updatedOrder: Partial<OrderStatus>): Promise<OrderStatus | null> {
    try {
      const response = await apiClient.put(`/orders/${orderId}`, updatedOrder);
      this.notify();
      return response.data.data;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<OrderStatus | null> {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get order by ID:', error);
      return null;
    }
  }

  // Delete order
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/orders/${orderId}`);
      this.notify();
      return true;
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }

  // Get order statistics
  async getStatistics(): Promise<{ 
    total: number; 
    todayOrders: number;
    todayRevenue: number;
    byStatus: Record<string, number>; 
    byType: Record<string, number>;
  }> {
    try {
      const response = await apiClient.get('/orders/stats');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {
        total: 0,
        todayOrders: 0,
        todayRevenue: 0,
        byStatus: {},
        byType: {},
      };
    }
  }

  // Get recent orders
  async getRecentOrders(limit: number = 10): Promise<OrderStatus[]> {
    try {
      const response = await apiClient.get('/orders/recent', { params: { limit } });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get recent orders:', error);
      return [];
    }
  }

  // Get pending orders
  async getPendingOrders(): Promise<OrderStatus[]> {
    try {
      const response = await apiClient.get('/orders/pending');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get pending orders:', error);
      return [];
    }
  }

  // Subscribe to order changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(l => {
      try { 
        l(); 
      } catch (e) { 
        console.error("Listener error:", e); 
      }
    });
  }

  // For backward compatibility - sync methods that use async internally
  getOrdersSync(): OrderStatus[] {
    console.warn('getOrdersSync is deprecated. Use async getOrders() instead.');
    return [];
  }

  // Clear all orders (for testing) - Not recommended in production
  async clearAllOrders(): Promise<void> {
    console.warn('clearAllOrders is not supported with backend API');
  }

  // Reset with optional seed orders - Not recommended in production
  async reset(orders: OrderStatus[] = []): Promise<void> {
    console.warn('reset is not supported with backend API');
  }
}

export const orderManagementService = new OrderManagementService();