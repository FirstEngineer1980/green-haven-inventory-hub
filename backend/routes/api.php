<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BinController;
use App\Http\Controllers\SkuMatrixController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerListController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\PromotionController;

// Middleware group for authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Protected routes go here
    Route::apiResource('users', UserController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('units', UnitController::class);
    Route::apiResource('customer-products', CustomerProductController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('bins', BinController::class);
    Route::apiResource('sku-matrices', SkuMatrixController::class);
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    Route::apiResource('vendors', VendorController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('customer-lists', CustomerListController::class);
    Route::apiResource('stock-movements', StockMovementController::class);
    
    // Promotion routes
    Route::apiResource('promotions', PromotionController::class);
    Route::get('/active-promotions', [PromotionController::class, 'getActivePromotions']);
    Route::get('/promoted-products', [PromotionController::class, 'getPromotedProducts']);
    Route::patch('/promotions/{id}/toggle-active', [PromotionController::class, 'toggleActive']);
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Stripe routes
Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
Route::post('/webhook/stripe', [StripeController::class, 'handleWebhook']);
Route::post('/success', [StripeController::class, 'handleSuccess']);

// Public promotion routes
Route::get('/public/promotions', [PromotionController::class, 'getActivePromotions']);
Route::get('/public/promoted-products', [PromotionController::class, 'getPromotedProducts']);
