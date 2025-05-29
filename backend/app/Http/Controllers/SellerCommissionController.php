<?php

namespace App\Http\Controllers;

use App\Models\SellerCommission;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SellerCommissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SellerCommission::with(['seller', 'client']);

        // Filter by seller if provided
        if ($request->has('seller_id')) {
            $query->forSeller($request->seller_id);
        }

        // Filter by client if provided
        if ($request->has('client_id')) {
            $query->forClient($request->client_id);
        }

        // Filter by status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $commissions = $query->orderBy('created_at', 'desc')->get();

        return response()->json($commissions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|exists:sellers,id',
            'client_id' => 'required|exists:clients,id',
            'commission_tiers' => 'required|array',
            'commission_tiers.*.min_amount' => 'required|numeric|min:0',
            'commission_tiers.*.max_amount' => 'nullable|numeric|gt:commission_tiers.*.min_amount',
            'commission_tiers.*.commission_rate' => 'required|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        // Check if commission structure already exists for this seller-client combination
        $existing = SellerCommission::where('seller_id', $validated['seller_id'])
            ->where('client_id', $validated['client_id'])
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'seller_id' => ['A commission structure already exists for this seller-client combination.'],
            ]);
        }

        // Validate commission tiers structure
        $this->validateCommissionTiers($validated['commission_tiers']);

        $commission = SellerCommission::create($validated);

        return response()->json($commission->load(['seller', 'client']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SellerCommission $sellerCommission)
    {
        return response()->json($sellerCommission->load(['seller', 'client']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SellerCommission $sellerCommission)
    {
        $validated = $request->validate([
            'seller_id' => 'sometimes|required|exists:sellers,id',
            'client_id' => 'sometimes|required|exists:clients,id',
            'commission_tiers' => 'sometimes|required|array',
            'commission_tiers.*.min_amount' => 'required|numeric|min:0',
            'commission_tiers.*.max_amount' => 'nullable|numeric|gt:commission_tiers.*.min_amount',
            'commission_tiers.*.commission_rate' => 'required|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        // Check if commission structure already exists for this seller-client combination (excluding current record)
        if (isset($validated['seller_id']) || isset($validated['client_id'])) {
            $sellerId = $validated['seller_id'] ?? $sellerCommission->seller_id;
            $clientId = $validated['client_id'] ?? $sellerCommission->client_id;

            $existing = SellerCommission::where('seller_id', $sellerId)
                ->where('client_id', $clientId)
                ->where('id', '!=', $sellerCommission->id)
                ->first();

            if ($existing) {
                throw ValidationException::withMessages([
                    'seller_id' => ['A commission structure already exists for this seller-client combination.'],
                ]);
            }
        }

        // Validate commission tiers structure if provided
        if (isset($validated['commission_tiers'])) {
            $this->validateCommissionTiers($validated['commission_tiers']);
        }

        $sellerCommission->update($validated);

        return response()->json($sellerCommission->load(['seller', 'client']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SellerCommission $sellerCommission)
    {
        $sellerCommission->delete();

        return response()->json(null, 204);
    }

    /**
     * Calculate commission for a specific order amount.
     */
    public function calculateCommission(Request $request, SellerCommission $sellerCommission)
    {
        $validated = $request->validate([
            'order_amount' => 'required|numeric|min:0',
        ]);

        $commission = $sellerCommission->calculateCommission($validated['order_amount']);

        return response()->json([
            'order_amount' => $validated['order_amount'],
            'commission_amount' => $commission,
            'commission_structure' => $sellerCommission->commission_tiers,
        ]);
    }

    /**
     * Validate commission tiers structure.
     */
    private function validateCommissionTiers(array $tiers)
    {
        // Sort tiers by min_amount to validate properly
        usort($tiers, function ($a, $b) {
            return $a['min_amount'] <=> $b['min_amount'];
        });

        $previousMax = -1;

        foreach ($tiers as $index => $tier) {
            // Check if min_amount is greater than previous tier's max_amount
            if ($tier['min_amount'] <= $previousMax) {
                throw ValidationException::withMessages([
                    "commission_tiers.{$index}.min_amount" => ['Commission tiers must not overlap and should be in ascending order.'],
                ]);
            }

            // Update previous max for next iteration
            $previousMax = $tier['max_amount'] ?? PHP_INT_MAX;
        }
    }
}
