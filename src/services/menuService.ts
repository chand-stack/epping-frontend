import { MenuCategoryData, MenuItemData } from '@/components/menu/MenuLayout';

export interface MenuItemRecord {
  id: string;
  restaurant: 'OhSmash' | 'Wonder Wings' | 'Okra Green';
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  veg: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

class MenuService {
  private storageKey = 'eppingFoodCourtMenuItems';
  private listeners: Array<() => void> = [];
  private inMemoryItems: MenuItemRecord[] | null = null;
  private isSaving = false;
  private pendingSave = false;

  constructor() {
    this.initializeMenu();
    // Fire-and-forget: auto-import CSV template if present and not yet imported
    this.autoImportFromCsvIfRequested();
  }

  private initializeMenu() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialItems: MenuItemRecord[] = [
        // OhSmash items
        {
          id: 'ohsmash-smash-burger',
          restaurant: 'OhSmash',
          category: 'Burgers',
          name: 'Smash Burger',
          price: 9.50,
          description: 'Double beef patty with cheese, lettuce, tomato, and our signature sauce',
          image: '/assets/ohsmash-burger.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ohsmash-bacon-burger',
          restaurant: 'OhSmash',
          category: 'Burgers',
          name: 'Bacon Smash Burger',
          price: 11.50,
          description: 'Smash burger with crispy bacon, cheese, and special sauce',
          image: '/assets/ohsmash-bacon-burger.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ohsmash-fries',
          restaurant: 'OhSmash',
          category: 'Sides',
          name: 'Crispy Fries',
          price: 3.50,
          description: 'Golden crispy fries with sea salt',
          image: '/assets/ohsmash-fries.jpg',
          veg: true,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Wonder Wings items
        {
          id: 'wonder-wings-original',
          restaurant: 'Wonder Wings',
          category: 'Wings',
          name: 'Original Wings (6pc)',
          price: 8.50,
          description: 'Crispy wings with our original seasoning',
          image: '/assets/wonder-wings-original.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'wonder-wings-buffalo',
          restaurant: 'Wonder Wings',
          category: 'Wings',
          name: 'Buffalo Wings (6pc)',
          price: 8.50,
          description: 'Spicy buffalo wings with blue cheese dip',
          image: '/assets/wonder-wings-buffalo.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'wonder-wings-combo',
          restaurant: 'Wonder Wings',
          category: 'Combos',
          name: 'Wings & Fries Combo',
          price: 12.50,
          description: '6 wings with crispy fries and a drink',
          image: '/assets/wonder-wings-combo.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Okra Green items
        {
          id: 'okra-green-butter-chicken',
          restaurant: 'Okra Green',
          category: 'Curries',
          name: 'Butter Chicken',
          price: 13.50,
          description: 'Tender chicken in rich tomato and cream sauce',
          image: '/assets/okra-green-butter-chicken.jpg',
          veg: false,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'okra-green-dal',
          restaurant: 'Okra Green',
          category: 'Curries',
          name: 'Dal Tadka',
          price: 8.50,
          description: 'Lentil curry with aromatic spices',
          image: '/assets/okra-green-dal.jpg',
          veg: true,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'okra-green-naan',
          restaurant: 'Okra Green',
          category: 'Breads',
          name: 'Garlic Naan',
          price: 3.50,
          description: 'Fresh baked naan with garlic and herbs',
          image: '/assets/okra-green-naan.jpg',
          veg: true,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialItems));
    }
  }

  // Parse a single CSV line into fields (handles quoted commas)
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        // Toggle quote state or handle escaped quotes
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  // Import from raw CSV text (expects header: Brand,Category,Name,Description,Price,VEG,Image)
  importFromCsv(csvText: string) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) return;
    const header = this.parseCsvLine(lines[0]).map(h => h.toLowerCase());
    const colIndex = (name: string) => header.indexOf(name.toLowerCase());
    const idxBrand = colIndex('brand');
    const idxCategory = colIndex('category');
    const idxName = colIndex('name');
    const idxDescription = colIndex('description');
    const idxPrice = colIndex('price');
    const idxVeg = colIndex('veg');
    const idxImage = colIndex('image');

