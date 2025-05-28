
<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sellers = Seller::with('leader', 'clients')->get();
        
        return response()->json($sellers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:sellers,email',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'leader_id' => 'nullable|exists:users,id',
        ]);

        $seller = Seller::create($validated);

        return response()->json($seller->load('leader'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Seller $seller)
    {
        return response()->json($seller->load('leader', 'clients'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seller $seller)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:sellers,email,' . $seller->id,
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'leader_id' => 'nullable|exists:users,id',
        ]);

        $seller->update($validated);

        return response()->json($seller->load('leader'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seller $seller)
    {
        $seller->delete();

        return response()->json(null, 204);
    }
}
