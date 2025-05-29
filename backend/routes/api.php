<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthApiController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\CustomerListController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SkuMatrixController;
use App\Http\Controllers\SkuMatrixRowController;
use App\Http\Controllers\SkuMatrixCellController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientOrderTemplateController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SellerCommissionController;
use App\Http\Controllers\ExportImportController;
use App\Http\Controllers\InvoiceController;

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
Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/register', [AuthApiController::class, 'register']);

// CSRF cookie route for SPA
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Protected routes using Passport
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthApiController::class, 'logout']);
    Route::get('/user', [AuthApiController::class, 'user']);
    Route::get('/user/current', [AuthApiController::class, 'user']);
    Route::put('/user/profile', [AuthApiController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Export/Import routes
    Route::get('/export/{type}', [ExportImportController::class, 'export']);
    Route::post('/import/{type}', [ExportImportController::class, 'import']);
    Route::get('/export-logs', [ExportImportController::class, 'exportLogs']);

    // Products
    Route::apiResource('products', ProductController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Customers
    Route::apiResource('customers', CustomerController::class);

    // Customer Products
    Route::apiResource('customer-products', CustomerProductController::class);

    // Customer Lists
    Route::apiResource('customer-lists', CustomerListController::class);

    // Rooms
    Route::apiResource('rooms', RoomController::class);

    // Units
    Route::apiResource('units', UnitController::class);

    // Purchase Orders
    Route::apiResource('purchase-orders', PurchaseOrderController::class);

    // Vendors
    Route::apiResource('vendors', VendorController::class);

    // Bins
    Route::apiResource('bins', BinController::class);

    // Inventory Items
    Route::apiResource('inventory-items', InventoryItemController::class);

    // Stock Movements
    Route::apiResource('stock-movements', StockMovementController::class);

    // SKU Matrix
    Route::apiResource('sku-matrices', SkuMatrixController::class);
    Route::apiResource('sku-matrix-rows', SkuMatrixRowController::class);
    Route::apiResource('sku-matrix-cells', SkuMatrixCellController::class);

    // Client Order Templates
    Route::apiResource('client-order-templates', ClientOrderTemplateController::class);

    // Notifications
    Route::apiResource('notifications', NotificationController::class);

    // Reports
    Route::apiResource('reports', ReportController::class);

    // Promotions
    Route::apiResource('promotions', PromotionController::class);

    // Users
    Route::apiResource('users', UserController::class);

    // Settings
    Route::apiResource('settings', SettingController::class);

    // CRM Routes
    Route::apiResource('sellers', SellerController::class);
    Route::apiResource('clients', ClientController::class);

    // Seller Commission Routes
    Route::apiResource('seller-commissions', SellerCommissionController::class);
    Route::post('seller-commissions/{sellerCommission}/calculate', [SellerCommissionController::class, 'calculateCommission']);

    // Invoice Routes
    Route::apiResource('invoices', InvoiceController::class);
    Route::patch('invoices/{invoice}/status', [InvoiceController::class, 'updateStatus']);
});