    const imported: MenuItemRecord[] = [];
    const nowIso = new Date().toISOString();
    for (let i = 1; i < lines.length; i++) {
      const fields = this.parseCsvLine(lines[i]);
      if (!fields.length) continue;
      const restaurant = (fields[idxBrand] || '').trim() as MenuItemRecord['restaurant'];
      const name = (fields[idxName] || '').trim();
      const priceStr = (fields[idxPrice] || '').trim();
      if (!restaurant || !name || !priceStr) continue;
      const price = Number(priceStr);
      if (Number.isNaN(price)) continue;
      const category = (fields[idxCategory] || 'General').trim();
      const description = (fields[idxDescription] || '').trim();
      const image = (fields[idxImage] || '').trim();
      const vegRaw = (fields[idxVeg] || '').trim().toLowerCase();
      const veg = vegRaw === 'true' || vegRaw === 'yes' || vegRaw === '1';

      const id = `${restaurant.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      imported.push({
        id,
        restaurant,
        category,
        name,
        price,
        description,
        image,
        veg,
        inStock: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    }
    if (imported.length > 0) {
      this.reset(imported);
      localStorage.setItem('eppingMenuImportedFromCsv', 'true');
    }
  }

  private async autoImportFromCsvIfRequested() {
    try {
      const already = localStorage.getItem('eppingMenuImportedFromSite');
      if (already === 'true') return;
      
      // Always import on first load if not already imported
      const { siteMenus } = await import('@/data/siteMenus');
      this.importFromSiteMenus(siteMenus);
      localStorage.setItem('eppingMenuImportedFromSite', 'true');
    } catch (e) {
      console.error('Failed to auto-import menu:', e);
    }
  }

  private loadFromStorage(): MenuItemRecord[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorageDebounced() {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    this.isSaving = true;
    try {
      if (this.inMemoryItems) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.inMemoryItems));
      }
    } finally {
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        // queue another tick to coalesce rapid updates
        setTimeout(() => this.saveToStorageDebounced(), 0);
      }
    }
  }

  getAll(): MenuItemRecord[] {
    if (!this.inMemoryItems) {
      this.inMemoryItems = this.loadFromStorage();
    }
    return this.inMemoryItems;
  }

  getByRestaurant(restaurant: string): MenuItemRecord[] {
    return this.getAll().filter(item => item.restaurant === restaurant);
  }

  getById(id: string): MenuItemRecord | null {
    return this.getAll().find(item => item.id === id) || null;
  }

  add(item: Omit<MenuItemRecord, 'id' | 'createdAt' | 'updatedAt'>): MenuItemRecord {
    const items = this.getAll();
    const newItem: MenuItemRecord = {
      ...item,
      id: `${item.restaurant.toLowerCase().replace(/\s+/g, '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.inMemoryItems = items;
    this.saveToStorageDebounced();
    this.notify();
    return newItem;
  }

  update(id: string, updates: Partial<Omit<MenuItemRecord, 'id' | 'createdAt' | 'updatedAt'>>): MenuItemRecord | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryItems = items;
    this.saveToStorageDebounced();
    this.notify();
    return items[index];
  }

  remove(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.inMemoryItems = filtered;
    this.saveToStorageDebounced();
    this.notify();
    return true;
  }

  setStock(id: string, inStock: boolean): boolean {
    const item = this.getById(id);
    if (!item) return false;
    const ok = this.update(id, { inStock }) !== null;
    this.notify();
    return ok;
  }

  search(query: string): MenuItemRecord[] {
    const items = this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  getCategories(restaurant?: string): string[] {
    const items = restaurant ? this.getByRestaurant(restaurant) : this.getAll();
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories).sort();
  }

  getStats() {
    const items = this.getAll();
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

  // Reset to empty or provided items
  reset(items: MenuItemRecord[] = []): void {
    this.inMemoryItems = items;
    this.saveToStorageDebounced();
    this.notify();
  }

  // Force import from site menus (for manual trigger)
  async forceImportFromSite(): Promise<void> {
    try {
      const { siteMenus } = await import('@/data/siteMenus');
      this.importFromSiteMenus(siteMenus);
      localStorage.setItem('eppingMenuImportedFromSite', 'true');
    } catch (e) {
      console.error('Failed to force import menu:', e);
      throw e;
    }
  }

  // Bulk import from site menu shape
  importFromSiteMenus(siteMenus: Record<string, { name: string; price: number; description?: string; category: string; veg?: boolean; image?: string; }[]>): void {
    const imported: MenuItemRecord[] = [];
    Object.entries(siteMenus).forEach(([restaurant, list]) => {
      list.forEach((m) => {
        imported.push({
          id: `${restaurant.toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
          restaurant: restaurant as any,
          category: m.category || 'General',
          name: m.name,
          price: m.price,
          description: m.description || '',
          image: m.image || '',
          veg: !!m.veg,
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });
    this.reset(imported);
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch {}
    });
  }
}

export const menuService = new MenuService();