
<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    public function index()
    {
        return InventoryItem::with(['product', 'unit', 'bin', 'skuMatrix'])->get();
    }

    public function store(Request $request)
    {
        $item = InventoryItem::create($request->validate([
            'product_id' => 'required|exists:products,id',
            'unit_id' => 'nullable|exists:units,id',
            'bin_id' => 'nullable|exists:bins,id',
            'quantity' => 'required|integer|min:0',
            'sku_matrix_id' => 'nullable|exists:sku_matrices,id',
            'status' => 'string|in:active,inactive',
            'notes' => 'nullable|string',
        ]));

        return $item->load(['product', 'unit', 'bin', 'skuMatrix']);
    }

    public function show(InventoryItem $inventoryItem)
    {
        return $inventoryItem->load(['product', 'unit', 'bin', 'skuMatrix']);
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $inventoryItem->update($request->validate([
            'unit_id' => 'nullable|exists:units,id',
            'bin_id' => 'nullable|exists:bins,id',
            'quantity' => 'integer|min:0',
            'sku_matrix_id' => 'nullable|exists:sku_matrices,id',
            'status' => 'string|in:active,inactive',
            'notes' => 'nullable|string',
        ]));

        return $inventoryItem->load(['product', 'unit', 'bin', 'skuMatrix']);
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        $inventoryItem->delete();
        return response()->json(['message' => 'Inventory item deleted successfully']);
    }

    public function getByUnit(Unit $unit)
    {
        return $unit->inventoryItems()->with(['product', 'bin', 'skuMatrix'])->get();
    }

    public function getByProduct(Product $product)
    {
        return $product->inventoryItems()->with(['unit', 'bin', 'skuMatrix'])->get();
    }
}
