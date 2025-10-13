export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  lastUpdated: string;
  costPerUnit?: number; // Optional for internal tracking
  description?: string;
  allergens?: string[];
  expiryDate?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

class InventoryService {
  private storageKey = 'eppingFoodCourtInventory';
  private cache: InventoryItem[] | null = null;
  private isSaving = false;
  private pendingSave = false;
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

  private defaultInventory: InventoryItem[] = [
    // Proteins
    { id: 'beef-patty', name: 'Beef Patties', category: 'proteins', currentStock: 50, minStock: 20, maxStock: 100, unit: 'pieces', supplier: 'Local Butcher', lastUpdated: new Date().toISOString(), description: 'Fresh beef patties for burgers', allergens: [] },
    { id: 'chicken-wings', name: 'Chicken Wings', category: 'proteins', currentStock: 30, minStock: 15, maxStock: 60, unit: 'pounds', supplier: 'Poultry Supplier', lastUpdated: new Date().toISOString(), description: 'Fresh chicken wings', allergens: [] },
    { id: 'chicken-breast', name: 'Chicken Breast', category: 'proteins', currentStock: 25, minStock: 10, maxStock: 50, unit: 'pounds', supplier: 'Poultry Supplier', lastUpdated: new Date().toISOString(), description: 'Boneless chicken breast', allergens: [] },
    { id: 'lamb', name: 'Lamb', category: 'proteins', currentStock: 20, minStock: 8, maxStock: 40, unit: 'pounds', supplier: 'Halal Meat Supplier', lastUpdated: new Date().toISOString(), description: 'Fresh lamb for curries', allergens: [] },
    { id: 'fish', name: 'Fish', category: 'proteins', currentStock: 15, minStock: 5, maxStock: 30, unit: 'pounds', supplier: 'Seafood Supplier', lastUpdated: new Date().toISOString(), description: 'Fresh fish fillets', allergens: ['fish'] },

    // Vegetables
    { id: 'lettuce', name: 'Lettuce', category: 'vegetables', currentStock: 20, minStock: 5, maxStock: 40, unit: 'heads', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'Fresh iceberg lettuce', allergens: [] },
    { id: 'tomatoes', name: 'Tomatoes', category: 'vegetables', currentStock: 30, minStock: 10, maxStock: 60, unit: 'pounds', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'Fresh tomatoes', allergens: [] },
    { id: 'onions', name: 'Onions', category: 'vegetables', currentStock: 25, minStock: 8, maxStock: 50, unit: 'pounds', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'White and red onions', allergens: [] },
    { id: 'potatoes', name: 'Potatoes', category: 'vegetables', currentStock: 40, minStock: 15, maxStock: 80, unit: 'pounds', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'Russet potatoes', allergens: [] },
    { id: 'bell-peppers', name: 'Bell Peppers', category: 'vegetables', currentStock: 15, minStock: 5, maxStock: 30, unit: 'pounds', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'Mixed bell peppers', allergens: [] },
    { id: 'spinach', name: 'Spinach', category: 'vegetables', currentStock: 10, minStock: 3, maxStock: 20, unit: 'pounds', supplier: 'Local Farm', lastUpdated: new Date().toISOString(), description: 'Fresh spinach leaves', allergens: [] },

    // Dairy
    { id: 'cheddar-cheese', name: 'Cheddar Cheese', category: 'dairy', currentStock: 15, minStock: 5, maxStock: 30, unit: 'pounds', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Sharp cheddar cheese', allergens: ['dairy'] },
    { id: 'mozzarella', name: 'Mozzarella', category: 'dairy', currentStock: 12, minStock: 4, maxStock: 25, unit: 'pounds', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Fresh mozzarella', allergens: ['dairy'] },
    { id: 'butter', name: 'Butter', category: 'dairy', currentStock: 8, minStock: 2, maxStock: 15, unit: 'pounds', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Unsalted butter', allergens: ['dairy'] },
    { id: 'yogurt', name: 'Yogurt', category: 'dairy', currentStock: 20, minStock: 5, maxStock: 40, unit: 'containers', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Plain Greek yogurt', allergens: ['dairy'] },
    { id: 'cream', name: 'Heavy Cream', category: 'dairy', currentStock: 6, minStock: 2, maxStock: 12, unit: 'quarts', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Heavy whipping cream', allergens: ['dairy'] },

    // Spices & Herbs
    { id: 'garam-masala', name: 'Garam Masala', category: 'spices', currentStock: 2, minStock: 0.5, maxStock: 5, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Indian spice blend', allergens: [] },
    { id: 'cumin', name: 'Cumin', category: 'spices', currentStock: 1.5, minStock: 0.3, maxStock: 3, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Ground cumin', allergens: [] },
    { id: 'coriander', name: 'Coriander', category: 'spices', currentStock: 1, minStock: 0.2, maxStock: 2, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Ground coriander', allergens: [] },
    { id: 'turmeric', name: 'Turmeric', category: 'spices', currentStock: 1, minStock: 0.2, maxStock: 2, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Ground turmeric', allergens: [] },
    { id: 'paprika', name: 'Paprika', category: 'spices', currentStock: 0.8, minStock: 0.2, maxStock: 1.5, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Smoked paprika', allergens: [] },
    { id: 'garlic-powder', name: 'Garlic Powder', category: 'spices', currentStock: 1.2, minStock: 0.3, maxStock: 2.5, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Garlic powder', allergens: [] },
    { id: 'onion-powder', name: 'Onion Powder', category: 'spices', currentStock: 1, minStock: 0.2, maxStock: 2, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Onion powder', allergens: [] },
    { id: 'black-pepper', name: 'Black Pepper', category: 'spices', currentStock: 0.5, minStock: 0.1, maxStock: 1, unit: 'pounds', supplier: 'Spice Supplier', lastUpdated: new Date().toISOString(), description: 'Ground black pepper', allergens: [] },
    { id: 'salt', name: 'Salt', category: 'spices', currentStock: 5, minStock: 1, maxStock: 10, unit: 'pounds', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Kosher salt', allergens: [] },

    // Grains & Bread
    { id: 'burger-buns', name: 'Burger Buns', category: 'grains', currentStock: 100, minStock: 30, maxStock: 200, unit: 'pieces', supplier: 'Bakery', lastUpdated: new Date().toISOString(), description: 'Sesame seed buns', allergens: ['gluten'] },
    { id: 'naan-bread', name: 'Naan Bread', category: 'grains', currentStock: 50, minStock: 15, maxStock: 100, unit: 'pieces', supplier: 'Indian Bakery', lastUpdated: new Date().toISOString(), description: 'Fresh naan bread', allergens: ['gluten'] },
    { id: 'basmati-rice', name: 'Basmati Rice', category: 'grains', currentStock: 25, minStock: 8, maxStock: 50, unit: 'pounds', supplier: 'Grain Supplier', lastUpdated: new Date().toISOString(), description: 'Premium basmati rice', allergens: [] },
    { id: 'flour', name: 'All-Purpose Flour', category: 'grains', currentStock: 20, minStock: 5, maxStock: 40, unit: 'pounds', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'All-purpose flour', allergens: ['gluten'] },
    { id: 'breadcrumbs', name: 'Breadcrumbs', category: 'grains', currentStock: 5, minStock: 1, maxStock: 10, unit: 'pounds', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Panko breadcrumbs', allergens: ['gluten'] },

    // Sauces & Condiments
    { id: 'tomato-sauce', name: 'Tomato Sauce', category: 'sauces', currentStock: 12, minStock: 3, maxStock: 24, unit: 'cans', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Crushed tomatoes', allergens: [] },
    { id: 'hot-sauce', name: 'Hot Sauce', category: 'sauces', currentStock: 8, minStock: 2, maxStock: 16, unit: 'bottles', supplier: 'Sauce Supplier', lastUpdated: new Date().toISOString(), description: 'Buffalo hot sauce', allergens: [] },
    { id: 'bbq-sauce', name: 'BBQ Sauce', category: 'sauces', currentStock: 6, minStock: 1, maxStock: 12, unit: 'bottles', supplier: 'Sauce Supplier', lastUpdated: new Date().toISOString(), description: 'Smoky BBQ sauce', allergens: [] },
    { id: 'mayo', name: 'Mayonnaise', category: 'sauces', currentStock: 4, minStock: 1, maxStock: 8, unit: 'jars', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Real mayonnaise', allergens: ['eggs'] },
    { id: 'ketchup', name: 'Ketchup', category: 'sauces', currentStock: 6, minStock: 1, maxStock: 12, unit: 'bottles', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Tomato ketchup', allergens: [] },
    { id: 'mustard', name: 'Mustard', category: 'sauces', currentStock: 3, minStock: 1, maxStock: 6, unit: 'bottles', supplier: 'Bulk Supplier', lastUpdated: new Date().toISOString(), description: 'Dijon mustard', allergens: [] },
    { id: 'coconut-milk', name: 'Coconut Milk', category: 'sauces', currentStock: 15, minStock: 5, maxStock: 30, unit: 'cans', supplier: 'Asian Supplier', lastUpdated: new Date().toISOString(), description: 'Coconut milk for curries', allergens: [] },
    { id: 'curry-paste', name: 'Curry Paste', category: 'sauces', currentStock: 8, minStock: 2, maxStock: 16, unit: 'jars', supplier: 'Asian Supplier', lastUpdated: new Date().toISOString(), description: 'Red curry paste', allergens: [] },

    // Frozen Items
    { id: 'frozen-fries', name: 'Frozen Fries', category: 'frozen', currentStock: 20, minStock: 5, maxStock: 40, unit: 'bags', supplier: 'Frozen Supplier', lastUpdated: new Date().toISOString(), description: 'Crispy frozen fries', allergens: [] },
    { id: 'frozen-wings', name: 'Frozen Wings', category: 'frozen', currentStock: 15, minStock: 3, maxStock: 30, unit: 'bags', supplier: 'Frozen Supplier', lastUpdated: new Date().toISOString(), description: 'Pre-breaded wings', allergens: [] },
    { id: 'ice-cream', name: 'Ice Cream', category: 'frozen', currentStock: 10, minStock: 2, maxStock: 20, unit: 'tubs', supplier: 'Dairy Supplier', lastUpdated: new Date().toISOString(), description: 'Vanilla ice cream', allergens: ['dairy'] },

    // Beverages
    { id: 'coca-cola', name: 'Coca Cola', category: 'beverages', currentStock: 50, minStock: 10, maxStock: 100, unit: 'bottles', supplier: 'Beverage Supplier', lastUpdated: new Date().toISOString(), description: 'Coca Cola bottles', allergens: [] },
    { id: 'sprite', name: 'Sprite', category: 'beverages', currentStock: 30, minStock: 5, maxStock: 60, unit: 'bottles', supplier: 'Beverage Supplier', lastUpdated: new Date().toISOString(), description: 'Sprite bottles', allergens: [] },
    { id: 'water', name: 'Bottled Water', category: 'beverages', currentStock: 100, minStock: 20, maxStock: 200, unit: 'bottles', supplier: 'Beverage Supplier', lastUpdated: new Date().toISOString(), description: 'Still water', allergens: [] }
  ];

  private subscribers: (() => void)[] = [];

  constructor() {
    this.initializeInventory();
  }

  private initializeInventory(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultInventory));
    }
  }

  private load(): InventoryItem[] {
    try {
      const items = localStorage.getItem(this.storageKey);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Failed to load inventory:', error);
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

  getAllItems(): InventoryItem[] {
    if (!this.cache) {
      this.cache = this.load();
    }
    return this.cache;
  }

  getCategories(): InventoryCategory[] {
    return this.categories;
  }

  getItemById(id: string): InventoryItem | null {
    const items = this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  getItemsByCategory(categoryId: string): InventoryItem[] {
    const items = this.getAllItems();
    return items.filter(item => item.category === categoryId);
  }

  getLowStockItems(): InventoryItem[] {
    const items = this.getAllItems();
    return items.filter(item => item.currentStock <= item.minStock);
  }

  getLowStockItemsCount(): number {
    return this.getLowStockItems().length;
  }

  updateStock(id: string, newStock: number): void {
    try {
      const items = this.getAllItems();
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        items[itemIndex].currentStock = Math.max(0, newStock);
        items[itemIndex].lastUpdated = new Date().toISOString();
        this.cache = items;
        this.saveDebounced();
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  }

  addItem(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): void {
    try {
      const items = this.getAllItems();
      const newItem: InventoryItem = {
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        lastUpdated: new Date().toISOString()
      };
      
      items.push(newItem);
      this.cache = items;
      this.saveDebounced();
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  }

  updateItem(id: string, updates: Partial<InventoryItem>): void {
    try {
      const items = this.getAllItems();
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        items[itemIndex] = {
          ...items[itemIndex],
          ...updates,
          lastUpdated: new Date().toISOString()
        };
        this.cache = items;
        this.saveDebounced();
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  }

  deleteItem(id: string): void {
    try {
      const items = this.getAllItems();
      const filteredItems = items.filter(item => item.id !== id);
      this.cache = filteredItems;
      this.saveDebounced();
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  getInventoryStats() {
    const items = this.getAllItems();
    const lowStockItems = this.getLowStockItems();
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * (item.costPerUnit || 0)), 0);
    
    return {
      totalItems,
      lowStockCount: lowStockItems.length,
      totalValue,
      categories: this.categories.map(category => ({
        ...category,
        itemCount: this.getItemsByCategory(category.id).length,
        lowStockCount: this.getItemsByCategory(category.id).filter(item => item.currentStock <= item.minStock).length
      }))
    };
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  reset(): void {
    this.cache = this.defaultInventory;
    this.saveDebounced();
    this.notifySubscribers();
  }
}

export const inventoryService = new InventoryService();
