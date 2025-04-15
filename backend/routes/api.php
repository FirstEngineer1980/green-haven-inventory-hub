
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\CustomerListController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ClientOrderTemplateController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\SkuMatrixController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailLogController;

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

// Public routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('users', UserController::class);

    // Customer routes
    Route::post('/customers/import', [CustomerController::class, 'import']);
    Route::apiResource('customers', CustomerController::class);

    // Customer Product routes
    Route::apiResource('customer-products', CustomerProductController::class);
    Route::get('/customers/{customer}/products', [CustomerProductController::class, 'getByCustomer']);

    // Customer List routes
    Route::apiResource('customer-lists', CustomerListController::class);
    Route::get('/customers/{customer}/lists', [CustomerListController::class, 'getByCustomer']);

    // Room routes
    Route::apiResource('rooms', RoomController::class);
    Route::get('/customers/{customer}/rooms', [RoomController::class, 'getByCustomer']);

    // Unit routes
    Route::apiResource('units', UnitController::class);
    Route::get('/rooms/{room}/units', [UnitController::class, 'getByRoom']);

    // Vendor routes
    Route::apiResource('vendors', VendorController::class);

    // Purchase Order routes
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    Route::patch('/purchase-orders/{purchaseOrder}/status', [PurchaseOrderController::class, 'updateStatus']);
    Route::post('/purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receiveItems']);
    Route::get('/vendors/{vendor}/purchase-orders', [PurchaseOrderController::class, 'getByVendor']);
    Route::post('/purchase-orders/process-recurring', [PurchaseOrderController::class, 'processRecurring']);

    // Client Order Template routes
    Route::apiResource('client-order-templates', ClientOrderTemplateController::class);
    Route::get('/customers/{customer}/order-templates', [ClientOrderTemplateController::class, 'getByCustomer']);
    Route::post('/client-order-templates/process', [ClientOrderTemplateController::class, 'processTemplates']);
    Route::get('/client-order-templates/due', [ClientOrderTemplateController::class, 'getDueTemplates']);
    Route::post('/client-order-templates/{clientOrderTemplate}/create-order', [ClientOrderTemplateController::class, 'createOrder']);

    // Product routes
    Route::apiResource('products', ProductController::class);
    Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
    Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);

    // Category routes
    Route::apiResource('categories', CategoryController::class);
    Route::get('/categories/{category}/products', [CategoryController::class, 'getProducts']);

    // Stock Movement routes
    Route::apiResource('stock-movements', StockMovementController::class);
    Route::get('/products/{product}/stock-movements', [StockMovementController::class, 'getByProduct']);

    // Inventory Item routes
    Route::apiResource('inventory-items', InventoryItemController::class);
    Route::get('/units/{unit}/inventory', [InventoryItemController::class, 'getByUnit']);
    Route::get('/products/{product}/inventory', [InventoryItemController::class, 'getByProduct']);

    // Bin routes
    Route::apiResource('bins', BinController::class);

    // SKU Matrix routes
    Route::apiResource('sku-matrices', SkuMatrixController::class);
    Route::get('/rooms/{room}/sku-matrices', [SkuMatrixController::class, 'getByRoom']);
    Route::apiResource('sku-matrix-rows', 'SkuMatrixRowController');
    Route::apiResource('sku-matrix-cells', 'SkuMatrixCellController');

    // Setting routes
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/settings/{key}', [SettingController::class, 'show']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::put('/settings/{key}', [SettingController::class, 'update']);
    Route::delete('/settings/{key}', [SettingController::class, 'destroy']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Report routes
    Route::apiResource('reports', ReportController::class);
    Route::post('/reports/{report}/generate', [ReportController::class, 'generate']);

    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/low-stock', [DashboardController::class, 'lowStock']);
    Route::get('/dashboard/recent-movements', [DashboardController::class, 'recentMovements']);
    Route::get('/dashboard/products-by-category', [DashboardController::class, 'productsByCategory']);
    Route::get('/dashboard/stock-trend', [DashboardController::class, 'stockTrend']);
    Route::get('/dashboard/upcoming-orders', [DashboardController::class, 'upcomingOrders']);
    
    // Email Log routes
    Route::get('/email-logs', [EmailLogController::class, 'index']);
    Route::get('/email-logs/{emailLog}', [EmailLogController::class, 'show']);
    Route::delete('/email-logs/{emailLog}', [EmailLogController::class, 'destroy']);
    Route::delete('/email-logs', [EmailLogController::class, 'clearAll']);
});
