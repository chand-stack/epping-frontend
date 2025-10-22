import { apiClient } from '@/config/api';

export interface InventoryItem {
  _id?: string;
  id?: string; // For backward compatibility
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  lastUpdated?: string;
  costPerUnit?: number;
  description?: string;
  allergens?: string[];
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

class InventoryService {
  private subscribers: (() => void)[] = [];
  private categories: InventoryCategory[] = [
    { id: 'proteins', name: 'Proteins', description: 'Meat, poultry, fish, and plant proteins', color: 'bg-red-100 text-red-800' },
    { id: 'vegetables', name: 'Vegetables', description: 'Fresh and frozen vegetables', color: 'bg-green-100 text-green-800' },
    { id: 'dairy', name: 'Dairy', description: 'Milk, cheese, yogurt, and dairy products', color: 'bg-blue-100 text-blue-800' },
    { id: 'spices', name: 'Spices & Herbs', description: 'Spices, herbs, and seasonings', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'grains', name: 'Grains & Bread', description: 'Rice, bread, naan, and grain products', color: 'bg-orange-100 text-orange-800' },
    { id: 'sauces', name: 'Sauces & Condiments', description: 'Sauces, oils, and condiments', color: 'bg-purple-100 text-purple-800' },
    { id: 'frozen', name: 'Frozen Items', description: 'Frozen ingredients and prepared items', color: 'bg-gray-100 text-gray-800' },
    { id: 'beverages', name: 'Beverages', description: 'Drinks and beverage ingredients', color: 'bg-cyan-100 text-cyan-800' }
  ];

  // Get all inventory items from backend
  async getAllItems(category?: string, lowStock?: boolean): Promise<InventoryItem[]> {
    try {
      const params: any = {};
      if (category) params.category = category;
      if (lowStock) params.lowStock = 'true';

      const response = await apiClient.get('/inventory', { params });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get inventory items:', error);
      return [];
    }
  }

  // Get categories
  getCategories(): InventoryCategory[] {
    return this.categories;
  }

  // Get inventory item by ID
  async getItemById(id: string): Promise<InventoryItem | null> {
    try {
      const response = await apiClient.get(`/inventory/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get inventory item:', error);
      return null;
    }
  }

  // Get items by category
  async getItemsByCategory(categoryId: string): Promise<InventoryItem[]> {
    return this.getAllItems(categoryId);
  }

  // Get low stock items
  async getLowStockItems(): Promise<InventoryItem[]> {
    try {
      const response = await apiClient.get('/inventory/low-stock');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get low stock items:', error);
      return [];
    }
  }

  // Get low stock items count
  async getLowStockItemsCount(): Promise<number> {
    const items = await this.getLowStockItems();
    return items.length;
  }

  // Sync version for backward compatibility
  getLowStockItemsCountSync(): number {
    console.warn('getLowStockItemsCountSync is deprecated. Use async getLowStockItemsCount() instead.');
    return 0;
  }

  // Update stock level
  async updateStock(id: string, newStock: number): Promise<InventoryItem | null> {
    try {
      const response = await apiClient.patch(`/inventory/${id}/stock`, { currentStock: newStock });
      this.notifySubscribers();
      return response.data.data;
    } catch (error) {
      console.error('Failed to update stock:', error);
      throw error;
    }
  }

  // Add new inventory item
  async addItem(item: Omit<InventoryItem, '_id' | 'id' | 'lastUpdated' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem | null> {
    try {
      const response = await apiClient.post('/inventory', item);
      this.notifySubscribers();
      return response.data.data;
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      throw error;
    }
  }

  // Update inventory item
  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    try {
      const response = await apiClient.put(`/inventory/${id}`, updates);
      this.notifySubscribers();
      return response.data.data;
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  }

  // Delete inventory item
  async deleteItem(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/inventory/${id}`);
      this.notifySubscribers();
      return true;
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      throw error;
    }
  }

  // Get inventory statistics
  async getInventoryStats() {
    try {
      const response = await apiClient.get('/inventory/stats');
      const stats = response.data.data;
      
      // Format the response to match expected structure
      return {
        totalItems: stats.totalItems || 0,
        lowStockCount: stats.lowStockCount || 0,
        totalValue: stats.totalValue || 0,
        categories: this.categories.map(category => {
          const catData = stats.byCategory?.find((c: any) => c._id === category.id);
          return {
            ...category,
            itemCount: catData?.count || 0,
            lowStockCount: catData?.lowStockCount || 0
          };
        })
      };
    } catch (error) {
      console.error('Failed to get inventory stats:', error);
      return {
        totalItems: 0,
        lowStockCount: 0,
        totalValue: 0,
        categories: this.categories.map(cat => ({ ...cat, itemCount: 0, lowStockCount: 0 }))
      };
    }
  }

  // Subscribe to inventory changes
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in inventory subscriber:', error);
      }
    });
  }

  // Reset functionality (disabled with backend)
  reset(): void {
    console.warn('reset is not supported with backend API');
  }
}

export const inventoryService = new InventoryService();
