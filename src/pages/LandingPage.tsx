
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Truck, CreditCard, Award } from 'lucide-react';
import MainNav from '@/components/layout/MainNav';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-gh-blue">
        <div className="container mx-auto py-4 px-4">
          <MainNav />
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gh-blue to-gh-green py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Your Trusted Inventory Management Solution
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Streamline your inventory processes, reduce costs, and boost efficiency with our comprehensive platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-gh-blue hover:bg-gray-100"
                  onClick={() => navigate('/products')}
                >
                  Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Login / Register
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
                alt="Inventory Management" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <ShoppingBag className="h-10 w-10 text-gh-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Product Management</h3>
              <p className="text-gray-600">Easily manage your product catalog with advanced organization tools.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Truck className="h-10 w-10 text-gh-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
              <p className="text-gray-600">Real-time updates on your orders and inventory movements.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CreditCard className="h-10 w-10 text-gh-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Fast and secure payment processing for all your transactions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Award className="h-10 w-10 text-gh-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Loyalty</h3>
              <p className="text-gray-600">Reward your customers with promotions and special offers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Electronics', 'Office Supplies', 'Furniture'].map((category) => (
              <div 
                key={category}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => navigate(`/products?category=${category}`)}
              >
                <img 
                  src={`https://picsum.photos/seed/${category}/500/300`} 
                  alt={category} 
                  className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{category}</h3>
                    <p className="text-white/80">Browse all {category.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gh-blue text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your inventory?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that use our platform to optimize their inventory management.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-gh-blue hover:bg-gray-100"
            onClick={() => navigate('/products')}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
