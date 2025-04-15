
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['category', 'vendors'])->get();
    }

    public function store(Request $request)
    {
        $product = Product::create($request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'threshold' => 'required|integer|min:0',
            'location' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'string|in:active,inactive',
            'barcode' => 'nullable|string',
            'weight' => 'nullable|string',
            'dimensions' => 'nullable|string',
        ]));

        return $product->load('category');
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'vendors', 'inventoryItems']);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->validate([
            'name' => 'string|max:255',
            'sku' => 'string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'numeric|min:0',
            'cost_price' => 'numeric|min:0',
            'quantity' => 'integer|min:0',
            'threshold' => 'integer|min:0',
            'location' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'string|in:active,inactive',
            'barcode' => 'nullable|string',
            'weight' => 'nullable|string',
            'dimensions' => 'nullable|string',
        ]));

        return $product->load('category');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function lowStock()
    {
        return Product::where('quantity', '<=', 'threshold')->get();
    }

    public function adjustStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer',
            'reason' => 'required|string',
        ]);

        $oldQuantity = $product->quantity;
        $product->quantity = $validated['quantity'];
        $product->save();

        // Create stock movement record
        $movement = $product->stockMovements()->create([
            'quantity' => $validated['quantity'] - $oldQuantity,
            'type' => $validated['quantity'] > $oldQuantity ? 'in' : 'out',
            'reason' => $validated['reason'],
            'performed_by' => auth()->id(),
        ]);

        return response()->json([
            'product' => $product,
            'movement' => $movement
        ]);
    }
}
