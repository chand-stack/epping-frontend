// Order Management Service
// Handles order tracking, status updates, and customer notifications

export interface OrderStatus {
  id: string;
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
  private storageKey = 'eppingFoodCourtOrders';
  private cache: OrderStatus[] | null = null;
  private isSaving = false;
  private pendingSave = false;

  private load(): OrderStatus[] {
    try {
      const orders = localStorage.getItem(this.storageKey);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Failed to get orders from localStorage:', error);
      return [];
    }
  }

  private saveDebounced() {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    this.isSaving = true;
    try {
      if (this.cache) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
      }
    } finally {
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        setTimeout(() => this.saveDebounced(), 0);
      }
    }
  }

  // Get all orders from localStorage
  getOrders(): OrderStatus[] {
    if (!this.cache) {
      this.cache = this.load();
    }
    return this.cache;
  }

  // Store order in localStorage
  storeOrder(order: OrderStatus): void {
    try {
      const orders = this.getOrders();
      orders.push(order);
      this.cache = orders;
      this.saveDebounced();
    } catch (error) {
      console.error('Failed to store order:', error);
    }
  }

  // Update order status
  updateOrderStatus(orderId: string, newStatus: string): void {
    try {
      const orders = this.getOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus as any;
        orders[orderIndex].updatedAt = new Date().toISOString();
        this.cache = orders;
        this.saveDebounced();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  }

  // Update entire order
  updateOrder(updatedOrder: OrderStatus): void {
    try {
      const orders = this.getOrders();
      const orderIndex = orders.findIndex(order => order.id === updatedOrder.id);
      
      if (orderIndex !== -1) {
        orders[orderIndex] = updatedOrder;
        this.cache = orders;
        this.saveDebounced();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  }

  // Get order by ID
  getOrderById(orderId: string): OrderStatus | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  // Get order statistics
  getStatistics(): { total: number; byStatus: Record<string, number>; byType: Record<string, number> } {
    const orders = this.getOrders();
    
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    
    orders.forEach(order => {
      byStatus[order.status] = (byStatus[order.status] || 0) + 1;
      byType[order.orderType] = (byType[order.orderType] || 0) + 1;
    });
    
    return {
      total: orders.length,
      byStatus,
      byType,
    };
  }

  // Clear all orders (for testing)
  clearAllOrders(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.cache = [];
    } catch (error) {
      console.error('Failed to clear orders:', error);
    }
  }

  // Reset with optional seed orders
  reset(orders: OrderStatus[] = []): void {
    try {
      this.cache = orders;
      this.saveDebounced();
    } catch (error) {
      console.error('Failed to reset orders:', error);
    }
  }
}

export const orderManagementService = new OrderManagementService();