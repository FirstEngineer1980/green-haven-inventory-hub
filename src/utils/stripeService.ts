
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51NuaV9DeOAfcMqiE19vJUlH8SqNlVLuwp0hvpWXdpbH22FjDVMlPQwZDR6wJzKpBzKhocuGQYP5r9wtEjuQ7sODG00KxFksMxW');

export const redirectToCheckout = async (cartItems: any[]) => {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    
    // Create a checkout session on your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      }),
    });
    
    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      console.error(result.error.message);
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
};
