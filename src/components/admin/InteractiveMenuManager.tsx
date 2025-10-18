import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { menuService, MenuItemRecord } from '@/services/menuService';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';

const InteractiveMenuManager: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [filter, setFilter] = useState<MenuItemRecord['restaurant'] | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDescId, setEditingDescId] = useState<string | null>(null);
  const [descDraft, setDescDraft] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const allItems = await menuService.fetchAll();
        setItems(allItems);
      } catch (error) {
        console.error('Failed to load menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
    const unsub = menuService.subscribe(load);
    return () => unsub();
  }, [toast]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize filtered items to prevent unnecessary re-renders
  const filteredItems = useMemo(() => {
    if (!items.length) return [];
    
    return items.filter(item => {
      const matchesFilter = filter === 'All' || item.restaurant === filter;
      if (!matchesFilter) return false;
      
      if (!debouncedSearchTerm) return true;
      
      const searchLower = debouncedSearchTerm.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) ||
             item.category.toLowerCase().includes(searchLower) ||
             item.description.toLowerCase().includes(searchLower);
    });
  }, [items, filter, debouncedSearchTerm]);


  const addItem = async () => {
    if (!draft.name || draft.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid item name and price.",
        variant: "destructive",
      });
      return;
    }
    try {
      const created = await menuService.add(draft);
      setItems([created, ...items]);
      setDraft({
        restaurant: 'OhSmash',
        category: 'General',
        name: '',
        price: 0,
        description: '',
        image: '',
        veg: false,
        inStock: true,
      });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: `${created.name} has been added to the menu.`,
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => (i.id || i._id) === id);
    if (!item) return;
    setDeleteConfirm({ id, name: item.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await menuService.remove(deleteConfirm.id);
      setItems(items.filter(i => (i.id || i._id) !== deleteConfirm.id));
      toast({
        title: "Success",
        description: `${deleteConfirm.name} has been deleted.`,
      });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      });
      setDeleteConfirm(null);
    }
  };

  const toggleStock = async (id: string) => {
    const item = items.find(i => (i.id || i._id) === id);
    if (!item) return;
    try {
      await menuService.setStock(id, !item.inStock);
      setItems(items.map(i => ((i.id || i._id) === id ? { ...i, inStock: !i.inStock } : i)));
      toast({
        title: "Success",
        description: `${item.name} is now ${!item.inStock ? 'in stock' : 'out of stock'}.`,
      });
    } catch (error) {
      console.error('Failed to toggle stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const bulkToggleStock = async (inStock: boolean) => {
    try {
      await Promise.all(selectedItems.map(id => menuService.setStock(id, inStock)));
      setItems(items.map(i => 
        selectedItems.includes(i.id || i._id || '') ? { ...i, inStock } : i
      ));
      toast({
        title: "Success",
        description: `${selectedItems.length} item(s) marked as ${inStock ? 'in stock' : 'out of stock'}.`,
      });
      setSelectedItems([]);
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast({
        title: "Error",
        description: "Failed to update some items. Please try again.",
        variant: "destructive",
      });
    }
  };

  const bulkDelete = () => {
    setBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    const count = selectedItems.length;
    try {
      await Promise.all(selectedItems.map(id => menuService.remove(id)));
      setItems(items.filter(i => !selectedItems.includes(i.id || i._id || '')));
      toast({
        title: "Success",
        description: `${count} item(s) have been deleted.`,
      });
      setSelectedItems([]);
      setBulkDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete items:', error);
      toast({
        title: "Error",
        description: "Failed to delete some items. Please try again.",
        variant: "destructive",
      });
      setBulkDeleteConfirm(false);
    }
  };

  const updateDescription = async (id: string, description: string) => {
    try {
      await menuService.update(id, { description });
      setEditingDescId(null);
      toast({
        title: "Success",
        description: "Description updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update description:', error);
      toast({
        title: "Error",
        description: "Failed to update description. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePrice = async (id: string, itemName: string, price: number) => {
    try {
      await menuService.update(id, { price });
      toast({
        title: "Success",
        description: `Price for ${itemName} updated to £${price.toFixed(2)}.`,
      });
    } catch (error) {
      console.error('Failed to update price:', error);
      toast({
        title: "Error",
        description: "Failed to update price. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, itemName: string, category: string) => {
    try {
      await menuService.update(id, { category });
      toast({
        title: "Success",
        description: `Category for ${itemName} updated to ${category}.`,
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Delete Menu Item</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Delete Multiple Items</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{selectedItems.length} item(s)</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmBulkDelete}>
                  Delete All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your menu items and availability</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="All">All Restaurants</option>
                <option value="OhSmash">OhSmash</option>
                <option value="Wonder Wings">Wonder Wings</option>
                <option value="Okra Green">Okra Green</option>
              </select>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkToggleStock(true)}
                  className="w-full sm:w-auto"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mark In Stock</span>
                  <span className="sm:hidden">In Stock</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkToggleStock(false)}
                  className="w-full sm:w-auto"
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mark Out of Stock</span>
                  <span className="sm:hidden">Out of Stock</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={bulkDelete}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant</label>
                <select
                  value={draft.restaurant}
                  onChange={(e) => setDraft({ ...draft, restaurant: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="OhSmash">OhSmash</option>
                  <option value="Wonder Wings">Wonder Wings</option>
                  <option value="Okra Green">Okra Green</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Burgers, Sides, Drinks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Item Name *</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Smash Burger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (£) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Describe the item..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={draft.veg}
                    onChange={(e) => setDraft({ ...draft, veg: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={draft.inStock}
                    onChange={(e) => setDraft({ ...draft, inStock: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addItem}>
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No menu items found. Add some items to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
        }>
          {filteredItems.map((item) => (
          <Card key={item.id || item._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id || item._id || '')}
                    onChange={() => toggleSelection(item.id || item._id || '')}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.restaurant} • {item.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStock(item.id || item._id || '')}
                  >
                    {item.inStock ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(item.id || item._id || '')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {editingDescId === (item.id || item._id) ? (
                  <div className="space-y-2">
                    <textarea
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Description..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateDescription(item.id || item._id || '', descDraft)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingDescId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2">
                      {item.description || 'No description'}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => {
                        setEditingDescId(item.id || item._id || '');
                        setDescDraft(item.description || '');
                      }}
                      aria-label="Edit description"
                    >
                      ✎
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={item.price}
                    onBlur={(e) => updatePrice(item.id || item._id || '', item.name, Number(e.target.value))}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      setItems(items.map(i => ((i.id || i._id) === (item.id || item._id) ? { ...i, price: newPrice } : i)));
                    }}
                  />
                  {item.veg && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      VEG
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={item.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setItems(items.map(i => ((i.id || i._id) === (item.id || item._id) ? { ...i, category: newCategory } : i)));
                      updateCategory(item.id || item._id || '', item.name, newCategory);
                    }}
                  >
                    <option value={item.category}>{item.category}</option>
                  </select>
                  <Badge className={item.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveMenuManager;
