import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/SimpleCartContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { orderManagementService, OrderStatus } from '@/services/orderManagement';
import { emailService, OrderEmailData } from '@/services/emailService';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
  deliveryTime?: string;
  paymentMethod: 'card' | 'cash' | 'online' | 'cash_on_delivery' | 'pay_at_pickup';
  specialInstructions?: string;
}

const CheckoutForm = () => {
  const { state, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: 'Epping',
      postcode: 'CM16 4BA',
    },
    paymentMethod: 'pay_at_pickup',
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CustomerInfo] as any,
          [child]: value,
        },
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const sendOrderEmails = async (
    orderId: string,
    customerInfo: CustomerInfo,
    items: any[],
    total: number,
    orderType: 'delivery' | 'pickup'
  ) => {
    try {
      const orderData: OrderEmailData = {
        orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        orderType,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        deliveryAddress: orderType === 'delivery' ? customerInfo.address : undefined,
        paymentMethod: orderType === 'delivery' ? 'cash_on_delivery' : 'pay_at_pickup',
        specialInstructions: customerInfo.specialInstructions,
      };

      // Send order confirmation to customer
      await emailService.sendOrderConfirmationEmail(orderData);
      
      // Send notification to restaurant
      await emailService.sendRestaurantNotificationEmail(orderData);
      
      console.log('Order emails sent successfully');
    } catch (error) {
      console.error('Failed to send order emails:', error);
      // Don't throw error - order should still succeed even if emails fail
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (orderType === 'delivery' && !customerInfo.address.street) {
      toast.error('Please provide delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Payment handled in-store or on delivery; no online payment step
      
      // Store order in backend
      const order = {
        status: 'pending' as const,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: orderType === 'delivery' ? `${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.postcode}` : undefined,
        },
        items: state.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          brand: item.brand,
        })),
        total: finalTotal,
        orderType,
      };
      
      const createdOrder = await orderManagementService.storeOrder(order);
      const orderId = createdOrder?._id || 'N/A';
      
      // Send email notifications
      await sendOrderEmails(orderId, customerInfo, state.items, finalTotal, orderType);
      
      toast.success(`Order submitted successfully! Order ID: ${orderId.slice(-8)}`);
      clearCart(); // Clear cart after successful order
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
  const serviceFee = 1.50;
  const finalTotal = state.total + deliveryFee + serviceFee;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={orderType === 'delivery' ? 'default' : 'outline'}
                onClick={() => setOrderType('delivery')}
                className="h-12"
              >
                🚚 Delivery
              </Button>
              <Button
                type="button"
                variant={orderType === 'pickup' ? 'default' : 'outline'}
                onClick={() => setOrderType('pickup')}
                className="h-12"
              >
                🏪 Pickup
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Address</h3>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={customerInfo.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={customerInfo.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="block text-sm font-medium mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      value={customerInfo.address.postcode}
                      onChange={(e) => handleInputChange('address.postcode', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method - Hidden; we now assume pay on delivery/pickup */}

            {/* Special Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Special Instructions</h3>
              <textarea
                value={customerInfo.specialInstructions || ''}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={3}
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>£{state.total.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>£{serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Order...
                </>
              ) : (
                `Place ${orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order - £${finalTotal.toFixed(2)}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;