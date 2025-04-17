<?php

namespace App\Http\Controllers;

use App\Models\CustomerList;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CustomerList::query()->with('customer');

        // Filter by customer_id if provided
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $lists = $query->get();

        return response()->json($lists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50',
            'quantity' => 'required|string',
            'description' => 'nullable|string',
            'picture' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $list = CustomerList::create($validated);

        return response()->json($list, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerList $customerList)
    {
        $customerList->load('customer');

        return response()->json($customerList);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomerList $customerList)
    {
        $validated = $request->validate([
            'customer_id' => 'sometimes|required|exists:customers,id',
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'sometimes|required|string|max:50',
            'quantity' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'picture' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $customerList->update($validated);

        return response()->json($customerList);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerList $customerList)
    {
        $customerList->delete();

        return response()->json(null, 204);
    }

    /**
     * Get lists for a specific customer.
     */
    public function getByCustomer(Customer $customer)
    {
        $lists = $customer->lists;

        return response()->json($lists);
    }
}
