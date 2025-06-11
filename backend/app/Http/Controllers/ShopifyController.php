
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ShopifyController extends Controller
{
    private $shopifyDomain;
    private $accessToken;

    public function __construct()
    {
        $this->shopifyDomain = config('services.shopify.domain');
        $this->accessToken = config('services.shopify.access_token');
    }

    /**
     * Get all orders from Shopify
     */
    public function getOrders(Request $request)
    {
        try {
            $params = $request->only(['status', 'limit', 'page_info', 'created_at_min', 'created_at_max']);
            
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/orders.json", $params);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Failed to fetch orders'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a specific order from Shopify
     */
    public function getOrder($orderId)
    {
        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/orders/{$orderId}.json");

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Order not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all customers from Shopify
     */
    public function getCustomers(Request $request)
    {
        try {
            $params = $request->only(['limit', 'page_info', 'created_at_min', 'created_at_max']);
            
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/customers.json", $params);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Failed to fetch customers'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a specific customer from Shopify
     */
    public function getCustomer($customerId)
    {
        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/customers/{$customerId}.json");

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Customer not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get products from Shopify
     */
    public function getProducts(Request $request)
    {
        try {
            $params = $request->only(['limit', 'page_info', 'vendor', 'product_type']);
            
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/products.json", $params);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Failed to fetch products'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Sync orders from Shopify to local database
     */
    public function syncOrders()
    {
        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $this->accessToken,
                'Content-Type' => 'application/json'
            ])->get("https://{$this->shopifyDomain}/admin/api/2023-10/orders.json", [
                'status' => 'any',
                'limit' => 250
            ]);

            if ($response->successful()) {
                $orders = $response->json()['orders'];
                
                // Here you would save orders to your local database
                // This is a simplified example
                foreach ($orders as $order) {
                    // Process and store order data
                    $this->processShopifyOrder($order);
                }

                return response()->json([
                    'message' => 'Orders synced successfully',
                    'count' => count($orders)
                ]);
            }

            return response()->json(['error' => 'Failed to sync orders'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle Shopify webhooks
     */
    public function handleWebhook(Request $request)
    {
        try {
            $topic = $request->header('X-Shopify-Topic');
            $data = $request->all();

            // Verify webhook authenticity
            if (!$this->verifyWebhook($request)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            switch ($topic) {
                case 'orders/create':
                    $this->processShopifyOrder($data);
                    break;
                case 'orders/updated':
                    $this->updateShopifyOrder($data);
                    break;
                case 'orders/cancelled':
                    $this->cancelShopifyOrder($data);
                    break;
                case 'customers/create':
                    $this->processShopifyCustomer($data);
                    break;
                case 'customers/update':
                    $this->updateShopifyCustomer($data);
                    break;
                default:
                    // Handle other webhook topics
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify Shopify webhook signature
     */
    private function verifyWebhook(Request $request)
    {
        $webhookSecret = config('services.shopify.webhook_secret');
        $signature = $request->header('X-Shopify-Hmac-Sha256');
        $body = $request->getContent();
        
        $calculated = base64_encode(hash_hmac('sha256', $body, $webhookSecret, true));
        
        return hash_equals($signature, $calculated);
    }

    /**
     * Process Shopify order data
     */
    private function processShopifyOrder($orderData)
    {
        // Implement logic to save/update order in your database
        // This is where you'd map Shopify order fields to your Order model
    }

    /**
     * Update Shopify order data
     */
    private function updateShopifyOrder($orderData)
    {
        // Implement logic to update existing order in your database
    }

    /**
     * Cancel Shopify order
     */
    private function cancelShopifyOrder($orderData)
    {
        // Implement logic to mark order as cancelled in your database
    }

    /**
     * Process Shopify customer data
     */
    private function processShopifyCustomer($customerData)
    {
        // Implement logic to save/update customer in your database
    }

    /**
     * Update Shopify customer data
     */
    private function updateShopifyCustomer($customerData)
    {
        // Implement logic to update existing customer in your database
    }
}
