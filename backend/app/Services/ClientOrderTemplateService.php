<?php

namespace App\Services;

use App\Repositories\ClientOrderTemplateRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ClientOrderTemplateService
{
    protected $templateRepository;

    public function __construct(ClientOrderTemplateRepository $templateRepository)
    {
        $this->templateRepository = $templateRepository;
    }

    /**
     * Get all templates with optional filters.
     */
    public function getAllTemplates(array $filters = [])
    {
        return $this->templateRepository->getAll($filters);
    }

    /**
     * Get a template by ID.
     */
    public function getTemplate($id)
    {
        return $this->templateRepository->findById($id);
    }

    /**
     * Create a new template.
     */
    public function createTemplate(array $data)
    {
        $validator = Validator::make($data, [
            'customer_id' => 'required|exists:customers,id',
            'name' => 'required|string|max:255',
            'frequency' => 'nullable|string|in:weekly,biweekly,monthly',
            'next_order_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->templateRepository->create($data);
    }

    /**
     * Update a template.
     */
    public function updateTemplate($id, array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|in:weekly,biweekly,monthly',
            'next_order_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string',
            'items' => 'nullable|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->templateRepository->update($id, $data);
    }

    /**
     * Delete a template.
     */
    public function deleteTemplate($id)
    {
        return $this->templateRepository->delete($id);
    }

    /**
     * Process due templates and create orders.
     */
    public function processTemplates()
    {
        return $this->templateRepository->createOrdersFromDueTemplates();
    }

    /**
     * Get templates due for ordering.
     */
    public function getDueTemplates()
    {
        return $this->templateRepository->getDueForOrdering();
    }

    /**
     * Create an order from a specific template.
     */
    public function createOrderFromTemplate($id)
    {
        $template = $this->templateRepository->findById($id);
        return $template->createPurchaseOrder();
    }
}
