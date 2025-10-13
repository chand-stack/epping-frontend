import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHours } from '@/components/ui/OpeningHours';
import { ArrowRight, MapPin, Users, Clock, Star, Heart } from 'lucide-react';

const Index = () => {
  const brands = [
    {
      name: "OhSmash",
      description: "Smash burgers packed with flavor",
      logo: "/assets/ohsmash-logo-7DcpAiJi.png",
      href: "/ohsmash",
      tagline: "Bold. Fresh. Smashed."
    },
    {
      name: "Wonder Wings",
      description: "Taste that takes off with every wing",
      logo: "/assets/wonder-wings-logo-D7hel9si.png",
      href: "/wonder-wings",
      tagline: "Crispy. Saucy. Perfect."
    },
    {
      name: "Okra Green",
      description: "Authentic Indian flavors made fresh",
      logo: "/assets/okra-green-logo-DjbZ1NEW.png",
      href: "/okra-green",
      tagline: "Authentic. Spiced. Delicious."
    }
  ];

  return (
    <>
      {/* Hero Section - Optimized for Mobile & SEO */}
      <section className="relative min-h-[100vh] sm:min-h-[90vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/food-court-hero-BY7YhuS5.jpg)` }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center text-primary-foreground px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-black rounded-lg p-3 sm:p-4 shadow-lg" style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>
                <div className="text-white font-bold text-lg sm:text-xl flex items-center justify-center" style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.5px'
                }}>
                  EPP
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-1" fill="currentColor" viewBox="0 0 24 24" style={{
                    filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))'
                  }}>
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                  </svg>
                  NG
                </div>
                <div className="text-white font-bold text-xs sm:text-sm text-center" style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.5px'
                }}>
                  FOOD COURT
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight">
              Best Takeaway in Epping, Essex
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium opacity-90">
              Epping's Premier Food Court - Smash Burgers, Wings & Indian Cuisine
            </h2>
            <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed px-4">
              Experience the best takeaway food in Epping, Essex at our premier food court. From juicy smash burgers at OhSmash to crispy chicken wings at Wonder Wings and authentic Indian curries at Okra Green - we bring three amazing cuisines together for the ultimate takeaway experience in Epping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button asChild size="lg" className="btn-hero w-full sm:w-auto">
                <Link to="/order-online" className="flex items-center justify-center gap-2">
                  Taste The Flavours
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-semibold"
              >
                <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                  📞 Order by Phone
                </a>
              </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto font-medium"
                  >
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=53+High+St,+Epping+CM16+4BA,+UK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      📍 Find Us in Epping
                    </a>
                  </Button>
            </div>
          </div>
        </div>
      </section>

      {/* A World of Flavours - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4 sm:mb-6">
              A World of Flavours in Epping, Essex
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              From American comfort food to spicy wings and aromatic Indian spices - 
              experience global tastes right here in Epping. Find the best food near you!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {brands.map((brand, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-0 space-y-0">
                  <div className={`${
                    brand.name === "OhSmash" ? "bg-ohsmash" : 
                    brand.name === "Wonder Wings" ? "bg-wonder-wings" : 
                    "bg-okra-green"
                  } flex items-center justify-center py-8 sm:py-12`}>
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} Restaurant in Epping, Essex - ${brand.description}`} 
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold">{brand.name}</h3>
                      <p className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wide">
                        {brand.tagline}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground">{brand.description}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ))}
                    </div>
                    <Button asChild className="btn-hero w-full group-hover:scale-105 transition-transform text-sm sm:text-base">
                      <Link to={brand.href} className="flex items-center justify-center gap-2">
                        Explore Menu
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Where Epping Comes Together */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-2 h-2 rounded-full bg-ohsmash animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-wonder-wings animate-pulse" style={{ animationDelay: "0.5s" }} />
              <div className="w-2 h-2 rounded-full bg-okra-green animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Where Epping Comes Together
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              More than just great food - we're the place where friends meet, families gather, 
              and neighbors become community. Every meal shared is a memory made.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold">Family Gatherings</h3>
                <p className="text-muted-foreground text-sm">
                  Everyone finds their favorite - from picky eaters to food adventurers
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold">Quick Lunch Breaks</h3>
                <p className="text-muted-foreground text-sm">
                  Fast, fresh, and satisfying meals for busy Epping workers and students
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold">Date Night</h3>
                <p className="text-muted-foreground text-sm">
                  Share different cuisines together and discover new favorites as a couple
                </p>
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic text-muted-foreground max-w-2xl">
                  "This place has become our family's weekend tradition. The kids love the burgers, 
                  I'm obsessed with the wings, and my partner can't get enough of the Indian food. 
                  It's the perfect solution for our different tastes!"
                </blockquote>
                <div className="text-sm font-medium">- Sarah M., Epping Local</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-ohsmash animate-bounce" />
              <div className="w-3 h-3 rounded-full bg-wonder-wings animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-3 h-3 rounded-full bg-okra-green animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Your Next Food Adventure Starts Here
            </h2>
            <p className="text-xl opacity-90">
              Three incredible cuisines, countless flavor combinations, one unforgettable experience. 
              What will you discover today?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-4"
              >
                <Link to="/order-online" className="flex items-center justify-center gap-2">
                  Start Your Flavor Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold px-8 py-4"
              >
                <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                  📞 Call Now to Order
                </a>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-primary-foreground/5"
              >
                <Link to="/contact" className="flex items-center justify-center">Find Us in Epping</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80 pt-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>5 min from Epping Station</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Open Daily 11AM - 9PM</span>
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
              <p className="text-muted-foreground">Visit us during our operating hours</p>
            </div>
            <OpeningHours restaurant="all" />
          </div>
        </div>
      </section>

      {/* Local SEO Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Why Choose Epping Food Court?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Conveniently Located in Epping, Essex</h3>
                <p className="text-muted-foreground">
                  Easily accessible from Epping town center, with parking available. Perfect for residents and visitors to Epping, Essex.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Fast Takeaway Service</h3>
                <p className="text-muted-foreground">
                  Quick preparation and collection times. Order online or call 01992279414 for fast takeaway service in Epping.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Three Amazing Cuisines</h3>
                <p className="text-muted-foreground">
                  From smash burgers to chicken wings and Indian curries - discover the best takeaway options in Epping, Essex.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
