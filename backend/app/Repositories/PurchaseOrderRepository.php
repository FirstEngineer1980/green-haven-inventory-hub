
<?php

namespace App\Repositories;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;

class PurchaseOrderRepository
{
    /**
     * Get all purchase orders with optional filters.
     */
    public function getAll(array $filters = [])
    {
        $query = PurchaseOrder::with(['vendor', 'customer', 'items']);
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }
        
        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }
        
        if (isset($filters['is_recurring'])) {
            $query->where('is_recurring', $filters['is_recurring']);
        }
        
        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }
    
    /**
     * Find a purchase order by ID.
     */
    public function findById($id)
    {
        return PurchaseOrder::with(['vendor', 'customer', 'items.product'])->findOrFail($id);
    }
    
    /**
     * Create a new purchase order.
     */
    public function create(array $data)
    {
        try {
            DB::beginTransaction();
            
            // Create the purchase order
            $purchaseOrder = PurchaseOrder::create([
                'order_number' => $data['order_number'],
                'vendor_id' => $data['vendor_id'],
                'customer_id' => $data['customer_id'] ?? null,
                'status' => $data['status'] ?? 'pending',
                'expected_delivery_date' => $data['expected_delivery_date'] ?? null,
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurring_frequency' => $data['recurring_frequency'] ?? null,
                'next_recurring_date' => $data['next_recurring_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);
            
            // Calculate total amount
            $totalAmount = 0;
            
            // Add items
            foreach ($data['items'] as $item) {
                $totalPrice = $item['quantity'] * $item['unit_price'];
                $totalAmount += $totalPrice;
                
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'] ?? null,
                    'sku' => $item['sku'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);
            }
            
            // Update the total amount
            $purchaseOrder->update(['total_amount' => $totalAmount]);
            
            DB::commit();
            
            return $purchaseOrder->fresh(['vendor', 'customer', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Update a purchase order.
     */
    public function update($id, array $data)
    {
        try {
            DB::beginTransaction();
            
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            
            // Update basic info
            $purchaseOrder->update(array_filter([
                'vendor_id' => $data['vendor_id'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'status' => $data['status'] ?? null,
                'expected_delivery_date' => $data['expected_delivery_date'] ?? null,
                'is_recurring' => $data['is_recurring'] ?? null,
                'recurring_frequency' => $data['recurring_frequency'] ?? null,
                'next_recurring_date' => $data['next_recurring_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]));
            
            // Update items if provided
            if (isset($data['items'])) {
                // Delete existing items
                $purchaseOrder->items()->delete();
                
                // Calculate new total amount
                $totalAmount = 0;
                
                // Create new items
                foreach ($data['items'] as $item) {
                    $totalPrice = $item['quantity'] * $item['unit_price'];
                    $totalAmount += $totalPrice;
                    
                    PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'product_id' => $item['product_id'] ?? null,
                        'sku' => $item['sku'],
                        'name' => $item['name'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $totalPrice,
                        'status' => 'pending',
                    ]);
                }
                
                // Update the total amount
                $purchaseOrder->update(['total_amount' => $totalAmount]);
            }
            
            DB::commit();
            
            return $purchaseOrder->fresh(['vendor', 'customer', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Delete a purchase order.
     */
    public function delete($id)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);
        return $purchaseOrder->delete();
    }
    
    /**
     * Update the status of a purchase order.
     */
    public function updateStatus($id, $status)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);
        $purchaseOrder->update(['status' => $status]);
        
        return $purchaseOrder;
    }
    
    /**
     * Receive items for a purchase order.
     */
    public function receiveItems($id, array $receivedItems)
    {
        try {
            DB::beginTransaction();
            
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            
            foreach ($receivedItems as $itemData) {
                $item = PurchaseOrderItem::findOrFail($itemData['id']);
                $receivedQty = $itemData['received_quantity'];
                
                // Update the received quantity
                $item->received_quantity = $receivedQty;
                
                // Update the status
                $item->updateReceiptStatus();
                
                // If there's a product, update its stock
                if ($item->product_id) {
                    $product = $item->product;
                    $product->increment('quantity', $receivedQty);
                    
                    // Create stock movement record
                    StockMovement::create([
                        'product_id' => $product->id,
                        'quantity' => $receivedQty,
                        'type' => 'in',
                        'reference_id' => $purchaseOrder->id,
                        'reference_type' => 'purchase_order',
                        'notes' => "Received from PO #{$purchaseOrder->order_number}",
                    ]);
                }
            }
            
            // Check if all items are received
            $allReceived = $purchaseOrder->items()->where('status', '!=', 'received')->count() === 0;
            
            if ($allReceived) {
                $purchaseOrder->update([
                    'status' => 'received',
                    'delivery_date' => now(),
                ]);
            } else {
                $purchaseOrder->update(['status' => 'partial']);
            }
            
            DB::commit();
            
            return $purchaseOrder->fresh(['vendor', 'customer', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Get all purchase orders due for recurring.
     */
    public function getDueForRecurring()
    {
        return PurchaseOrder::dueForRecurring()->get();
    }
    
    /**
     * Generate a recurring purchase order.
     */
    public function generateRecurringOrder(PurchaseOrder $original)
    {
        try {
            DB::beginTransaction();
            
            // Create a new purchase order
            $newPO = $original->replicate(['status', 'delivery_date', 'expected_delivery_date']);
            $newPO->order_number = 'PO-' . date('Ymd') . '-' . uniqid();
            $newPO->status = 'pending';
            $newPO->expected_delivery_date = now()->addDays(7);
            $newPO->save();
            
            // Clone items
            foreach ($original->items as $item) {
                $newItem = $item->replicate(['purchase_order_id', 'received_quantity', 'status']);
                $newItem->purchase_order_id = $newPO->id;
                $newItem->received_quantity = 0;
                $newItem->status = 'pending';
                $newItem->save();
            }
            
            // Update next recurring date
            $frequency = $original->recurring_frequency ?: 'weekly';
            $nextDate = null;
            
            switch ($frequency) {
                case 'weekly':
                    $nextDate = now()->addWeek();
                    break;
                case 'biweekly':
                    $nextDate = now()->addWeeks(2);
                    break;
                case 'monthly':
                    $nextDate = now()->addMonth();
                    break;
                default:
                    $nextDate = now()->addWeek();
            }
            
            $original->update(['next_recurring_date' => $nextDate]);
            
            DB::commit();
            
            return $newPO->fresh(['vendor', 'customer', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
