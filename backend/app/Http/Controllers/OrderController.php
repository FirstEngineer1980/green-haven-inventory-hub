<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Order::with(['customer', 'items', 'creator']);

            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Search by order number or customer name
            if ($request->has('search') && $request->search) {
                $query->where(function($q) use ($request) {
                    $q->where('order_number', 'like', '%' . $request->search . '%')
                      ->orWhereHas('customer', function($customerQuery) use ($request) {
                          $customerQuery->where('name', 'like', '%' . $request->search . '%');
                      });
                });
            }

            $orders = $query->orderBy('created_at', 'desc')->get();
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'status' => 'required|in:draft,processing,shipped,delivered,cancelled',
                'order_date' => 'required|date',
                'delivery_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.product_name' => 'required|string',
                'items.*.product_sku' => 'nullable|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Generate order number
            $orderNumber = 'ORD-' . date('Y') . '-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT);

            // Calculate total amount
            $totalAmount = collect($validated['items'])->sum(function($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_id' => $validated['customer_id'],
                'status' => $validated['status'],
                'total_amount' => $totalAmount,
                'order_date' => $validated['order_date'],
                'delivery_date' => $validated['delivery_date'],
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            // Create order items
            foreach ($validated['items'] as $itemData) {
                $totalPrice = $itemData['quantity'] * $itemData['unit_price'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $itemData['product_name'],
                    'product_sku' => $itemData['product_sku'] ?? null,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $totalPrice,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            DB::commit();

            $order->load(['customer', 'items', 'creator']);
            return response()->json($order, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        try {
            $order->load(['customer', 'items', 'creator']);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'sometimes|required|exists:customers,id',
                'status' => 'sometimes|required|in:draft,processing,shipped,delivered,cancelled',
                'order_date' => 'sometimes|required|date',
                'delivery_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'items' => 'sometimes|required|array|min:1',
                'items.*.id' => 'nullable|exists:order_items,id',
                'items.*.product_name' => 'required_with:items|string',
                'items.*.product_sku' => 'nullable|string',
                'items.*.quantity' => 'required_with:items|integer|min:1',
                'items.*.unit_price' => 'required_with:items|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Update items if provided
            if (isset($validated['items'])) {
                // Delete existing items
                $order->items()->delete();

                // Create new items and calculate total
                $totalAmount = 0;
                foreach ($validated['items'] as $itemData) {
                    $totalPrice = $itemData['quantity'] * $itemData['unit_price'];
                    $totalAmount += $totalPrice;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_name' => $itemData['product_name'],
                        'product_sku' => $itemData['product_sku'] ?? null,
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'total_price' => $totalPrice,
                        'notes' => $itemData['notes'] ?? null,
                    ]);
                }
                $validated['total_amount'] = $totalAmount;
            }

            $order->update($validated);
            DB::commit();

            $order->load(['customer', 'items', 'creator']);
            return response()->json($order);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update order'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        try {
            $order->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete order'], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:draft,processing,shipped,delivered,cancelled'
            ]);

            $order->update(['status' => $validated['status']]);
            $order->load(['customer', 'items', 'creator']);

            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update order status'], 500);
        }
    }
}
