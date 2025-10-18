import React, { useMemo, useState, useEffect } from 'react';
import { menuService, type MenuItemRecord } from '@/services/menuService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MenuManager: React.FC = () => {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [filter, setFilter] = useState<MenuItemRecord['restaurant'] | 'All'>('All');
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState<Omit<MenuItemRecord, 'id' | '_id' | 'createdAt' | 'updatedAt'>>({
    restaurant: 'OhSmash',
    category: 'General',
    name: '',
    price: 0,
    description: '',
    image: '',
    veg: false,
    inStock: true,
  });

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const allItems = await menuService.fetchAll();
      setItems(allItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const visible = useMemo(
    () => (filter === 'All' ? items : items.filter(i => i.restaurant === filter)),
    [items, filter]
  );

  const add = async () => {
    if (!draft.name || draft.price <= 0) return;
    try {
      const created = await menuService.add(draft);
      setItems([created, ...items]);
      setDraft({ ...draft, name: '', price: 0, description: '', image: '' });
    } catch (error) {
      console.error('Failed to add menu item:', error);
      alert('Failed to add menu item');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await menuService.remove(id);
      setItems(items.filter(i => (i.id || i._id) !== id));
    } catch (error) {
      console.error('Failed to remove menu item:', error);
      alert('Failed to delete menu item');
    }
  };

  const toggleStock = async (id: string) => {
    const item = items.find(i => (i.id || i._id) === id);
    if (!item) return;
    try {
      await menuService.setStock(id, !item.inStock);
      setItems(items.map(i => ((i.id || i._id) === id ? { ...i, inStock: !i.inStock } : i)));
    } catch (error) {
      console.error('Failed to toggle stock:', error);
      alert('Failed to update stock status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 border">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">Add Menu Item</h3>
          <select
            className="w-full border rounded p-2"
            value={draft.restaurant}
            onChange={(e) => setDraft({ ...draft, restaurant: e.target.value as any })}
          >
            <option>OhSmash</option>
            <option>Wonder Wings</option>
            <option>Okra Green</option>
          </select>
          <input className="w-full border rounded p-2" placeholder="Category" value={draft.category} onChange={(e)=>setDraft({...draft, category:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Name" value={draft.name} onChange={(e)=>setDraft({...draft, name:e.target.value})}/>
          <input className="w-full border rounded p-2" type="number" step="0.01" placeholder="Price" value={draft.price || ''} onChange={(e)=>setDraft({...draft, price:Number(e.target.value)})}/>
          <textarea className="w-full border rounded p-2" placeholder="Description" value={draft.description} onChange={(e)=>setDraft({...draft, description:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Image URL (optional)" value={draft.image} onChange={(e)=>setDraft({...draft, image:e.target.value})}/>
          <div className="flex items-center justify-between">
            <label className="text-sm">Vegetarian</label>
            <input type="checkbox" checked={draft.veg} onChange={(e)=>setDraft({...draft, veg:e.target.checked})}/>
          </div>
          <Button onClick={add} className="w-full">Add Item</Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <select className="border rounded p-2" value={filter} onChange={(e)=>setFilter(e.target.value as any)}>
            <option>All</option>
            <option>OhSmash</option>
            <option>Wonder Wings</option>
            <option>Okra Green</option>
          </select>
          <span className="text-sm text-muted-foreground ml-auto">
            {visible.length} items
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((i)=>(
            <Card key={i.id || i._id} className="border">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{i.restaurant} • {i.category}</div>
                    <div className="font-semibold">{i.name}</div>
                  </div>
                  <div className="font-semibold">£{i.price.toFixed(2)}</div>
                </div>
                {i.description ? <div className="text-sm text-muted-foreground">{i.description}</div> : null}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant={i.inStock ? 'outline' : 'default'} onClick={()=>toggleStock(i.id || i._id!)}>
                    {i.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={()=>remove(i.id || i._id!)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManager;


