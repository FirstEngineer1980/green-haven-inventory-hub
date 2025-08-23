<?php

namespace App\Http\Controllers;

use App\Models\ClinicLocation;
use App\Models\Customer;
use Illuminate\Http\Request;

class ClinicLocationController extends Controller
{
    /**
     * Display a listing of clinic locations.
     */
    public function index(Request $request)
    {
        $query = ClinicLocation::with('customer');

        // Filter by customer if provided
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $locations = $query->orderBy('created_at', 'desc')->get();

        return response()->json($locations);
    }

    /**
     * Store a newly created clinic location.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string',
            'customer_id' => 'required|exists:customers,id',
        ]);

        $location = ClinicLocation::create($validated);
        $location->load('customer');

        return response()->json($location, 201);
    }

    /**
     * Display the specified clinic location.
     */
    public function show(ClinicLocation $clinicLocation)
    {
        $clinicLocation->load([
            'customer',
            'rooms.units',
            'skuMatrices',
            'bins',
        ]);

        return response()->json($clinicLocation);
    }

    /**
     * Update the specified clinic location.
     */
    public function update(Request $request, ClinicLocation $clinicLocation)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_person' => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string',
            'customer_id' => 'sometimes|required|exists:customers,id',
        ]);

        $clinicLocation->update($validated);
        $clinicLocation->load('customer');

        return response()->json($clinicLocation);
    }

    /**
     * Remove the specified clinic location.
     */
    public function destroy(ClinicLocation $clinicLocation)
    {
        $clinicLocation->delete();
        return response()->json(null, 204);
    }

    /**
     * Get locations for a specific customer.
     */
    public function getByCustomer(Customer $customer)
    {
        $locations = $customer->clinicLocations()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($locations);
    }
}