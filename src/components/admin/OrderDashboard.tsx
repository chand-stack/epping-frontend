import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { orderManagementService, OrderStatus } from '@/services/orderManagement';
import { Clock, Phone, MapPin, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus['status'] | 'all'>('all');
  const [stats, setStats] = useState(orderManagementService.getStatistics());

  useEffect(() => {
    loadOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const allOrders = orderManagementService.getOrders();
    setOrders(allOrders);
    setStats(orderManagementService.getStatistics());
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus['status']) => {
    orderManagementService.updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Dashboard</h1>
        <Button onClick={loadOrders} variant="outline">
          Refresh Orders
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.byStatus.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.byStatus.preparing || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.byStatus.ready || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('all')}
        >
          All Orders
        </Button>
        <Button
          variant={selectedStatus === 'pending' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('pending')}
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === 'preparing' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('preparing')}
        >
          Preparing
        </Button>
        <Button
          variant={selectedStatus === 'ready' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('ready')}
        >
          Ready
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.customerInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">£{order.total.toFixed(2)}</p>
                      {order.estimatedTime && (
                        <p className="text-sm text-muted-foreground">Est: {order.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    >
                      Confirm Order
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
