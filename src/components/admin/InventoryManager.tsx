import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { InventoryItemSkeleton } from '@/components/ui/skeletons';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  X
} from 'lucide-react';
import { inventoryService, InventoryItem, InventoryCategory } from '@/services/inventoryService';

const InventoryManager: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    totalValue: 0,
    categories: [] as any[]
  });

  const [draft, setDraft] = useState<Omit<InventoryItem, 'id' | 'lastUpdated'>>({
    name: '',
    category: 'proteins',
    currentStock: 0,
    minStock: 10,
    maxStock: 100,
    unit: 'pieces',
    supplier: '',
    description: '',
    allergens: []
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedItems = await inventoryService.getAllItems();
        setItems(fetchedItems);
        setCategories(inventoryService.getCategories());
        const fetchedStats = await inventoryService.getInventoryStats();
        setStats(fetchedStats);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const unsubscribe = inventoryService.subscribe(loadData);
    return unsubscribe;
  }, []);

  const getStockPercentage = (item: InventoryItem) => {
    return Math.min((item.currentStock / item.maxStock) * 100, 100);
  };

  const getStatusColor = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'bg-red-100 text-red-800';
    if (item.currentStock <= item.minStock) return 'bg-orange-100 text-orange-800';
    if (item.currentStock <= item.minStock * 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (item: InventoryItem) => {
    if (item.currentStock === 0) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (item.currentStock <= item.minStock) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (item.currentStock <= item.minStock * 1.5) return <Package className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'OUT OF STOCK';
    if (item.currentStock <= item.minStock) return 'LOW STOCK';
    if (item.currentStock <= item.minStock * 1.5) return 'MEDIUM';
    return 'IN STOCK';
  };

  const addItem = async () => {
    if (!draft.name || draft.currentStock < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid item name and stock quantity.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await inventoryService.addItem(draft);
      const fetchedItems = await inventoryService.getAllItems();
      setItems(fetchedItems);
      toast({
        title: "Success",
        description: `${draft.name} has been added to inventory.`,
      });
      setDraft({
        name: '',
        category: 'proteins',
        currentStock: 0,
        minStock: 10,
        maxStock: 100,
        unit: 'pieces',
        supplier: '',
        description: '',
        allergens: []
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateItem = async () => {
    if (!editingItem || !draft.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const itemId = editingItem._id || editingItem.id;
      if (itemId) {
        await inventoryService.updateItem(itemId, draft);
        const fetchedItems = await inventoryService.getAllItems();
        setItems(fetchedItems);
        toast({
          title: "Success",
          description: `${draft.name} has been updated.`,
        });
      }
      setEditingItem(null);
      setDraft({
        name: '',
        category: 'proteins',
        currentStock: 0,
        minStock: 10,
        maxStock: 100,
        unit: 'pieces',
        supplier: '',
        description: '',
        allergens: []
      });
    } catch (error) {
      console.error('Failed to update item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setDraft({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit,
      supplier: item.supplier,
      description: item.description || '',
      allergens: item.allergens || []
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setDraft({
      name: '',
      category: 'proteins',
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
      unit: 'pieces',
      supplier: '',
      description: '',
      allergens: []
    });
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      await inventoryService.updateStock(id, newStock);
      const fetchedItems = await inventoryService.getAllItems();
      setItems(fetchedItems);
      const item = items.find(i => (i._id || i.id) === id);
      toast({
        title: "Success",
        description: `Stock level for ${item?.name || 'item'} updated to ${newStock} ${item?.unit || 'units'}.`,
      });
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock level. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => (i._id || i.id) === id);
    if (!item) return;
    setDeleteConfirm({ id, name: item.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await inventoryService.deleteItem(deleteConfirm.id);
      const fetchedItems = await inventoryService.getAllItems();
      setItems(fetchedItems);
      toast({
        title: "Success",
        description: `${deleteConfirm.name} has been deleted from inventory.`,
      });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast({
        title: "Error",
        description: "Failed to delete inventory item. Please try again.",
        variant: "destructive",
      });
      setDeleteConfirm(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const lowStockItems = items.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Delete Inventory Item</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong> from inventory? This action cannot be undone.
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Track stock levels and manage supplies</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {items.filter(item => item.currentStock === 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search items or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
              </h3>
              <Button variant="ghost" size="sm" onClick={editingItem ? cancelEdit : () => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={draft.category} onValueChange={(value) => setDraft({ ...draft, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={draft.currentStock}
                  onChange={(e) => setDraft({ ...draft, currentStock: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select value={draft.unit} onValueChange={(value) => setDraft({ ...draft, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="pounds">Pounds</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="quarts">Quarts</SelectItem>
                    <SelectItem value="cans">Cans</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="jars">Jars</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="containers">Containers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minStock">Minimum Stock Level *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={draft.minStock}
                  onChange={(e) => setDraft({ ...draft, minStock: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Maximum Stock Level *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={draft.maxStock}
                  onChange={(e) => setDraft({ ...draft, maxStock: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={draft.supplier}
                  onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={editingItem ? cancelEdit : () => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={editingItem ? updateItem : addItem}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <InventoryItemSkeleton key={i} />
            ))}
          </>
        ) : (
          filteredItems.map((item) => (
          <Card key={item._id || item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {categories.find(c => c.id === item.category)?.name || item.category}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(item)}
                  <Badge className={getStatusColor(item)}>
                    {getStatusText(item)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock Level</span>
                    <span>{item.currentStock} / {item.maxStock} {item.unit}</span>
                  </div>
                  <Progress 
                    value={getStockPercentage(item)} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Min Level:</span>
                    <span className="ml-1 font-medium">{item.minStock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Supplier:</span>
                    <span className="ml-1 font-medium">{item.supplier}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="ml-1 font-medium">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="ml-1 font-medium">
                      {item.currentStock <= item.minStock ? 'Needs Restock' : 'Good'}
                    </span>
                  </div>
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Allergens:</span> {item.allergens.join(', ')}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(item._id || item.id || '', item.currentStock + 10)}
                    >
                      +10
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(item._id || item.id || '', item.currentStock + 50)}
                    >
                      +50
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(item._id || item.id || '')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {!loading && filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No inventory items found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first inventory item to get started'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManager;