<?php

namespace App\Repositories;

use App\Models\ClientOrderTemplate;
use App\Models\ClientOrderTemplateItem;
use Illuminate\Support\Facades\DB;

class ClientOrderTemplateRepository
{
    /**
     * Get all templates with optional filters.
     */
    public function getAll(array $filters = [])
    {
        $query = ClientOrderTemplate::with(['customer', 'items.product']);

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Find a template by ID.
     */
    public function findById($id)
    {
        return ClientOrderTemplate::with(['customer', 'items.product'])->findOrFail($id);
    }

    /**
     * Create a new template.
     */
    public function create(array $data)
    {
        try {
            DB::beginTransaction();

            // Create the template
            $template = ClientOrderTemplate::create([
                'customer_id' => $data['customer_id'],
                'name' => $data['name'],
                'frequency' => $data['frequency'] ?? 'weekly',
                'next_order_date' => $data['next_order_date'] ?? now(),
                'is_active' => $data['is_active'] ?? true,
                'notes' => $data['notes'] ?? null,
            ]);

            // Add items
            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    ClientOrderTemplateItem::create([
                        'client_order_template_id' => $template->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'] ?? 1,
                        'is_active' => $item['is_active'] ?? true,
                    ]);
                }
            }

            DB::commit();

            return $template->fresh(['customer', 'items.product']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a template.
     */
    public function update($id, array $data)
    {
        try {
            DB::beginTransaction();

            $template = ClientOrderTemplate::findOrFail($id);

            // Update basic info
            $template->update(array_filter([
                'name' => $data['name'] ?? null,
                'frequency' => $data['frequency'] ?? null,
                'next_order_date' => $data['next_order_date'] ?? null,
                'is_active' => $data['is_active'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]));

            // Update items if provided
            if (isset($data['items'])) {
                // Delete existing items
                $template->items()->delete();

                // Create new items
                foreach ($data['items'] as $item) {
                    ClientOrderTemplateItem::create([
                        'client_order_template_id' => $template->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'] ?? 1,
                        'is_active' => $item['is_active'] ?? true,
                    ]);
                }
            }

            DB::commit();

            return $template->fresh(['customer', 'items.product']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a template.
     */
    public function delete($id)
    {
        $template = ClientOrderTemplate::findOrFail($id);
        return $template->delete();
    }

    /**
     * Get all templates due for ordering.
     */
    public function getDueForOrdering()
    {
        return ClientOrderTemplate::where('is_active', true)
            ->whereDate('next_order_date', '<=', now())
            ->with(['customer', 'items.product'])
            ->get();
    }

    /**
     * Create purchase orders from due templates.
     */
    public function createOrdersFromDueTemplates()
    {
        $dueTemplates = $this->getDueForOrdering();
        $createdOrders = [];

        foreach ($dueTemplates as $template) {
            $order = $template->createPurchaseOrder();
            if ($order) {
                $createdOrders[] = $order;
            }
        }

        return $createdOrders;
    }
}
