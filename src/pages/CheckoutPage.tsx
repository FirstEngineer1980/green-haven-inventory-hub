
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    sameAsShipping: true
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };
  
  const handleGoBack = () => {
    navigate('/cart');
  };
  
  const handlePlaceOrder = () => {
    if (
      !billingInfo.firstName || 
      !billingInfo.lastName || 
      !billingInfo.email || 
      !billingInfo.phone || 
      !billingInfo.address || 
      !billingInfo.city || 
      !billingInfo.state || 
      !billingInfo.zipCode
    ) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlacingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderComplete(true);
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and is being processed.",
      });
    }, 1500);
  };
  
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  if (orderComplete) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-muted-foreground mb-8">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <div className="mb-8 p-6 border rounded-lg max-w-md mx-auto">
              <div className="text-left space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Order Number</h3>
                  <p className="font-mono">ORD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Date</h3>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Total</h3>
                  <p>${(totalPrice + totalPrice * 0.1).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Payment Method</h3>
                  <p>{paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}</p>
                </div>
              </div>
            </div>
            <Button size="lg" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={billingInfo.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                    <Input 
                      id="zipCode"
                      name="zipCode"
                      value={billingInfo.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      value={billingInfo.country} 
                      onValueChange={(value) => setBillingInfo({...billingInfo, country: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      Credit / Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6 mr-2" />
                        PayPal
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input id="card_number" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="mb-6">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded overflow-hidden mr-2">
                          <img 
                            src={item.product.image || 'https://placehold.co/40x40?text=No+Image'} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({totalItems}):</span>
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
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </Button>
                
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 mr-2" />
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure payment processing
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;
