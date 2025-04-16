
<?php

namespace App\Http\Controllers;

use App\Models\SkuMatrixRow;
use Illuminate\Http\Request;

class SkuMatrixRowController extends Controller
{
    public function index()
    {
        return SkuMatrixRow::with('cells')->get();
    }

    public function store(Request $request)
    {
        $row = SkuMatrixRow::create($request->validate([
            'sku_matrix_id' => 'required|exists:sku_matrices,id',
            'label' => 'required|string|max:255',
            'color' => 'nullable|string|max:50',
        ]));

        return $row->load('cells');
    }

    public function show(SkuMatrixRow $skuMatrixRow)
    {
        return $skuMatrixRow->load('cells');
    }

    public function update(Request $request, SkuMatrixRow $skuMatrixRow)
    {
        $skuMatrixRow->update($request->validate([
            'label' => 'string|max:255',
            'color' => 'nullable|string|max:50',
        ]));

        return $skuMatrixRow->load('cells');
    }

    public function destroy(SkuMatrixRow $skuMatrixRow)
    {
        $skuMatrixRow->delete();
        return response()->json(['message' => 'SKU matrix row deleted successfully']);
    }
}
