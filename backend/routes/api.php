
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
    Route::apiResource('customers', CustomerController::class);
    
    // Customer Product routes
    Route::apiResource('customer-products', CustomerProductController::class);
    Route::get('/customers/{customer}/products', [CustomerProductController::class, 'getByCustomer']);
    
    // Customer List routes
    Route::apiResource('customer-lists', CustomerListController::class);
    Route::get('/customers/{customer}/lists', [CustomerListController::class, 'getByCustomer']);
    
    // Room routes
    Route::apiResource('rooms', RoomController::class);
    
    // Unit routes
    Route::apiResource('units', UnitController::class);
    
    // Vendor routes
    Route::apiResource('vendors', VendorController::class);
    
    // Purchase Order routes
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    Route::patch('/purchase-orders/{purchaseOrder}/status', [PurchaseOrderController::class, 'updateStatus']);
});
