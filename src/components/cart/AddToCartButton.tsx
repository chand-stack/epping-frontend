import { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/SimpleCartContext';
import { CartItem } from '@/contexts/SimpleCartContext';

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = memo(({ 
  item, 
  variant = 'default',
  className = ''
}) => {
  const { addItem, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  const existingItem = state.items.find(cartItem => cartItem.id === item.id);
  const isInCart = !!existingItem;

  const handleAddToCart = useCallback(() => {
    if (isInCart) {
      // If item is already in cart, just show the cart
      setShowQuantity(false);
      return;
    }
    
    addItem({ ...item, quantity });
    setShowQuantity(false);
    setQuantity(1);
  }, [isInCart, addItem, item, quantity]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showQuantity && !isInCart && (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 p-0 min-h-[44px] min-w-[44px]"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-10 text-center text-sm font-medium min-h-[44px] flex items-center justify-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="w-10 h-10 p-0 min-h-[44px] min-w-[44px]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <Button
          onClick={isInCart ? () => setShowQuantity(false) : handleAddToCart}
          size="sm"
          className={isInCart ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isInCart ? (
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              In Cart
            </>
          ) : showQuantity ? (
            'Add to Cart'
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center space-x-2">
          {showQuantity && !isInCart && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <Button
            onClick={isInCart ? () => setShowQuantity(false) : handleAddToCart}
            size="sm"
            className={isInCart ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isInCart ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                In Cart
              </>
            ) : showQuantity ? (
              'Add to Cart'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Default variant - full card
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-lg font-bold text-primary mt-1">£{item.price.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {showQuantity && !isInCart && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
            
            <Button
              onClick={isInCart ? () => setShowQuantity(false) : handleAddToCart}
              size="sm"
              className={isInCart ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isInCart ? (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  In Cart
                </>
              ) : showQuantity ? (
                'Add to Cart'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
