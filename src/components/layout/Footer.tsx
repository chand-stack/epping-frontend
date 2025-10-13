import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto section-padding">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/epping-food-court-logo-18aznsNS.png" 
                alt="Epping Food Court" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="font-heading font-bold text-xl">Epping Food Court</div>
                <div className="text-sm opacity-80">Three tastes, one place</div>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Bringing together the best of burgers, wings, and Indian cuisine under one roof.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">About</Link></li>
              <li><Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link to="/order-online" className="opacity-80 hover:opacity-100 transition-opacity">Order Online</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Our Brands</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ohsmash" className="opacity-80 hover:opacity-100 transition-opacity">OhSmash Burgers</Link></li>
              <li><Link to="/wonder-wings" className="opacity-80 hover:opacity-100 transition-opacity">Wonder Wings</Link></li>
              <li><Link to="/okra-green" className="opacity-80 hover:opacity-100 transition-opacity">Okra Green Indian</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 opacity-80" />
                <span className="opacity-80">
                  53 High St<br />
                  Epping CM16 4BA<br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 opacity-80" />
                <span className="opacity-80">01992 279414</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 opacity-80" />
                <span className="opacity-80">Mon-Fri: 5-9:45pm, Sat-Sun: 4:30-10:45pm</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 opacity-80" />
                <span className="opacity-80">eppingfoodcourt@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm opacity-80">
                © 2024 Epping Food Court. All rights reserved.
              </p>
              <p className="text-sm opacity-60">
                Built by <a href="https://www.kodebykraft.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity underline">www.kodebykraft.com</a>
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact</Link>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
