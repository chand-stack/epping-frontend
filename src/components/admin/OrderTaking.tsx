import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { menuService, MenuItemRecord } from '@/services/menuService';
import { adminService } from '@/services/adminService';
import { useCart } from '@/contexts/SimpleCartContext';
import { 
  Plus, 
  Minus, 
  Search, 
  ShoppingCart, 
  User, 
  Phone, 
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

const OrderTaking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { addItem, clearCart } = useCart();

  useEffect(() => {
    const load = () => {
      const items = menuService.getAll().filter(item => item.inStock);
      setMenuItems(items);
    };
    load();
    const unsub = menuService.subscribe(load);
    return () => unsub();
  }, []);

  const loadMenuItems = () => {
    const items = menuService.getAll().filter(item => item.inStock);
    setMenuItems(items);
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToOrder = (item: MenuItemRecord) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems(prev => [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        notes: ''
      }]);
    }
    
    toast.success(`${item.name} added to order`);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setOrderItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    setOrderItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const getTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 2.50 : 0;
  };

  const getServiceFee = () => {
    return 1.50;
  };

  const getFinalTotal = () => {
    return getTotal() + getDeliveryFee() + getServiceFee();
  };

  const processOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in customer name and phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const order = {
        items: orderItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          brand: menuItems.find(mi => mi.id === item.id)?.restaurant || 'Unknown'
        })),
        total: getFinalTotal(),
        orderType,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || '',
          address: orderType === 'delivery' ? customerInfo.address : '',
          paymentMethod
        },
        specialInstructions: specialInstructions || undefined,
        updatedAt: new Date().toISOString()
      };

      const newOrder = adminService.addOrder(order);
      
      // Also add to cart for consistency
      orderItems.forEach(item => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        if (menuItem) {
          for (let i = 0; i < item.quantity; i++) {
            addItem({
              id: `${menuItem.restaurant.toLowerCase().replace(/\s+/g, '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
              name: item.name,
              price: item.price,
              description: menuItem.description,
              brand: menuItem.restaurant,
              image: menuItem.image,
              quantity: 1
            });
          }
        }
      });

      toast.success(`Order #${newOrder.id} created successfully!`);
      
      // Reset form
      setOrderItems([]);
      setCustomerInfo({ name: '', phone: '', email: '', address: '' });
      setSpecialInstructions('');
      
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Order creation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">In-House Order Taking</h2>
          <p className="text-gray-600 dark:text-gray-400">Take orders directly from customers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {orderItems.length} items
          </Badge>
          <Badge variant="outline">
            £{getTotal().toFixed(2)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-bold text-gray-900 dark:text-white">£{item.price.toFixed(2)}</p>
                      {item.veg && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          VEG
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => addToOrder(item)}
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="customerName">Name *</Label>
                  <Input
                    id="customerName"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone *</Label>
                  <Input
                    id="customerPhone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
                {orderType === 'delivery' && (
                  <div>
                    <Label htmlFor="customerAddress">Address *</Label>
                    <Textarea
                      id="customerAddress"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Delivery address"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Settings */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label>Order Type</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant={orderType === 'pickup' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrderType('pickup')}
                      className="flex-1"
                    >
                      Pickup
                    </Button>
                    <Button
                      variant={orderType === 'delivery' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrderType('delivery')}
                      className="flex-1"
                    >
                      Delivery
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No items in order
                </p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">£{item.price.toFixed(2)} each</p>
                        <Input
                          placeholder="Notes..."
                          value={item.notes || ''}
                          onChange={(e) => updateItemNotes(item.id, e.target.value)}
                          className="mt-1 h-6 text-xs"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.id, 0)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({orderItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>£{getTotal().toFixed(2)}</span>
                </div>
                {getDeliveryFee() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>£{getDeliveryFee().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>£{getServiceFee().toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>£{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={processOrder}
                disabled={isProcessing || orderItems.length === 0}
                className="w-full mt-4"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Order
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTaking;
