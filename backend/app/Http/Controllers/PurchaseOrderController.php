<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Services\PurchaseOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PurchaseOrderController extends Controller
{
    protected $purchaseOrderService;

    public function __construct(PurchaseOrderService $purchaseOrderService)
    {
        $this->purchaseOrderService = $purchaseOrderService;

        // Add middleware to check permissions using Laravel 11 syntax
        $this->middleware('permission:view purchase orders')->only(['index', 'show']);
        $this->middleware('permission:create purchase orders')->only(['store']);
        $this->middleware('permission:edit purchase orders')->only(['update', 'updateStatus']);
        $this->middleware('permission:delete purchase orders')->only(['destroy']);
        $this->middleware('permission:receive purchase orders')->only(['receiveItems']);
    }

    /**
     * Display a listing of purchase orders.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['vendor_id', 'customer_id', 'status', 'is_recurring', 'per_page']);

        $purchaseOrders = $this->purchaseOrderService->getAllPurchaseOrders($filters);

        return response()->json($purchaseOrders);
    }

    /**
     * Store a newly created purchase order.
     */
    public function store(Request $request)
    {
        try {
            $purchaseOrder = $this->purchaseOrderService->createPurchaseOrder($request->all());

            // Log activity
            activity()
                ->performedOn($purchaseOrder)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip()])
                ->log('Created purchase order');

            return response()->json($purchaseOrder, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create purchase order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified purchase order.
     */
    public function show(string $id)
    {
        try {
            $purchaseOrder = $this->purchaseOrderService->getPurchaseOrder($id);

            return response()->json($purchaseOrder);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Purchase order not found'], 404);
        }
    }

    /**
     * Update the specified purchase order.
     */
    public function update(Request $request, string $id)
    {
        try {
            $purchaseOrder = $this->purchaseOrderService->updatePurchaseOrder($id, $request->all());

            // Log activity
            activity()
                ->performedOn($purchaseOrder)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip()])
                ->log('Updated purchase order');

            return response()->json($purchaseOrder);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update purchase order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified purchase order.
     */
    public function destroy(string $id)
    {
        try {
            $this->purchaseOrderService->deletePurchaseOrder($id);

            // Log activity
            activity()
                ->causedBy(Auth::user())
                ->withProperties(['ip' => request()->ip(), 'purchase_order_id' => $id])
                ->log('Deleted purchase order');

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete purchase order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the status of a purchase order.
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $purchaseOrder = $this->purchaseOrderService->updatePurchaseOrderStatus($id, $request->status);

            // Log activity
            activity()
                ->performedOn($purchaseOrder)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip(), 'status' => $request->status])
                ->log('Updated purchase order status');

            return response()->json($purchaseOrder);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update purchase order status', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Receive items for a purchase order.
     */
    public function receiveItems(Request $request, string $id)
    {
        try {
            $purchaseOrder = $this->purchaseOrderService->receivePurchaseOrderItems($id, $request->items);

            // Log activity
            activity()
                ->performedOn($purchaseOrder)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip()])
                ->log('Received items for purchase order');

            return response()->json($purchaseOrder);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to receive items', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Process recurring purchase orders.
     */
    public function processRecurring()
    {
        try {
            $processedOrders = $this->purchaseOrderService->processRecurringOrders();

            return response()->json([
                'message' => count($processedOrders) . ' recurring orders processed',
                'orders' => $processedOrders
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to process recurring orders', 'error' => $e->getMessage()], 500);
        }
    }
}
