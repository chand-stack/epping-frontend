// Complete app with all components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleCartProvider } from "@/contexts/SimpleCartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { FloatingCartBar } from '@/components/cart/FloatingCartBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import React, { Suspense } from 'react';
import Index from "./pages/Index";

// Lazy load pages for code splitting
const OhSmash = React.lazy(() => import("./pages/OhSmash"));
const WonderWings = React.lazy(() => import("./pages/WonderWings"));
const OkraGreen = React.lazy(() => import("./pages/OkraGreen"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const OrderOnline = React.lazy(() => import("./pages/OrderOnline"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SimpleCartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/ohsmash" element={<OhSmash />} />
                      <Route path="/wonder-wings" element={<WonderWings />} />
                      <Route path="/okra-green" element={<OkraGreen />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/order-online" element={<OrderOnline />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/admin" element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
              <FloatingCartBar />
              <Toaster />
              <Sonner />
              <Analytics />
              <SpeedInsights />
            </BrowserRouter>
          </TooltipProvider>
        </SimpleCartProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;