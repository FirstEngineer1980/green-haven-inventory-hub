
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthApiController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth routes
Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/register', [AuthApiController::class, 'register']);
Route::post('/logout', [AuthApiController::class, 'logout'])->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
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
    
    // Product selection routes for customer products and purchase orders
    Route::get('/products/for-selection', [CustomerProductController::class, 'getProducts']);
    Route::get('/products/sku/{sku}', [CustomerProductController::class, 'getProductBySku']);
    
    // Product routes for purchase orders
    Route::get('/products', [ProductController::class, 'index']);
    
    // Room routes
    Route::apiResource('rooms', RoomController::class);
    
    // Unit routes
    Route::apiResource('units', UnitController::class);
    
    // Purchase Order routes
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    
    // Vendor routes
    Route::apiResource('vendors', VendorController::class);
});
