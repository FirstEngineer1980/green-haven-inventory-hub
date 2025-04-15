<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Imports\ClientsImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get customers based on authenticated user (implement auth check)
        $customers = Customer::with('user')->get();
        
        return response()->json($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        // Load relationships if needed
        $customer->load(['customerProducts', 'rooms']);
        
        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'user_id' => 'sometimes|required|exists:users,id',
        ]);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json(null, 204);
    }

    /**
     * Import customers from Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240', // max 10MB
        ]);

        try {
            Excel::import(new ClientsImport, $request->file('file'));

            return response()->json([
                'message' => 'Customers imported successfully'
            ], 200);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->failures()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
