import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OpeningHours } from '@/components/ui/OpeningHours';
import { ArrowRight, MapPin, Users, Clock, Star, ChefHat, Award, Heart, Utensils, Coffee, Target, Globe, Shield, BookOpen, Calendar, TrendingUp, Sparkles, Leaf, Zap } from 'lucide-react';

const About = () => {
  const storyTimeline = [
    {
      year: "Jan 2025",
      title: "The Dream Begins",
      description: "Three passionate food entrepreneurs came together with a shared vision: to bring diverse, high-quality cuisine to Epping."
    },
    {
      year: "Feb 2025",
      title: "First Location Opens",
      description: "Epping Food Court opened its doors, featuring OhSmash, Wonder Wings, and Okra Green under one roof."
    },
    {
      year: "Mar 2025",
      title: "Community Recognition",
      description: "We quickly became a community hub, earning local recognition for food quality and service."
    },
    {
      year: "Apr 2025",
      title: "Expansion & Growth",
      description: "We expanded our menu offerings and introduced online ordering, serving thousands of satisfied customers."
    },
    {
      year: "Today",
      title: "Growing Strong",
      description: "We continue to be Epping's premier takeaway destination, constantly innovating while staying true to our roots."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We're not just a food court - we're a gathering place where neighbors become friends and families create memories."
    },
    {
      icon: ChefHat,
      title: "Quality Ingredients",
      description: "Every dish is made with fresh, locally-sourced ingredients and prepared with traditional techniques and modern innovation."
    },
    {
      icon: Shield,
      title: "Authentic Flavors",
      description: "Each brand maintains its unique identity and authentic recipes, ensuring every bite tells a story of tradition and passion."
    },
    {
      icon: Users,
      title: "Inclusive Environment",
      description: "We welcome everyone - from families with children to business professionals, creating a space where all feel at home."
    }
  ];


  const achievements = [
    { number: "10,000+", label: "Happy Customers", icon: Users },
    { number: "4.8★", label: "Average Rating", icon: Star },
    { number: "3", label: "Unique Cuisines", icon: Utensils },
    { number: "1", label: "Year of Excellence", icon: Award }
  ];

  const sustainability = [
    {
      title: "Local Sourcing",
      description: "We partner with local Essex farmers and suppliers to ensure fresh ingredients while supporting our community."
    },
    {
      title: "Eco-Friendly Packaging",
      description: "All our takeaway containers are biodegradable and compostable, reducing our environmental footprint."
    },
    {
      title: "Food Waste Reduction",
      description: "We carefully plan our inventory and donate excess food to local charities, minimizing waste."
    },
    {
      title: "Energy Efficiency",
      description: "Our kitchen equipment is energy-efficient, and we use LED lighting throughout the facility."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/epping-train-station.jpg)` }}
        />
        <div className="absolute inset-0 bg-primary/75" />
        
        <div className="relative z-10 text-center text-primary-foreground section-padding">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-heading font-bold">Our Story</h1>
            <p className="text-xl md:text-2xl font-medium">Where passion meets community</p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Epping Food Court was born from a simple dream: to bring together three distinct culinary traditions 
              under one roof, creating a convenient takeaway destination where food lovers can explore, discover, and enjoy delicious meals in the heart of Epping, Essex.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To create a convenient takeaway destination where three distinct culinary traditions come together, 
                offering exceptional food experiences that bring our Epping community closer. We believe that 
                great food has the power to connect people, create memories, and provide delicious meals for busy lifestyles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every dish we serve is crafted with love, using the finest ingredients and traditional 
                techniques passed down through generations. We're not just serving takeaway food – we're sharing 
                stories, cultures, and the joy of discovery in every bite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  <Link to="/contact">Get to Know Us Better</Link>
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
                alt="Expert chefs preparing fresh takeaway food at Epping Food Court, Essex"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <achievement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">{achievement.number}</div>
                    <p className="text-sm text-muted-foreground">{achievement.label}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a shared dream to Epping's favorite dining destination
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {storyTimeline.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Image Section */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/assets/restaurant-interior.jpg"
                alt="Customers enjoying delicious takeaway food at Epping Food Court, Essex"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Building Community</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Since opening, we've become more than just a takeaway food court. We're a convenient destination where 
                families grab quick meals, friends meet for lunch, and busy professionals get delicious food on the go. Every day, we see 
                the power of great takeaway food to fuel busy lives and bring people together in Epping.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Community First</h3>
                  <p className="text-sm text-muted-foreground">Supporting local events and charities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Sustainability */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Commitment</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Caring for our community and environment
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {sustainability.map((commitment, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-heading font-bold">{commitment.title}</h3>
                  <p className="text-muted-foreground">{commitment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-heading font-bold">Community Impact</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're proud to be more than just a food court. We're a community hub where local events 
                are hosted, families gather for celebrations, and neighbors meet for the first time in Epping.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary" />
                  <span>Hosting local community events and fundraisers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <span>Supporting local charities and food banks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <span>Promoting cultural diversity through food</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-primary" />
                  <span>Creating employment opportunities in Epping, Essex</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">1,200+</div>
              <div className="text-2xl font-semibold mb-2">Community Members</div>
              <p className="text-muted-foreground">Regular customers who call us home</p>
              <div className="mt-8">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-lg font-semibold mb-1">Events Hosted</div>
                <p className="text-muted-foreground text-sm">Birthdays, meetings, celebrations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">Join Our Story</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're a first-time visitor or a regular customer, you're part of our story. 
              Come experience the flavors, meet the community, and create memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                <Link to="/">Explore Our Menu</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Our Opening Hours</h2>
              <p className="text-muted-foreground">Visit us during our operating hours</p>
            </div>
            <OpeningHours restaurant="all" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;