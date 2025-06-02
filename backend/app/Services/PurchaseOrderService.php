
<?php

namespace App\Services;

use App\Repositories\PurchaseOrderRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PurchaseOrderService
{
    protected $purchaseOrderRepository;

    public function __construct(PurchaseOrderRepository $purchaseOrderRepository)
    {
        $this->purchaseOrderRepository = $purchaseOrderRepository;
    }

    /**
     * Get all purchase orders with optional filters.
     */
    public function getAllPurchaseOrders(array $filters = [])
    {
        return $this->purchaseOrderRepository->getAll($filters);
    }

    /**
     * Get a purchase order by ID.
     */
    public function getPurchaseOrder($id)
    {
        return $this->purchaseOrderRepository->findById($id);
    }

    /**
     * Create a new purchase order.
     */
    public function createPurchaseOrder(array $data)
    {
        $validator = Validator::make($data, [
            'order_number' => 'required|string|max:50|unique:purchase_orders',
            'vendor_id' => 'required|exists:vendors,id',
            'customer_id' => 'nullable|exists:customers,id',
            'status' => 'nullable|string|in:pending,approved,shipped,delivered,cancelled',
            'expected_delivery_date' => 'nullable|date',
            'is_recurring' => 'nullable|boolean',
            'recurring_frequency' => 'nullable|required_if:is_recurring,true|in:weekly,biweekly,monthly',
            'next_recurring_date' => 'nullable|required_if:is_recurring,true|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.sku' => 'required|string|max:50',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.product_id' => 'nullable|exists:products,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->purchaseOrderRepository->create($data);
    }

    /**
     * Update a purchase order.
     */
    public function updatePurchaseOrder($id, array $data)
    {
        $validator = Validator::make($data, [
            'order_number' => "nullable|string|max:50|unique:purchase_orders,order_number,{$id}",
            'vendor_id' => 'nullable|exists:vendors,id',
            'customer_id' => 'nullable|exists:customers,id',
            'status' => 'nullable|string|in:pending,approved,shipped,delivered,cancelled',
            'expected_delivery_date' => 'nullable|date',
            'is_recurring' => 'nullable|boolean',
            'recurring_frequency' => 'nullable|in:weekly,biweekly,monthly',
            'next_recurring_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'nullable|array|min:1',
            'items.*.sku' => 'required|string|max:50',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.product_id' => 'nullable|exists:products,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->purchaseOrderRepository->update($id, $data);
    }

    /**
     * Delete a purchase order.
     */
    public function deletePurchaseOrder($id)
    {
        return $this->purchaseOrderRepository->delete($id);
    }

    /**
     * Update the status of a purchase order.
     */
    public function updatePurchaseOrderStatus($id, $status)
    {
        $validator = Validator::make(['status' => $status], [
            'status' => 'required|string|in:pending,approved,shipped,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->purchaseOrderRepository->updateStatus($id, $status);
    }

    /**
     * Receive items for a purchase order.
     */
    public function receivePurchaseOrderItems($id, array $receivedItems)
    {
        $validator = Validator::make(['items' => $receivedItems], [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:purchase_order_items,id',
            'items.*.received_quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->purchaseOrderRepository->receiveItems($id, $receivedItems);
    }

    /**
     * Process recurring purchase orders.
     */
    public function processRecurringOrders()
    {
        $dueOrders = $this->purchaseOrderRepository->getDueForRecurring();
        $processedOrders = [];

        foreach ($dueOrders as $order) {
            $newOrder = $this->purchaseOrderRepository->generateRecurringOrder($order);
            $processedOrders[] = $newOrder;
        }

        return $processedOrders;
    }
}
