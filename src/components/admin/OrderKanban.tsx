import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { orderManagementService, OrderStatus } from '@/services/orderManagement';
import { adminService } from '@/services/adminService';
import { menuService } from '@/services/menuService';
import { Clock, User, Phone, MapPin, Printer, Eye, Edit, X, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderCardSkeleton } from '@/components/ui/skeletons';

type OrderStatusType = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

const OrderKanban: React.FC = () => {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderStatus | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    specialInstructions: '',
    orderType: 'delivery' as 'delivery' | 'pickup',
    items: [] as Array<{ name: string; quantity: number; price: number; brand: string }>
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [availableMenuItems, setAvailableMenuItems] = useState<Array<{ name: string; price: number; brand: string; category: string }>>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const columns = [
    { id: 'pending', title: 'New Orders', color: 'bg-gray-100', textColor: 'text-gray-800' },
    { id: 'confirmed', title: 'Confirmed', color: 'bg-blue-100', textColor: 'text-blue-800' },
    { id: 'preparing', title: 'Preparing', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { id: 'ready', title: 'Ready', color: 'bg-orange-100', textColor: 'text-orange-800' },
    { id: 'delivered', title: 'Delivered', color: 'bg-green-100', textColor: 'text-green-800' },
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await orderManagementService.getOrders();
      setOrders(fetchedOrders.slice().reverse());
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const printAllNewOrders = () => {
    const newOrders = orders.filter(order => order.status === 'pending');
    if (newOrders.length === 0) {
      alert('No new orders to print');
      return;
    }
    
    newOrders.forEach((order, index) => {
      setTimeout(() => {
        printReceipt(order);
      }, index * 1000); // Stagger prints by 1 second
    });
  };

  const openEditModal = (order: OrderStatus) => {
    setEditingOrder(order);
    setEditForm({
      customerName: order.customerInfo.name,
      customerPhone: order.customerInfo.phone,
      customerEmail: order.customerInfo.email,
      deliveryAddress: order.customerInfo.address || '',
      specialInstructions: order.specialInstructions || '',
      orderType: order.orderType,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        brand: item.brand
      }))
    });
    
    // Load available menu items
    const allItems = menuService.getAll().filter(item => item.inStock);
    setAvailableMenuItems(allItems.map(item => ({
      name: item.name,
      price: item.price,
      brand: item.restaurant,
      category: item.category
    })));
  };

  const closeEditModal = () => {
    setEditingOrder(null);
    setEditForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      deliveryAddress: '',
      specialInstructions: '',
      orderType: 'delivery',
      items: []
    });
    setShowAddItem(false);
    setSelectedMenuItem('');
    setNewItemQuantity(1);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...editForm.items];
    newItems[index].quantity = quantity;
    setEditForm({ ...editForm, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = editForm.items.filter((_, i) => i !== index);
    setEditForm({ ...editForm, items: newItems });
  };

  const addItem = () => {
    if (!selectedMenuItem) return;
    
    const menuItem = availableMenuItems.find(item => item.name === selectedMenuItem);
    if (!menuItem) return;

    // Check if item already exists in order
    const existingItemIndex = editForm.items.findIndex(item => item.name === selectedMenuItem);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const newItems = [...editForm.items];
      newItems[existingItemIndex].quantity += newItemQuantity;
      setEditForm({ ...editForm, items: newItems });
    } else {
      // Add new item
      const newItem = {
        name: menuItem.name,
        quantity: newItemQuantity,
        price: menuItem.price,
        brand: menuItem.brand
      };
      setEditForm({ ...editForm, items: [...editForm.items, newItem] });
    }

    // Reset add item form
    setSelectedMenuItem('');
    setNewItemQuantity(1);
    setShowAddItem(false);
  };

  const saveOrder = async () => {
    if (!editingOrder) return;

    const total = editForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const updatedOrder = {
      customerInfo: {
        name: editForm.customerName,
        phone: editForm.customerPhone,
        email: editForm.customerEmail,
        address: editForm.deliveryAddress || undefined
      },
      specialInstructions: editForm.specialInstructions || undefined,
      orderType: editForm.orderType,
      items: editForm.items,
      total: total,
      status: editingOrder.status
    };

    try {
      const orderId = editingOrder._id || editingOrder.id;
      if (orderId) {
        await orderManagementService.updateOrder(orderId, updatedOrder);
        await loadOrders();
      }
      closeEditModal();
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to save order changes');
    }
  };

  useEffect(() => {
    loadOrders();
    
    // Subscribe to real-time updates
    const unsubscribe = adminService.subscribe(() => {
      loadOrders();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrder(orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: OrderStatusType) => {
    e.preventDefault();
    if (draggedOrder) {
      try {
        await adminService.updateOrderStatus(draggedOrder, newStatus);
        await loadOrders();
        setDraggedOrder(null);
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }
  };

  const printReceipt = (order: OrderStatus) => {
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;

    // Get order ID (use _id from MongoDB or fallback to id)
    const orderId = order._id || order.id || 'N/A';
    const displayOrderId = orderId.length > 8 ? orderId.slice(-8) : orderId;

    type Aggregated = { name: string; quantity: number; price: number };
    const byBrand: Record<string, Aggregated[]> = {};
    const packingAggregate: Record<string, Aggregated> = {};

    order.items.forEach((i) => {
      const brand = i.brand || 'Unknown';
      if (!byBrand[brand]) byBrand[brand] = [];
      const existing = byBrand[brand].find((x) => x.name === i.name);
      if (existing) existing.quantity += i.quantity; else byBrand[brand].push({ name: i.name, quantity: i.quantity, price: i.price });

      if (!packingAggregate[i.name]) packingAggregate[i.name] = { name: i.name, quantity: 0, price: i.price };
      packingAggregate[i.name].quantity += i.quantity;
    });

    const brandOrder = ['OhSmash', 'Wonder Wings', 'Okra Green'];

    const styles = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #E5E7EB; padding-bottom: 16px; }
        .muted { color: #6B7280; }
        .page { padding: 24px; min-height: 100vh; }
        .page + .page { page-break-before: always; }
        h1 { font-size: 24px; margin: 0 0 8px 0; font-weight: 700; }
        h2 { font-size: 18px; margin: 0 0 12px 0; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 12px 8px; font-size: 14px; }
        thead th { text-align: left; border-bottom: 2px solid #E5E7EB; font-weight: 600; background: #F9FAFB; }
        tbody tr:nth-child(even) { background: #F9FAFB; }
        tbody tr + tr td { border-top: 1px solid #E5E7EB; }
        .qty, .price { text-align: right; }
        .totals { text-align: right; font-weight: 700; font-size: 16px; margin-top: 16px; padding-top: 12px; border-top: 2px solid #E5E7EB; }
        .pill { display:inline-block; padding:4px 12px; border-radius:9999px; background:#3B82F6; color: white; font-size:12px; font-weight: 500; }
        .meta { margin: 12px 0 20px 0; font-size: 13px; line-height: 1.4; }
        .brand-header { background: #F3F4F6; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; }
        @media print {
          .page { margin: 0; padding: 20px; }
          .page + .page { page-break-before: always; }
        }
      </style>
    `;

    const headerBlock = (title: string, brand?: string) => `
      <div class="header">
        <h1>Epping Food Court</h1>
        <h2>${title}</h2>
        ${brand ? `<div class="brand-header"><strong>Kitchen Team:</strong> ${brand}</div>` : ''}
        <div class="meta muted">
          <div><strong>Order #${displayOrderId}</strong> • ${new Date(order.createdAt).toLocaleString()}</div>
          <div>${order.orderType.toUpperCase()} • <span class="pill">${order.customerInfo.name}</span> • ${order.customerInfo.phone}</div>
          ${order.orderType === 'delivery' && order.customerInfo.address ? `<div><strong>Delivery Address:</strong> ${order.customerInfo.address}</div>` : ''}
          ${order.specialInstructions ? `<div><strong>Special Instructions:</strong> ${order.specialInstructions}</div>` : ''}
        </div>
      </div>
    `;

    const kitchenTableBlock = (rows: Aggregated[]) => `
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="qty">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.name}</td>
              <td class="qty">x${r.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const packingTableBlock = (rows: Aggregated[]) => `
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="qty">Qty</th>
            <th class="price">Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.name}</td>
              <td class="qty">x${r.quantity}</td>
              <td class="price">£${(r.price * r.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const brandPages = brandOrder
      .filter(b => byBrand[b] && byBrand[b].length > 0)
      .map(b => {
        return `
          <div class="page">
            ${headerBlock(`Kitchen Ticket`, b)}
            ${kitchenTableBlock(byBrand[b])}
          </div>
        `;
      })
      .join('');

    const packingRows = Object.values(packingAggregate).sort((a, b) => a.name.localeCompare(b.name));
    const packingPage = `
      <div class="page">
        ${headerBlock('Packing Sheet — Customer Copy')}
        ${packingTableBlock(packingRows)}
        <div class="totals">Order Total: £${order.total.toFixed(2)}</div>
      </div>
    `;

    win.document.write(`
      <html>
        <head>
          <title>Order ${displayOrderId} — Print</title>
          ${styles}
        </head>
        <body>
          ${brandPages}
          ${packingPage}
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const getOrdersByStatus = (status: OrderStatusType) => {
    return orders.filter(order => order.status === status);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{orders.length} Total Orders</Badge>
          <Button
            onClick={printAllNewOrders}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print All New</span>
          </Button>
          <Button onClick={loadOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto">
        {loading ? (
          // Loading skeleton for all columns
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2 sm:space-y-3 min-w-[280px] sm:min-w-0">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="min-h-[300px] sm:min-h-[400px] space-y-2 sm:space-y-3 p-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                {Array.from({ length: 3 }).map((_, i) => (
                  <OrderCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))
        ) : (
          columns.map((column) => {
            const columnOrders = getOrdersByStatus(column.id as OrderStatusType);
            
            return (
              <div key={column.id} className="space-y-2 sm:space-y-3 min-w-[280px] sm:min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{column.title}</h3>
                  <Badge className={`${column.color} ${column.textColor} text-xs sm:text-sm`}>
                    {columnOrders.length}
                  </Badge>
                </div>
                
                <div
                  className="min-h-[300px] sm:min-h-[400px] space-y-2 sm:space-y-3 p-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id as OrderStatusType)}
                >
                {columnOrders.map((order) => {
                  const orderId = order._id || order.id || '';
                  const displayId = orderId.slice(-8);
                  return (
                    <Card
                      key={orderId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, orderId)}
                      className="cursor-move hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                            #{displayId}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span className="hidden sm:inline">{getTimeAgo(order.createdAt)}</span>
                          </div>
                        </div>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {order.customerInfo.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {order.customerInfo.phone}
                          </span>
                        </div>
                        {order.orderType === 'delivery' && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Delivery</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.items.length} items • £{order.total.toFixed(2)}
                        </p>
                        <div className="text-xs text-gray-500">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printReceipt(order)}
                          className="flex-1"
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          Print
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(order)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Order #{editingOrder.id}</h3>
              <Button variant="ghost" size="sm" onClick={closeEditModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={editForm.customerPhone}
                    onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={editForm.customerEmail}
                    onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    value={editForm.orderType}
                    onValueChange={(value: 'delivery' | 'pickup') => setEditForm({ ...editForm, orderType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editForm.orderType === 'delivery' && (
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={editForm.deliveryAddress}
                    onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })}
                    rows={2}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={editForm.specialInstructions}
                  onChange={(e) => setEditForm({ ...editForm, specialInstructions: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Order Items</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddItem(!showAddItem)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </Button>
                </div>

                {/* Add Item Form */}
                {showAddItem && (
                  <div className="border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="menuItem">Select Item</Label>
                        <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an item" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMenuItems.map((item, index) => (
                              <SelectItem key={index} value={item.name}>
                                {item.name} ({item.brand}) - £{item.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setNewItemQuantity(Math.max(1, newItemQuantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setNewItemQuantity(newItemQuantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-end space-x-2">
                        <Button onClick={addItem} disabled={!selectedMenuItem}>
                          Add to Order
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddItem(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {editForm.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.brand} • £{item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {editForm.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No items in this order. Click "Add Item" to add items.
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold">£{editForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button onClick={saveOrder}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderKanban;
