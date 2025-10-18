import { apiClient } from '@/config/api';

export interface MenuItemRecord {
  _id?: string; // MongoDB ID
  id?: string; // For backward compatibility
  restaurant: 'OhSmash' | 'Wonder Wings' | 'Okra Green';
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  veg: boolean;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class MenuService {
  private listeners: Array<() => void> = [];
  private cachedItems: MenuItemRecord[] | null = null;

  // Fetch all menu items from backend
  async fetchAll(restaurant?: string, category?: string): Promise<MenuItemRecord[]> {
    try {
      const params: any = {};
      if (restaurant) params.restaurant = restaurant;
      if (category) params.category = category;

      const response = await apiClient.get('/menu-items', { params });
      const items = response.data.data.map((item: any) => ({
        ...item,
        id: item._id, // Map MongoDB _id to id for compatibility
      }));
      
      this.cachedItems = items;
      return items;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  // Get all menu items (returns cached or fetches)
  getAll(): MenuItemRecord[] {
    return this.cachedItems || [];
  }

  // Get menu items by restaurant
  async getByRestaurant(restaurant: string): Promise<MenuItemRecord[]> {
    return this.fetchAll(restaurant);
  }

  // Get single menu item by ID
  async getById(id: string): Promise<MenuItemRecord | null> {
    try {
      const response = await apiClient.get(`/menu-items/${id}`);
      const item = response.data.data;
      return {
        ...item,
        id: item._id,
      };
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
  }

  // Add new menu item
  async add(item: Omit<MenuItemRecord, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<MenuItemRecord> {
    try {
      const response = await apiClient.post('/menu-items', item);
      const newItem = response.data.data;
      const mappedItem = {
        ...newItem,
        id: newItem._id,
      };
      
      // Update cache
      if (this.cachedItems) {
        this.cachedItems.unshift(mappedItem);
      }
      
      this.notify();
      return mappedItem;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  }

  // Update menu item
  async update(id: string, updates: Partial<Omit<MenuItemRecord, 'id' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<MenuItemRecord | null> {
    try {
      const response = await apiClient.put(`/menu-items/${id}`, updates);
      const updatedItem = response.data.data;
      const mappedItem = {
        ...updatedItem,
        id: updatedItem._id,
      };
      
      // Update cache
      if (this.cachedItems) {
        const index = this.cachedItems.findIndex(item => (item.id || item._id) === id);
        if (index !== -1) {
          this.cachedItems[index] = mappedItem;
        }
      }
      
      this.notify();
      return mappedItem;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return null;
    }
  }

  // Remove menu item
  async remove(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/menu-items/${id}`);
      
      // Update cache
      if (this.cachedItems) {
        this.cachedItems = this.cachedItems.filter(item => (item.id || item._id) !== id);
      }
      
      this.notify();
      return true;
    } catch (error) {
      console.error('Error removing menu item:', error);
      return false;
    }
  }

  // Toggle stock status
  async setStock(id: string, inStock: boolean): Promise<boolean> {
    try {
      await apiClient.patch(`/menu-items/${id}/stock`);
      
      // Update cache
      if (this.cachedItems) {
        const index = this.cachedItems.findIndex(item => (item.id || item._id) === id);
        if (index !== -1) {
          this.cachedItems[index].inStock = inStock;
        }
      }
      
    this.notify();
    return true;
    } catch (error) {
      console.error('Error toggling stock:', error);
      return false;
    }
  }

  // Search menu items
  search(query: string): MenuItemRecord[] {
    const items = this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get categories for a restaurant
  async getCategories(restaurant?: string): Promise<string[]> {
    if (restaurant) {
      try {
        const response = await apiClient.get(`/menu-items/categories/${restaurant}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
    
    const items = this.getAll();
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories).sort();
  }

  // Get statistics
  async getStats() {
    const items = await this.fetchAll();
    return {
      total: items.length,
      inStock: items.filter(item => item.inStock).length,
      outOfStock: items.filter(item => !item.inStock).length,
      byRestaurant: {
        'OhSmash': items.filter(item => item.restaurant === 'OhSmash').length,
        'Wonder Wings': items.filter(item => item.restaurant === 'Wonder Wings').length,
        'Okra Green': items.filter(item => item.restaurant === 'Okra Green').length,
      },
      byCategory: items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify subscribers
  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch {}
    });
  }
}

export const menuService = new MenuService();
