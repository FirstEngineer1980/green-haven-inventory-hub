
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingBag, Trash, Plus, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      description: `${productName} has been removed from your cart`,
    });
  };
  
  const handleQuantityChange = (productId: string, quantity: number, maxQuantity: number) => {
    if (quantity > 0 && quantity <= maxQuantity) {
      updateQuantity(productId, quantity);
    }
  };
  
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };
  
  const handleClearCart = () => {
    clearCart();
    toast({
      description: "Your cart has been cleared",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleContinueShopping}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button size="lg" onClick={handleContinueShopping}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-lg border">
                <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded overflow-hidden">
                            <img 
                              src={item.product.image || 'https://placehold.co/100x100?text=No+Image'} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto p-0 text-red-500"
                              onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              <span className="text-xs">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        ${item.product.price.toFixed(2)}
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="flex border rounded-md w-28">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-r-none h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(
                              item.product.id, 
                              item.quantity - 1,
                              item.product.quantity
                            )}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(
                              item.product.id, 
                              parseInt(e.target.value) || 1,
                              item.product.quantity
                            )}
                            className="h-8 text-center border-0 w-12"
                            min={1}
                            max={item.product.quantity}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-l-none h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(
                              item.product.id, 
                              item.quantity + 1,
                              item.product.quantity
                            )}
                            disabled={item.quantity >= item.product.quantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 flex justify-between bg-muted">
                  <Button variant="outline" onClick={handleClearCart}>
                    Clear Cart
                  </Button>
                  <Button variant="outline" onClick={handleContinueShopping}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
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
                  
                  <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe
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

export default CartPage;
