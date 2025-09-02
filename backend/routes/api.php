
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthApiController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\CustomerListController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SkuMatrixController;
use App\Http\Controllers\SkuMatrixRowController;
use App\Http\Controllers\SkuMatrixCellController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ExportImportController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\SellerCommissionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ClientOrderTemplateController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ShopifyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

// Auth routes
Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/register', [AuthApiController::class, 'register']);
Route::post('/logout', [AuthApiController::class, 'logout'])->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/low-stock', [DashboardController::class, 'getLowStockProducts']);
    Route::get('/dashboard/recent-movements', [DashboardController::class, 'getRecentMovements']);
    Route::get('/dashboard/products-by-category', [DashboardController::class, 'productsByCategory']);
    Route::get('/dashboard/stock-trend', [DashboardController::class, 'stockTrend']);
    Route::get('/dashboard/upcoming-orders', [DashboardController::class, 'upcomingOrders']);

    // Customer routes
    Route::apiResource('customers', CustomerController::class);

    // Customer Products routes
    Route::get('/customer-products', [CustomerProductController::class, 'index']);
    Route::post('/customer-products', [CustomerProductController::class, 'store']);
    Route::get('/customer-products/{customerProduct}', [CustomerProductController::class, 'show']);
    Route::put('/customer-products/{customerProduct}', [CustomerProductController::class, 'update']);
    Route::delete('/customer-products/{customerProduct}', [CustomerProductController::class, 'destroy']);
    Route::get('/customer-products/customer/{customer}', [CustomerProductController::class, 'getByCustomer']);

    // Customer Lists routes
    Route::apiResource('customer-lists', CustomerListController::class);
    Route::get('/customer-lists/customer/{customer}', [CustomerListController::class, 'getByCustomer']);

    // Order routes
    Route::apiResource('orders', OrderController::class);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Product selection routes for customer products and purchase orders
    Route::get('/products/for-selection', [CustomerProductController::class, 'getProducts']);
    Route::get('/products/sku/{sku}', [CustomerProductController::class, 'getProductBySku']);
    Route::get('customers/{customer}/products', [CustomerProductController::class, 'getByCustomer']);

    // Product routes for purchase orders
    Route::apiResource('/products', ProductController::class);
    // Product management
    Route::get('products/{product}/low-stock', [ProductController::class, 'lowStock']);
    Route::post('products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);

    // Category management
    Route::apiResource('categories', CategoryController::class);

    // Inventory management
    Route::apiResource('inventory-items', InventoryItemController::class);

    // Room routes
    Route::apiResource('rooms', RoomController::class);

    // Unit routes
    Route::apiResource('units', UnitController::class);

    // Purchase Order routes
    Route::apiResource('purchase-orders', PurchaseOrderController::class);

    // Vendor routes
    Route::apiResource('vendors', VendorController::class);

    // Warehouse management
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('units', UnitController::class);
    Route::apiResource('bins', BinController::class);

    // Stock movements
    Route::apiResource('stock-movements', StockMovementController::class);

    // SKU Matrix management
    Route::get('/sku-matrices/products', [SkuMatrixController::class, 'skuProducts']);
    Route::get('/sku-matrices', [SkuMatrixController::class, 'index']);
    Route::post('/sku-matrices', [SkuMatrixController::class, 'store']);
    Route::put('/sku-matrices/{skuMatrix}', [SkuMatrixController::class, 'update']);
    Route::apiResource('sku-matrix-rows', SkuMatrixRowController::class);
    Route::apiResource('sku-matrix-cells', SkuMatrixCellController::class);

    // Notifications
    Route::apiResource('notifications', NotificationController::class);
    Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead']);

    // Settings
    Route::apiResource('settings', SettingController::class);

    // Export/Import
    Route::post('export/{type}', [ExportImportController::class, 'export']);
    Route::post('import/{type}', [ExportImportController::class, 'import']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('dashboard/low-stock', [DashboardController::class, 'getLowStockProducts']);
    Route::get('dashboard/recent-movements', [DashboardController::class, 'getRecentMovements']);

    // Reports
    Route::apiResource('reports', ReportController::class);

    // Promotions
    Route::apiResource('promotions', PromotionController::class);

    // CRM Routes
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('sellers', SellerController::class);
    Route::apiResource('seller-commissions', SellerCommissionController::class);

    // Invoice routes with status update
    Route::apiResource('invoices', InvoiceController::class);
    Route::patch('invoices/{invoice}/status', [InvoiceController::class, 'updateStatus']);

    Route::apiResource('client-order-templates', ClientOrderTemplateController::class);

    // Stripe payment routes
    Route::post('stripe/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
    Route::post('stripe/confirm-payment', [StripeController::class, 'confirmPayment']);

    // Shopify integration routes
    Route::prefix('shopify')->group(function () {
        Route::get('orders', [ShopifyController::class, 'getOrders']);
        Route::get('orders/{orderId}', [ShopifyController::class, 'getOrder']);
        Route::get('customers', [ShopifyController::class, 'getCustomers']);
        Route::get('customers/{customerId}', [ShopifyController::class, 'getCustomer']);
        Route::get('products', [ShopifyController::class, 'getProducts']);
        Route::post('sync/orders', [ShopifyController::class, 'syncOrders']);
    });
});

// Shopify webhook routes (public, no auth required)
Route::post('shopify/webhook', [ShopifyController::class, 'handleWebhook']);
