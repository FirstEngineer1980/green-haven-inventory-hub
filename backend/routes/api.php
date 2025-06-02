
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SkuMatrixController;
use App\Http\Controllers\SkuMatrixRowController;
use App\Http\Controllers\SkuMatrixCellController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ExportImportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\SellerCommissionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ClientOrderTemplateController;
use App\Http\Controllers\StripeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/register', [AuthApiController::class, 'register']);
Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/logout', [AuthApiController::class, 'logout'])->middleware('auth:api');
Route::get('/user', [AuthApiController::class, 'user'])->middleware('auth:api');

// Protected routes
Route::middleware('auth:api')->group(function () {
    // User management
    Route::apiResource('users', UserController::class);
    
    // Customer management
    Route::apiResource('customers', CustomerController::class);
    
    // Customer Products management
    Route::apiResource('customer-products', CustomerProductController::class);
    Route::get('customer-products/products', [CustomerProductController::class, 'getProducts']);
    Route::get('customer-products/product-by-sku/{sku}', [CustomerProductController::class, 'getProductBySku']);
    Route::get('customers/{customer}/products', [CustomerProductController::class, 'getByCustomer']);
    
    // Product management
    Route::apiResource('products', ProductController::class);
    Route::get('products/{product}/low-stock', [ProductController::class, 'lowStock']);
    Route::post('products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);
    
    // Category management
    Route::apiResource('categories', CategoryController::class);
    
    // Inventory management
    Route::apiResource('inventory-items', InventoryItemController::class);
    
    // Purchase Orders
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    
    // Vendors
    Route::apiResource('vendors', VendorController::class);
    
    // Warehouse management
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('units', UnitController::class);
    Route::apiResource('bins', BinController::class);
    
    // Stock movements
    Route::apiResource('stock-movements', StockMovementController::class);
    
    // SKU Matrix management
    Route::apiResource('sku-matrices', SkuMatrixController::class);
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
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('client-order-templates', ClientOrderTemplateController::class);
    
    // Stripe payment routes
    Route::post('stripe/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
    Route::post('stripe/confirm-payment', [StripeController::class, 'confirmPayment']);
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
