import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHours } from '@/components/ui/OpeningHours';
import { CombinedMenuTabs } from '@/components/menu/CombinedMenuTabs';
import { type MenuCategoryData } from '@/components/menu/MenuLayout';
import { menuService, type MenuItemRecord } from '@/services/menuService';
import { Clock, MapPin, Phone, ShoppingCart, Truck, Store } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { FrontendMenuSkeleton } from '@/components/ui/skeletons';

const OrderOnline = () => {
  // Dynamic menus pulled from backend API
  const [ohSmashMenu, setOhSmashMenu] = useState<MenuCategoryData[]>([]);
  const [wonderWingsMenu, setWonderWingsMenu] = useState<MenuCategoryData[]>([]);
  const [okraGreenMenu, setOkraGreenMenu] = useState<MenuCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupIntoCategories = useCallback((items: MenuItemRecord[]): MenuCategoryData[] => {
    const byCat: Record<string, { name: string; items: { name: string; price: string; description: string; veg?: boolean; id?: string }[] }> = {};
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

  // Load menus from backend API
  const loadMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching menus from backend...');
      const all = await menuService.getAll();
      console.log('Menus fetched:', all.length, 'items');
      
      const oh = all.filter(i => i.restaurant === 'OhSmash');
      const ww = all.filter(i => i.restaurant === 'Wonder Wings');
      const og = all.filter(i => i.restaurant === 'Okra Green');
      
      console.log('OhSmash:', oh.length, 'Wonder Wings:', ww.length, 'Okra Green:', og.length);
      
      setOhSmashMenu(groupIntoCategories(oh));
      setWonderWingsMenu(groupIntoCategories(ww));
      setOkraGreenMenu(groupIntoCategories(og));
    } catch (error) {
      console.error('Failed to load menus:', error);
      setError('Failed to load menus. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [groupIntoCategories]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const allMenuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Hero Section - Smaller */}
      <section className="relative min-h-[30vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/food-court-hero-BY7YhuS5.jpg)` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white py-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading font-bold">Order Online</h1>
            <p className="text-lg md:text-xl font-medium opacity-90">
              Three incredible cuisines, one convenient order
            </p>
          </div>
        </div>
      </section>


      {/* Combined Menus with Tabs */}
      <section className="bg-white" ref={allMenuRef}>
        <div className="container mx-auto">
          <div className="text-center py-12">
            <h2 className="text-4xl font-heading font-bold mb-2">Browse All Menus</h2>
            <p className="text-muted-foreground">Switch between our three amazing restaurants</p>
          </div>
          
          {loading ? (
            <FrontendMenuSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadMenus} variant="outline">
                Retry
              </Button>
            </div>
          ) : ohSmashMenu.length + wonderWingsMenu.length + okraGreenMenu.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No menu items found.</p>
              <p className="text-sm text-gray-500">Please add menu items from the admin dashboard.</p>
            </div>
          ) : (
            <CombinedMenuTabs 
              ohSmashMenu={ohSmashMenu}
              wonderWingsMenu={wonderWingsMenu}
              okraGreenMenu={okraGreenMenu}
            />
          )}
        </div>
      </section>

      {/* Ordering Options */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-6">Ordering Options</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the ordering method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-heading font-bold">Delivery</h3>
                <p className="text-muted-foreground">
                  Browse our menus, add items to your cart, and choose delivery at checkout. 
                  We'll prepare your order fresh and deliver it to your door.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>30-45 minutes delivery time</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Free delivery over £15</span>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Browse Menus for Delivery
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <Store className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-heading font-bold">Pickup</h3>
                <p className="text-muted-foreground">
                  Browse our menus, add items to your cart, and choose pickup at checkout. 
                  Skip the wait and enjoy fresh food on the go or dine in our comfortable seating area.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>15-20 minutes preparation time</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>5 min walk from Epping Station</span>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Browse Menus for Pickup
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Visit Our Food Court</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>53 High St, Epping CM16 4BA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>See opening hours below</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>01992 279414</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Located in the heart of Epping, just 5 minutes walk from Epping Station. 
                Perfect for lunch breaks, family dinners, or quick takeaway meals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
        <Button className="btn-hero">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=53+High+St,+Epping+CM16+4BA,+UK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    📍 Get Directions
                  </a>
                </Button>
                <Button variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
            <div className="text-center">
              <div className="bg-muted rounded-lg p-8">
                <h3 className="text-2xl font-heading font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Restaurants</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Menu Items</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">4.8</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">5min</div>
                    <div className="text-sm text-muted-foreground">From Station</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Opening Hours</h2>
              <p className="text-muted-foreground">Check when your favorite restaurants are open</p>
            </div>
            <OpeningHours restaurant="all" />
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderOnline;
