import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/SimpleCartContext';
import { CartItem as CartItemType } from '@/contexts/SimpleCartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'OhSmash':
        return 'text-ohsmash';
      case 'Wonder Wings':
        return 'text-wonder-wings';
      case 'Okra Green':
        return 'text-okra-green';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Item Image Placeholder */}
          <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">
              {item.brand === 'OhSmash' ? '🍔' : 
               item.brand === 'Wonder Wings' ? '🍗' : '🍛'}
            </span>
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-sm font-medium ${getBrandColor(item.brand)}`}>
                    {item.brand}
                  </span>
                  {item.options?.sauce && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {item.options.sauce}
                    </span>
                  )}
                  {item.options?.size && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {item.options.size}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quantity Controls and Price */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</div>
                {item.quantity > 1 && (
                  <div className="text-xs text-muted-foreground">
                    £{item.price.toFixed(2)} each
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
