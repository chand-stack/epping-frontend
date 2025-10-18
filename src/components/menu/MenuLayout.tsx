import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export interface MenuItemData {
  id?: string; // MongoDB _id for unique keys
  name: string;
  price: string;
  description?: string;
  image?: string;
  veg?: boolean;
}

export interface MenuCategoryData {
  name: string;
  items: MenuItemData[];
}

interface MenuLayoutProps {
  brand: 'OhSmash' | 'Wonder Wings' | 'Okra Green';
  categories: MenuCategoryData[];
  leftExtra?: React.ReactNode; // Optional content to render above categories in the left sidebar
}

export const MenuLayout: React.FC<MenuLayoutProps> = ({ brand, categories, leftExtra }) => {
  const [active, setActive] = useState<string>(categories[0]?.name ?? '');
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const handleScrollTo = useCallback((name: string) => {
    const el = sectionsRef.current[name];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(name);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-category');
            if (id) setActive(id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.2, 0.6, 1] }
    );

    const nodes = Object.values(sectionsRef.current).filter(Boolean) as HTMLDivElement[];
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left category nav (chips on mobile, sticky list on desktop) */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
            {leftExtra ? (
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white">
                {leftExtra}
              </div>
            ) : null}
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:overflow-x-visible lg:space-y-2">
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={active === cat.name ? 'default' : 'outline'}
                  className={cn(
                    'whitespace-nowrap min-h-[44px] min-w-[120px] text-sm sm:text-base px-3 sm:px-4 py-2 flex-shrink-0',
                    active === cat.name ? '' : 'bg-white hover:bg-gray-50'
                  )}
                  onClick={() => handleScrollTo(cat.name)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Items list */}
        <section id="menu" className="lg:col-span-6 space-y-6 sm:space-y-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              data-category={cat.name}
              ref={(el) => {
                sectionsRef.current[cat.name] = el;
              }}
            >
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4">{cat.name}</h3>
              <div className="space-y-3 sm:space-y-4">
                {cat.items.map((item, idx) => (
                  <Card key={item.id || `${cat.name}-${item.name}-${idx}`} className="border border-gray-200">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" 
                            loading="lazy" 
                          />
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                              {item.description ? (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                              ) : null}
                            </div>
                            <div className="font-semibold text-sm sm:text-base flex-shrink-0">£{Number.parseFloat(item.price).toFixed(2)}</div>
                          </div>
                          <div className="mt-2 sm:mt-3">
                            <AddToCartButton
                              item={{
                                id: `${brand.toLowerCase().replace(/\s+/g, '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                                name: item.name,
                                price: parseFloat(item.price),
                                description: item.description || '',
                                brand,
                                image: item.image,
                              }}
                              className="w-full min-h-[44px] text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sticky cart summary */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <Card className="border border-gray-200">
              <CardContent className="p-3 sm:p-4 space-y-3">
                <p className="font-semibold text-sm sm:text-base">Your Order</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Items you add will appear here.</p>
                <Button asChild className="w-full min-h-[44px] text-sm sm:text-base">
                  <Link to="/cart">Go to Cart</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MenuLayout;


