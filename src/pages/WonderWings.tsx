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

const WonderWings = () => {
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
      const wonderWingsItems = await menuService.getByRestaurant('Wonder Wings');
      setMenuData(groupIntoCategories(wonderWingsItems));
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
    "Hand-breaded wings cooked to perfection",
    "12 signature sauces and dry rubs", 
    "Fresh ingredients daily",
    "Perfectly crispy every time"
  ];

  return (
    <>
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[80vh] sm:min-h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/wonder-wings-hero-BQtmvGWR.jpg)` }}
        />
        <div className="absolute inset-0 bg-wonder-wings/80" />
        <div className="relative z-10 text-center text-wonder-wings-foreground px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="bg-amber-800 rounded-lg p-3 sm:p-4 lg:p-6 shadow-lg">
                <div className="text-center">
                  {/* Wings Icon */}
                  <div className="mb-2">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto text-cream-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cream-50 transform -skew-x-12">
                    WONDER
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-cream-50 transform -skew-x-12">
                    wings
                  </div>
                  <div className="text-xs sm:text-sm text-cream-50 mt-1 italic">
                    Taste That Takes Off
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-heading font-bold leading-tight">Wonder Wings</h1>
            <h2 className="text-base sm:text-lg lg:text-xl font-medium">Taste that takes off with every wing</h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
              Our wings are hand-breaded and cooked to crispy perfection. Choose from our 12 signature sauces 
              and dry rubs to create your perfect wing experience in Epping, Essex.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button size="lg" className="btn-hero bg-wonder-wings-foreground text-wonder-wings hover:bg-wonder-wings-foreground/90 w-full sm:w-auto min-h-[44px]"
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
              Every wing is crafted with care and cooked to crispy perfection
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {specialties.map((specialty, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wonder-wings/10 flex items-center justify-center mx-auto">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-wonder-wings" />
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
        <MenuHeader restaurant="wonder-wings" />
      </section>

      {/* Complete Menu - Foodhub-style layout */}
      <section className="pt-4 sm:pt-6 pb-8 sm:pb-12 bg-secondary">
        {loading ? (
          <FrontendMenuSkeleton />
        ) : (
          <MenuLayout brand="Wonder Wings" categories={menuData} />
        )}
      </section>

      {/* Opening Hours - moved below menu */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <OpeningHours restaurant="wonder-wings" />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Visit Wonder Wings at Epping Food Court</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-wonder-wings flex-shrink-0" />
                  <span className="text-sm sm:text-base">53 High St, Epping CM16 4BA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-wonder-wings flex-shrink-0" />
                  <span className="text-sm sm:text-base">Mon-Fri: 5-9:45pm, Sat-Sun: 4:30-10:45pm</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button className="btn-wonder-wings min-h-[44px] w-full sm:w-auto">
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
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-wonder-wings mb-3 sm:mb-4">4.8</div>
              <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">Based on 750+ reviews</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WonderWings;