<?php

namespace App\Http\Controllers;

use App\Models\SkuMatrixCell;
use Illuminate\Http\Request;

class SkuMatrixCellController extends Controller
{
    public function index()
    {
        return SkuMatrixCell::with('row')->get();
    }

    public function store(Request $request)
    {
        $cell = SkuMatrixCell::create($request->validate([
            'sku_matrix_row_id' => 'required|exists:sku_matrix_rows,id',
            'column_id' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]));

        return $cell->load('row');
    }

    public function show(SkuMatrixCell $skuMatrixCell)
    {
        return $skuMatrixCell->load('row');
    }

    public function update(Request $request, SkuMatrixCell $skuMatrixCell)
    {
        $skuMatrixCell->update($request->validate([
            'value' => 'nullable|string',
        ]));

        return $skuMatrixCell->load('row');
    }

    public function destroy(SkuMatrixCell $skuMatrixCell)
    {
        $skuMatrixCell->delete();
        return response()->json(['message' => 'SKU matrix cell deleted successfully']);
    }
}
