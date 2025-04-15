
<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index()
    {
        return StockMovement::with(['product', 'user'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer',
            'type' => 'required|in:in,out',
            'reason' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $movement = StockMovement::create([
            ...$validated,
            'performed_by' => auth()->id(),
        ]);

        // Update product quantity
        $product = Product::find($validated['product_id']);
        $product->quantity += $validated['type'] === 'in' ? $validated['quantity'] : -$validated['quantity'];
        $product->save();

        return $movement->load(['product', 'user']);
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load(['product', 'user']);
    }

    public function getByProduct(Product $product)
    {
        return $product->stockMovements()->with(['user'])->latest()->get();
    }
}
