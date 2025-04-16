
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { toast } = useToast();
  
  // Get the session_id from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  useEffect(() => {
    if (sessionId) {
      // You could verify the payment with your backend here if needed
      // For now, we'll just clear the cart and show a success message
      clearCart();
      
      toast({
        title: "Payment successful",
        description: "Thank you for your order!",
      });
    }
  }, [sessionId, clearCart, toast]);
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Order Successful!</h1>
            
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            <div className="flex flex-col space-y-4">
              <Button onClick={() => navigate('/orders')}>
                View Your Orders
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderSuccessPage;
