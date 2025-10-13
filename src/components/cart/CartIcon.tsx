import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

export const CartIcon = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};
