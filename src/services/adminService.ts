import { orderManagementService, OrderStatus } from './orderManagement';
import { menuService, MenuItemRecord } from './menuService';
import { inventoryService } from './inventoryService';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  ordersToday: number;
  revenueToday: number;
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentOrders: OrderStatus[];
  lowStockItems: number;
}

class AdminService {
  private updateCallbacks: Array<(stats: AdminStats) => void> = [];
  private cachedStats: AdminStats | null = null;
  private lastUpdate = 0;
  private updateInterval: NodeJS.Timeout | null = null;
  private unsubscribers: Array<() => void> = [];

  constructor() {
    // Initialize with default stats
    this.cachedStats = {
      totalRevenue: 0,
      totalOrders: 0,
      activeCustomers: 0,
      averageOrderValue: 0,
      ordersToday: 0,
      revenueToday: 0,
      topItems: [],
      recentOrders: [],
      lowStockItems: 0
    };
    this.startRealTimeUpdates();
  }

  // Subscribe to real-time updates
  subscribe(callback: (stats: AdminStats) => void) {
    this.updateCallbacks.push(callback);
    // Immediately call with cached stats if available
    if (this.cachedStats) {
      callback(this.cachedStats);
    }
    // Trigger an async update
    this.notifySubscribers().catch(console.error);
    
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  // Start real-time updates with throttling
  private startRealTimeUpdates() {
    if (this.updateInterval) return;
    
    // Do an initial load
    this.notifySubscribers().catch(console.error);
    
    this.updateInterval = setInterval(() => {
      const now = Date.now();
      // Only update every 10 seconds to prevent excessive calculations
      if (now - this.lastUpdate > 10000) {
        this.notifySubscribers().catch(console.error);
        this.lastUpdate = now;
      }
    }, 5000); // Check every 5 seconds but only update every 10 seconds

    // Also subscribe to underlying services to trigger faster updates when data changes
    const unSubOrders = orderManagementService.subscribe(() => this.scheduleNotifySoon());
    const unSubMenu = menuService.subscribe(() => this.scheduleNotifySoon());
    const unSubInventory = inventoryService.subscribe(() => this.scheduleNotifySoon());
    this.unsubscribers.push(unSubOrders, unSubMenu, unSubInventory);
  }

  // Stop real-time updates
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.unsubscribers.forEach(u => { try { u(); } catch {} });
    this.unsubscribers = [];
  }

  // Notify all subscribers of updates
  private async notifySubscribers() {
    try {
      this.cachedStats = await this.getStats();
      this.updateCallbacks.forEach(callback => {
        try {
          callback(this.cachedStats!);
        } catch (error) {
          console.error('Error in admin service callback:', error);
        }
      });
    } catch (error) {
      console.error('Error updating admin stats:', error);
    }
  }

  private notifyScheduled = false;
  private scheduleNotifySoon() {
    if (this.notifyScheduled) return;
    this.notifyScheduled = true;
    setTimeout(() => {
      this.notifyScheduled = false;
      this.notifySubscribers().catch(console.error);
    }, 250); // coalesce rapid changes
  }

  // Get comprehensive admin statistics
  async getStats(): Promise<AdminStats> {
    const orders = await orderManagementService.getOrders();
    const menuItems = await menuService.fetchAll();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersToday = orders.filter(order => 
      new Date(order.createdAt) >= today
    );
    
    const revenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Calculate top items
    const itemStats = new Map<string, { orders: number; revenue: number }>();
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name;
        const existing = itemStats.get(key) || { orders: 0, revenue: 0 };
        itemStats.set(key, {
          orders: existing.orders + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });
    
    const topItems = Array.from(itemStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Get low stock items count from inventory service
    const lowStockItems = inventoryService.getLowStockItemsCount();
    
    // Calculate active customers (customers with orders in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCustomerOrders = orders.filter(order => 
      new Date(order.createdAt) >= thirtyDaysAgo
    );
    
    const uniqueCustomers = new Set(
      recentCustomerOrders.map(order => order.customerInfo.email)
    );
    
    return {
      totalRevenue,
      totalOrders,
      activeCustomers: uniqueCustomers.size,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      ordersToday: ordersToday.length,
      revenueToday,
      topItems,
      recentOrders: orders.slice(0, 10).reverse(),
      lowStockItems: lowStockItems
    };
  }

  // Update order status and notify subscribers
  async updateOrderStatus(orderId: string, newStatus: string) {
    await orderManagementService.updateOrderStatus(orderId, newStatus);
    this.scheduleNotifySoon();
  }

  // Add new order and notify subscribers
  async addOrder(order: Omit<OrderStatus, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const newOrder = {
      ...order,
      status: 'pending' as const
    };
    
    const created = await orderManagementService.storeOrder(newOrder);
    this.scheduleNotifySoon();
    return created;
  }

  // Update menu item stock and notify subscribers
  async updateMenuItemStock(itemId: string, inStock: boolean) {
    await menuService.setStock(itemId, inStock);
    this.scheduleNotifySoon();
  }

  // Get orders by status
  async getOrdersByStatus(status: string) {
    const orders = await orderManagementService.getOrders({ status });
    return orders;
  }

  // Get orders for today
  async getTodaysOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await orderManagementService.getOrders();
    return orders.filter(order => 
      new Date(order.createdAt) >= today
    );
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate: Date, endDate: Date) {
    const orders = await orderManagementService.getOrders({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    return orders;
  }

}

export const adminService = new AdminService();
