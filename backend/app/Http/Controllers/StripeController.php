
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        // Validate the request
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
        ]);

        try {
            // Set your Stripe API key
            Stripe::setApiKey(config('services.stripe.secret'));

            $lineItems = [];

            foreach ($request->items as $item) {
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $item['name'],
                        ],
                        'unit_amount' => round($item['price'] * 100), // Convert to cents
                    ],
                    'quantity' => $item['quantity'],
                ];
            }

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => url('/order-success?session_id={CHECKOUT_SESSION_ID}'),
                'cancel_url' => url('/cart'),
            ]);

            return response()->json(['id' => $session->id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleSuccess(Request $request)
    {
        // Validate the session ID
        $request->validate([
            'session_id' => 'required|string',
        ]);

        try {
            // Set your Stripe API key
            Stripe::setApiKey(config('services.stripe.secret'));

            // Retrieve the session to confirm payment was successful
            $session = Session::retrieve($request->session_id);

            // Here you would typically:
            // 1. Update your database to mark the order as paid
            // 2. Send confirmation emails
            // 3. Update inventory
            
            return response()->json(['success' => true, 'session' => $session]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
