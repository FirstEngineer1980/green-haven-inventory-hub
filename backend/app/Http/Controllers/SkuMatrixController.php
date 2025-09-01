<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SkuMatrix;
use App\Models\SkuMatrixRow;
use App\Models\SkuMatrixCell;
use App\Models\Unit;
use Illuminate\Http\Request;

class SkuMatrixController extends Controller
{
    // Return all SKU Matrices with nested rows/cells
    public function index()
    {
        return SkuMatrix::with(['room', 'rows.cells'])->get();
    }

    // Store a matrix including cell SKUs
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'room_id' => 'required|exists:rooms,id',
            'rows' => 'array',
            'rows.*.label' => 'required|string',
            'rows.*.color' => 'nullable|string',
            'rows.*.cells' => 'array',
            'rows.*.cells.*.column_id' => 'required|string',
            'rows.*.cells.*.value' => 'nullable|string'
        ]);

        $matrix = SkuMatrix::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'room_id' => $data['room_id']
        ]);

        if (!empty($data['rows'])) {
            foreach ($data['rows'] as $rowData) {
                $row = $matrix->rows()->create([
                    'label' => $rowData['label'],
                    'color' => $rowData['color'] ?? '#FFFFFF'
                ]);
                if (!empty($rowData['cells'])) {
                    foreach ($rowData['cells'] as $cellData) {
                        $row->cells()->create([
                            'column_id' => $cellData['column_id'],
                            'value' => $cellData['value'] ?? null
                        ]);
                    }
                }
            }
        }

        return $matrix->load(['room', 'rows.cells']);
    }

    // Update matrix and cells
    public function update(Request $request, SkuMatrix $skuMatrix)
    {
        $data = $request->validate([
            'name' => 'string',
            'description' => 'nullable|string',
            'room_id' => 'exists:rooms,id',
            'rows' => 'array',
            'rows.*.id' => 'nullable|integer|exists:sku_matrix_rows,id',
            'rows.*.label' => 'required|string',
            'rows.*.color' => 'nullable|string',
            'rows.*.cells' => 'array',
            'rows.*.cells.*.id' => 'nullable|integer|exists:sku_matrix_cells,id',
            'rows.*.cells.*.column_id' => 'required|string',
            'rows.*.cells.*.value' => 'nullable|string'
        ]);

        $skuMatrix->update([
            'name' => $data['name'] ?? $skuMatrix->name,
            'description' => $data['description'] ?? $skuMatrix->description,
            'room_id' => $data['room_id'] ?? $skuMatrix->room_id
        ]);

        // Update or create rows/cells
        if (!empty($data['rows'])) {
            // Get existing row IDs to track which ones to keep
            $existingRowIds = collect($data['rows'])
                ->pluck('id')
                ->filter()
                ->toArray();

            // Delete rows that are no longer in the data
            $skuMatrix->rows()->whereNotIn('id', $existingRowIds)->delete();

            foreach ($data['rows'] as $rowData) {
                if (isset($rowData['id']) && $rowData['id']) {
                    // Update existing row
                    $row = SkuMatrixRow::find($rowData['id']);
                    if ($row) {
                        $row->update([
                            'label' => $rowData['label'],
                            'color' => $rowData['color'] ?? '#FFFFFF'
                        ]);
                    }
                } else {
                    // Create new row
                    $row = $skuMatrix->rows()->create([
                        'label' => $rowData['label'],
                        'color' => $rowData['color'] ?? '#FFFFFF'
                    ]);
                }

                if ($row && !empty($rowData['cells'])) {
                    // Get existing cell IDs for this row
                    $existingCellIds = collect($rowData['cells'])
                        ->pluck('id')
                        ->filter()
                        ->toArray();

                    // Delete cells that are no longer in the data
                    $row->cells()->whereNotIn('id', $existingCellIds)->delete();

                    foreach ($rowData['cells'] as $cellData) {
                        if (isset($cellData['id']) && $cellData['id']) {
                            // Update existing cell
                            $cell = SkuMatrixCell::find($cellData['id']);
                            if ($cell) {
                                $cell->update([
                                    'column_id' => $cellData['column_id'],
                                    'value' => $cellData['value'] ?? null
                                ]);
                            }
                        } else {
                            // Create new cell
                            $row->cells()->create([
                                'column_id' => $cellData['column_id'],
                                'value' => $cellData['value'] ?? null
                            ]);
                        }
                    }
                }
            }
        }

        return $skuMatrix->load(['room', 'rows.cells']);
    }

    // Get available SKUs/products for selection
    public function skuProducts()
    {
        // Select id, name, sku for each product/unit
        $products = Product::select('id', 'name', 'sku')->get();
        return response()->json(['products' => $products]);
    }

    // Show a specific SKU Matrix
    public function show(SkuMatrix $skuMatrix)
    {
        return $skuMatrix->load(['room', 'rows.cells']);
    }

    // Delete a SKU Matrix
    public function destroy(SkuMatrix $skuMatrix)
    {
        $skuMatrix->delete();
        return response()->json(['message' => 'SKU matrix deleted successfully']);
    }

    // Get SKU Matrices by Room
    public function getByRoom(Room $room)
    {
        return $room->skuMatrices()->with('rows.cells')->get();
    }
}
