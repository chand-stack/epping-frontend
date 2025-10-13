import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OptimizedImage, BLUR_DATA_URLS } from '@/components/ui/OptimizedImage';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

interface FoodItemProps {
  item: {
    name: string;
    price: string;
    description: string;
    image?: string;
    veg?: boolean;
  };
  brand: 'OhSmash' | 'Wonder Wings' | 'Okra Green';
}

const FoodItemComponent: React.FC<FoodItemProps> = ({ item, brand }) => {

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Food Image */}
          {item.image && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg">
              <OptimizedImage
                src={item.image}
                alt={`${item.name} - ${brand} in Epping, Essex`}
                width={300}
                height={128}
                className="w-full h-full object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.food}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          {/* Food Details */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
              {item.veg !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.veg 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.veg ? 'Veg' : 'Non-Veg'}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                £{item.price}
              </span>
              
              <AddToCartButton
                item={{
                  id: `${brand.toLowerCase().replace(' ', '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                  name: item.name,
                  price: parseFloat(item.price),
                  description: item.description,
                  brand,
                  image: item.image,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const OptimizedFoodItem = memo(FoodItemComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.description === nextProps.item.description &&
    prevProps.brand === nextProps.brand
  );
});

OptimizedFoodItem.displayName = 'OptimizedFoodItem';
