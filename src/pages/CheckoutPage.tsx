
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { redirectToCheckout } from '@/utils/stripeService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStripeCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await redirectToCheckout(cartItems);
      
      // Note: The user will be redirected to Stripe, so the code below
      // will only execute if there's an error with the redirect
      toast({
        title: "Redirecting to payment gateway",
        description: "You'll be redirected to complete your payment",
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlaceOrder = () => {
    // We'll replace this with Stripe checkout
    handleStripeCheckout();
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/cart')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add products to your cart before proceeding to checkout
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="Doe"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Address</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zip Code</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Your payment will be processed securely via Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="credit-card" name="payment" defaultChecked />
                      <label htmlFor="credit-card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit Card (via Stripe)
                      </label>
                    </div>
                    
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to Stripe's secure payment page to complete your purchase.
                        Your payment information is encrypted and secure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({totalItems} items):</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Pay with Stripe</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;
