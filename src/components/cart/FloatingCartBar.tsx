import React from 'react';
import { useCart } from '@/contexts/SimpleCartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export const FloatingCartBar: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();

  const itemCount = state.itemCount;
  const total = state.total;

  const isCartPage = location.pathname === '/cart';
  const isHidden = itemCount === 0 || isCartPage;

  if (isHidden) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[500px]">
      <div className="rounded-2xl shadow-2xl border border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-2 py-0.5">
                {itemCount}
              </span>
            </div>
            <div className="text-sm sm:text-base">
              <div className="font-semibold">Your order</div>
              <div className="text-muted-foreground">£{total.toFixed(2)}</div>
            </div>
          </div>
          <Button asChild className="min-w-[130px]">
            <Link to="/cart">View Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;


