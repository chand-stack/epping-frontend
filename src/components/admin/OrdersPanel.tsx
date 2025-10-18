import React, { useEffect, useState } from 'react';
import { orderManagementService, OrderStatus } from '@/services/orderManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const statusSteps: OrderStatus['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderStatus[]>([]);

  const load = async () => {
    const fetchedOrders = await orderManagementService.getOrders();
    setOrders(fetchedOrders.slice().reverse());
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (order: OrderStatus) => {
    const idx = statusSteps.indexOf(order.status);
    const next = statusSteps[Math.min(idx + 1, statusSteps.length - 1)];
    const orderId = order._id || order.id;
    if (orderId) {
      await orderManagementService.updateOrderStatus(orderId, next);
      await load();
    }
  };

  const printReceipt = (order: OrderStatus) => {
    const win = window.open('', '_blank', 'width=600,height=800');
    if (!win) return;
    const orderId = (order._id || order.id || 'N/A').slice(-8);
    const itemsHtml = order.items.map(i => `<tr><td>${i.name}</td><td style="text-align:right">x${i.quantity}</td><td style="text-align:right">£${i.price.toFixed(2)}</td></tr>`).join('');
    win.document.write(`
      <html><head><title>Receipt ${orderId}</title></head>
      <body style="font-family: system-ui, -apple-system, sans-serif;">
        <h2>Epping Food Court</h2>
        <p>Order ID: ${orderId}</p>
        <p>Type: ${order.orderType}</p>
        <p>Customer: ${order.customerInfo.name} (${order.customerInfo.phone})</p>
        <hr/>
        <table style="width:100%">${itemsHtml}</table>
        <hr/>
        <h3 style="text-align:right">Total: £${order.total.toFixed(2)}</h3>
        <script>window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  if (!orders.length) {
    return (
      <Card className="border">
        <CardContent className="p-6 text-center text-muted-foreground">
          No orders yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((o) => {
        const displayId = (o._id || o.id || 'N/A').slice(-8);
        return (
          <Card key={o._id || o.id} className="border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{displayId}</p>
                </div>
                <div className="text-sm font-semibold capitalize">{o.status}</div>
              </div>
              <div className="text-sm">
                <p className="font-medium">{o.customerInfo.name}</p>
                <p className="text-muted-foreground">{o.customerInfo.phone}</p>
              </div>
              <div className="text-sm flex justify-between">
                <span>{o.items.length} items</span>
                <span className="font-semibold">£{o.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => advance(o)}>Advance Status</Button>
                <Button size="sm" variant="outline" onClick={() => printReceipt(o)}>Print Receipt</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrdersPanel;


