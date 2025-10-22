import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHours } from '@/components/ui/OpeningHours';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ArrowRight, MapPin, Clock, Star, ChefHat, Award, Heart, Utensils, Coffee } from 'lucide-react';
import { MenuLayout, MenuCategoryData } from '@/components/menu/MenuLayout';
import { menuService } from '@/services/menuService';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FrontendMenuSkeleton } from '@/components/ui/skeletons';

const OhSmash = () => {
  const [menuData, setMenuData] = useState<MenuCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const groupIntoCategories = useCallback((items: any[]): MenuCategoryData[] => {
    const byCat: Record<string, { name: string; items: { id: string; name: string; price: string; description: string; veg?: boolean }[] }> = {};
    items.forEach((i) => {
      const cat = i.category || 'General';
      if (!byCat[cat]) byCat[cat] = { name: cat, items: [] };
      byCat[cat].items.push({ 
        id: i._id || i.id,
        name: i.name, 
        price: i.price.toFixed(2), 
        description: i.description || '', 
        veg: i.veg 
      });
    });
    return Object.values(byCat);
  }, []);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    try {
      const ohSmashItems = await menuService.getByRestaurant('OhSmash');
      setMenuData(groupIntoCategories(ohSmashItems));
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  }, [groupIntoCategories]);

  useEffect(() => {
    loadMenu();
    const unsubscribe = menuService.subscribe(loadMenu);
    return () => unsubscribe();
  }, [loadMenu]);

  const specialties = [
    "Fresh beef patties smashed to perfection",
    "Premium brioche buns toasted daily", 
    "House-made sauces and toppings",
    "Crispy hand-cut fries"
  ];

  return (
    <>
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[80vh] sm:min-h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/ohsmash-hero-CefO7dZ9.jpg)` }}
        />
        <div className="absolute inset-0 bg-ohsmash/80" />
        <div className="relative z-10 text-center text-ohsmash-foreground px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="bg-blue-600 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cream-50" style={{
                    textShadow: '2px 2px 0px #ff6b35, -1px -1px 0px #ff6b35, 1px -1px 0px #ff6b35, -1px 1px 0px #ff6b35'
                  }}>
                    OH
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cream-50" style={{
                    textShadow: '2px 2px 0px #dc2626, -1px -1px 0px #dc2626, 1px -1px 0px #dc2626, -1px 1px 0px #dc2626'
                  }}>
                    SMASH!
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-heading font-bold leading-tight">OhSmash</h1>
            <h2 className="text-base sm:text-lg lg:text-xl font-medium">Smash burgers packed with flavor</h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
              Our signature smash technique creates the perfect crispy edge while keeping the center juicy. 
              Every burger is made to order with the freshest ingredients in Epping, Essex.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button size="lg" className="btn-hero bg-ohsmash-foreground text-ohsmash hover:bg-ohsmash-foreground/90 w-full sm:w-auto min-h-[44px]"
                onClick={() => {
                  const el = document.getElementById('menu-info') || document.getElementById('menu');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="flex items-center justify-center gap-2">Order Online <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></span>
              </Button>
              <Button 
                asChild
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-semibold min-h-[44px]"
              >
                <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                  📞 Order by Phone
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="section-padding pb-4 sm:pb-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-4 sm:mb-6">What Makes Us Special</h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Every burger tells a story of quality, flavor, and craftsmanship
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {specialties.map((specialty, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ohsmash/10 flex items-center justify-center mx-auto">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-ohsmash" />
                  </div>
                  <p className="font-medium text-sm sm:text-base">{specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Header - Foodhub style */}
      <section className="py-4 sm:py-6">
        <MenuHeader restaurant="oh-smash" />
      </section>

      {/* Complete Menu - Foodhub-style layout */}
      <section className="pt-4 sm:pt-6 pb-8 sm:pb-12 bg-secondary">
        {loading ? (
          <FrontendMenuSkeleton />
        ) : (
          <MenuLayout brand="OhSmash" categories={menuData} />
        )}
      </section>

      {/* Opening Hours - moved below menu */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <OpeningHours restaurant="oh-smash" />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Visit OhSmash at Epping Food Court</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-ohsmash flex-shrink-0" />
                  <span className="text-sm sm:text-base">53 High St, Epping CM16 4BA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-ohsmash flex-shrink-0" />
                  <span className="text-sm sm:text-base">Mon-Fri: 5-9:45pm, Sat-Sun: 4:30-10:45pm</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button className="btn-ohsmash min-h-[44px] w-full sm:w-auto">
                  <Link to="/order-online">Order for Pickup</Link>
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white border border-green-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold min-h-[44px] w-full sm:w-auto"
                >
                  <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                    📞 Call Now to Order
                  </a>
                </Button>
                <Button variant="outline" className="min-h-[44px] w-full sm:w-auto">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=53+High+St,+Epping+CM16+4BA,+UK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    📍 Get Directions
                  </a>
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ohsmash mb-3 sm:mb-4">4.9</div>
              <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">Based on 500+ reviews</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OhSmash;
