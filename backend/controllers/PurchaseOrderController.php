
<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PurchaseOrder::with('vendor');
        
        // Filter by vendor_id if provided
        if ($request->has('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $purchaseOrders = $query->get();
        
        return response()->json($purchaseOrders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_number' => 'required|string|max:50|unique:purchase_orders',
            'vendor_id' => 'required|exists:vendors,id',
            'status' => 'required|string|in:pending,approved,shipped,delivered,cancelled',
            'expected_delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.sku' => 'required|string|max:50',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();
            
            // Calculate total amount from items
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }
            
            // Create purchase order
            $purchaseOrder = PurchaseOrder::create([
                'order_number' => $validated['order_number'],
                'vendor_id' => $validated['vendor_id'],
                'status' => $validated['status'],
                'total_amount' => $totalAmount,
                'expected_delivery_date' => $validated['expected_delivery_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);
            
            // Create purchase order items
            foreach ($validated['items'] as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'sku' => $item['sku'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }
            
            DB::commit();
            
            // Load relationships for the response
            $purchaseOrder->load(['vendor', 'items']);
            
            return response()->json($purchaseOrder, 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create purchase order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['vendor', 'items']);
        
        return response()->json($purchaseOrder);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'order_number' => 'sometimes|required|string|max:50|unique:purchase_orders,order_number,' . $purchaseOrder->id,
            'vendor_id' => 'sometimes|required|exists:vendors,id',
            'status' => 'sometimes|required|string|in:pending,approved,shipped,delivered,cancelled',
            'expected_delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'sometimes|required|array|min:1',
            'items.*.id' => 'nullable|exists:purchase_order_items,id',
            'items.*.sku' => 'required|string|max:50',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();
            
            // Update purchase order basic info
            if (isset($validated['order_number']) || isset($validated['vendor_id']) || 
                isset($validated['status']) || isset($validated['expected_delivery_date']) || 
                isset($validated['notes'])) {
                
                $updateData = array_filter($validated, function($key) {
                    return in_array($key, ['order_number', 'vendor_id', 'status', 'expected_delivery_date', 'notes']);
                }, ARRAY_FILTER_USE_KEY);
                
                $purchaseOrder->update($updateData);
            }
            
            // Update items if provided
            if (isset($validated['items'])) {
                // Delete existing items
                $purchaseOrder->items()->delete();
                
                // Calculate new total amount
                $totalAmount = 0;
                
                // Create new items
                foreach ($validated['items'] as $item) {
                    $totalPrice = $item['quantity'] * $item['unit_price'];
                    $totalAmount += $totalPrice;
                    
                    PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'sku' => $item['sku'],
                        'name' => $item['name'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $totalPrice,
                    ]);
                }
                
                // Update the total amount
                $purchaseOrder->update(['total_amount' => $totalAmount]);
            }
            
            DB::commit();
            
            // Load relationships for the response
            $purchaseOrder->load(['vendor', 'items']);
            
            return response()->json($purchaseOrder);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update purchase order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();

        return response()->json(null, 204);
    }
    
    /**
     * Update the status of a purchase order.
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,approved,shipped,delivered,cancelled',
        ]);

        $purchaseOrder->update(['status' => $validated['status']]);

        return response()->json($purchaseOrder);
    }
}
