
<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockMovementController extends Controller
{
    public function index()
    {
        return StockMovement::with(['product', 'performer'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:in,out',
            'reason' => 'required|string',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'notes' => 'nullable|string',
        ]);

        // Add the current user as performer
        $data['performed_by'] = Auth::id();

        $stockMovement = StockMovement::create($data);

        // Update product quantity
        $product = Product::findOrFail($request->product_id);
        $newQuantity = $request->type === 'in'
            ? $product->quantity + $request->quantity
            : $product->quantity - $request->quantity;
        
        $product->update(['quantity' => max(0, $newQuantity)]);

        return $stockMovement->load(['product', 'performer']);
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load(['product', 'performer']);
    }

    public function getByProduct(Product $product)
    {
        return $product->stockMovements()->with('performer')->get();
    }
}
