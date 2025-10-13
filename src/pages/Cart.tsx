import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/SimpleCartContext';
import { CartItem } from '@/components/cart/CartItem';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { ShoppingCart, ArrowLeft, Trash2, CreditCard } from 'lucide-react';
import { useState } from 'react';

const Cart = () => {
  const { state, clearCart } = useCart();
  const { items, total, itemCount } = state;
  const [showCheckout, setShowCheckout] = useState(false);

  const deliveryFee = total > 0 ? 2.50 : 0;
  const serviceFee = total > 0 ? 1.50 : 0;
  const finalTotal = total + deliveryFee + serviceFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto section-padding px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-3 sm:mb-4">Your Cart is Empty</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
              Looks like you haven't added any delicious items yet. 
              Explore our amazing food options and add something to your cart!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild className="btn-hero min-h-[44px] w-full sm:w-auto">
                <Link to="/ohsmash">Try OhSmash Burgers</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-[44px] w-full sm:w-auto">
                <Link to="/wonder-wings">Try Wonder Wings</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-[44px] w-full sm:w-auto">
                <Link to="/okra-green">Try Okra Green</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show checkout form if user clicked checkout
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto section-padding px-4 sm:px-6">
          <div className="mb-4 sm:mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowCheckout(false)}
              className="flex items-center space-x-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Button>
          </div>
          <CheckoutForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto section-padding px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
                <Link to="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Continue Shopping</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold">Your Cart</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive min-h-[44px] w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                    
                    {/* Delivery Fee */}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Delivery Fee</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    {/* Service Fee */}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Service Fee</span>
                      <span>£{serviceFee.toFixed(2)}</span>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t pt-3 sm:pt-4">
                      <div className="flex justify-between text-base sm:text-lg font-semibold">
                        <span>Total</span>
                        <span>£{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    className="w-full btn-hero mt-4 sm:mt-6 min-h-[44px]" 
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
                    Complete your order with FoodHub integration
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="mt-3 sm:mt-4">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Delivery Information</h3>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p>• Free delivery on orders over £25</p>
                    <p>• Estimated delivery: 30-45 minutes</p>
                    <p>• We'll call you when your order is ready</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
