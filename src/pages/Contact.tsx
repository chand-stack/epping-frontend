import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHours } from '@/components/ui/OpeningHours';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Twitter, Utensils, Users, Star, MessageCircle, Send, CheckCircle, Heart, Coffee, ChefHat, Award, Globe, Target } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: "53 High St, Epping CM16 4BA",
      description: "Located in the heart of Epping, easily accessible by public transport and car"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "01992 279414",
      description: "Call us for orders, reservations, or any questions"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "See full hours below",
      description: "Open most days for your convenience"
    },
    {
      icon: Mail,
      title: "Email",
      details: "eppingfoodcourt@gmail.com",
      description: "Send us your feedback, suggestions, or inquiries"
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "#", color: "text-pink-600" },
    { name: "Facebook", icon: Facebook, url: "#", color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, url: "#", color: "text-blue-400" }
  ];

  const brands = [
    { name: "OhSmash", description: "Premium burgers and artisanal sandwiches" },
    { name: "Wonder Wings", description: "Crispy wings with signature sauces and rubs" },
    { name: "Okra Green", description: "Authentic Indian cuisine with traditional recipes" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/food-variety.jpg)` }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        
        <div className="relative z-10 text-center text-primary-foreground section-padding">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading font-bold">Contact Us</h1>
            <p className="text-xl md:text-2xl font-medium">We'd love to hear from you</p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Get in touch with us for takeaway orders, feedback, or just to say hello. 
              We're here to make your food experience exceptional with quick, delicious meals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help and answer any questions you might have
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">{info.title}</h3>
                  <p className="text-lg font-medium text-primary">{info.details}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Media */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-heading font-bold mb-6">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:scale-110 transition-transform ${social.color}`}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Image Section */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Visit Our Takeaway Food Court</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience the vibrant atmosphere of Epping Food Court, where three amazing cuisines 
                come together under one roof. Our modern takeaway space is designed for quick service 
                and delicious food on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  <a href="#" target="_blank" rel="noopener noreferrer">Order Online</a>
                </Button>
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                    📞 Call Now to Order
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/chef-cooking.jpg"
                alt="Chef preparing delicious takeaway food at Epping Food Court"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-6">Our Brands</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three unique culinary experiences under one roof
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Utensils className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold">{brand.name}</h3>
                  <p className="text-muted-foreground">{brand.description}</p>
                  <Button variant="outline" size="sm">
                    <Link to={`/${brand.name.toLowerCase().replace(' ', '-')}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Visit Us Today</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">53 High St, Epping CM16 4BA</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Located in the heart of Epping, easily accessible by public transport and car
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <OpeningHours restaurant="all" />
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Service Style</h3>
                    <p className="text-muted-foreground">Quick takeaway service</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Perfect for busy families, workers, and food lovers on the go
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  <a href="#" target="_blank" rel="noopener noreferrer">Order Online</a>
                </Button>
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <a href="tel:01992279414" className="flex items-center justify-center gap-2">
                    📞 Call Now to Order
                  </a>
                </Button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">4.8</div>
              <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">Based on 1,200+ reviews</p>
              <p className="text-sm text-muted-foreground mt-2">
                Rated as Epping's #1 dining destination
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-6">Send Us a Message</h2>
            <p className="text-lg text-muted-foreground">
              Have a question, suggestion, or feedback? We'd love to hear from you!
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <Button type="submit" className="w-full btn-hero">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Contact;