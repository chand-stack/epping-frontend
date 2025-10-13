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
    this.startRealTimeUpdates();
  }

  // Subscribe to real-time updates
  subscribe(callback: (stats: AdminStats) => void) {
    this.updateCallbacks.push(callback);
    // Immediately call with cached stats if available
    if (this.cachedStats) {
      callback(this.cachedStats);
    }
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  // Start real-time updates with throttling
  private startRealTimeUpdates() {
    if (this.updateInterval) return;
    
    this.updateInterval = setInterval(() => {
      const now = Date.now();
      // Only update every 10 seconds to prevent excessive calculations
      if (now - this.lastUpdate > 10000) {
        this.notifySubscribers();
        this.lastUpdate = now;
      }
    }, 5000); // Check every 5 seconds but only update every 10 seconds

    // Also subscribe to underlying services to trigger faster updates when data changes
    const unSubOrders = () => {};
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
  private notifySubscribers() {
    this.cachedStats = this.getStats();
    this.updateCallbacks.forEach(callback => callback(this.cachedStats!));
  }

  private notifyScheduled = false;
  private scheduleNotifySoon() {
    if (this.notifyScheduled) return;
    this.notifyScheduled = true;
    setTimeout(() => {
      this.notifyScheduled = false;
      this.notifySubscribers();
    }, 250); // coalesce rapid changes
  }

  // Get comprehensive admin statistics
  getStats(): AdminStats {
    const orders = orderManagementService.getOrders();
    const menuItems = menuService.getAll();
    
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
  updateOrderStatus(orderId: string, newStatus: string) {
    orderManagementService.updateOrderStatus(orderId, newStatus);
    this.notifySubscribers();
  }

  // Add new order and notify subscribers
  addOrder(order: Omit<OrderStatus, 'id' | 'createdAt' | 'status'>) {
    const newOrder: OrderStatus = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    orderManagementService.storeOrder(newOrder);
    this.notifySubscribers();
    return newOrder;
  }

  // Update menu item stock and notify subscribers
  updateMenuItemStock(itemId: string, inStock: boolean) {
    menuService.setStock(itemId, inStock);
    this.notifySubscribers();
  }

  // Get orders by status
  getOrdersByStatus(status: string) {
    return orderManagementService.getOrders().filter(order => order.status === status);
  }

  // Get orders for today
  getTodaysOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orderManagementService.getOrders().filter(order => 
      new Date(order.createdAt) >= today
    );
  }

  // Get orders by date range
  getOrdersByDateRange(startDate: Date, endDate: Date) {
    return orderManagementService.getOrders().filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

}

export const adminService = new AdminService();
