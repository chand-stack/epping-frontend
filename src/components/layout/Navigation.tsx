import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { SimpleCartIcon } from '@/components/cart/SimpleCartIcon';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/ohsmash', label: 'OhSmash' },
    { path: '/wonder-wings', label: 'Wonder Wings' },
    { path: '/okra-green', label: 'Okra Green' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-black rounded-lg p-2" style={{ 
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}>
              <div className="text-white font-bold text-lg flex items-center justify-center" style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.5px'
              }}>
                EPP
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24" style={{
                  filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))'
                }}>
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
                NG
              </div>
              <div className="text-white font-bold text-xs text-center" style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.5px'
              }}>
                FOOD COURT
              </div>
            </div>
            <div>
              <div className="font-heading font-bold text-xl">Epping Food Court</div>
              <div className="text-xs text-muted-foreground">Three tastes, one place</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <SimpleCartIcon />
              <div className="flex items-center space-x-2">
                <Button asChild className="btn-hero">
                  <Link to="/order-online">Order Online</Link>
                </Button>
                <Button 
                  asChild
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white border border-green-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold min-w-[100px]"
                >
                  <a href="tel:01992279414" className="flex items-center justify-center gap-1">
                    📞 Order by Phone
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-12 w-12 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation" className="md:hidden border-t border-border" role="navigation" aria-label="Mobile navigation menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-3 text-base font-medium transition-colors hover:text-primary min-h-[44px] flex items-center ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <div className="flex justify-center">
                  <SimpleCartIcon />
                </div>
                <Button asChild className="btn-hero w-full min-h-[44px]">
                  <Link to="/order-online" onClick={() => setIsOpen(false)}>
                    Order Online
                  </Link>
                </Button>
                <Button 
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white border border-green-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full font-semibold min-h-[44px]"
                >
                  <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                    📞 Call Now to Order
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};
