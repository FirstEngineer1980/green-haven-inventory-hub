<?php

namespace App\Http\Controllers;

use App\Models\UnitMatrix;
use App\Models\UnitMatrixRow;
use App\Models\UnitMatrixCell;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UnitMatrixController extends Controller
{
    public function index()
    {
        $matrices = UnitMatrix::with(['room', 'rows.cells'])->get();
        return response()->json($matrices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'required|exists:rooms,id',
            'rows' => 'array',
            'rows.*.label' => 'required|string|max:255',
            'rows.*.color' => 'nullable|string|max:20',
            'rows.*.cells' => 'array',
            'rows.*.cells.*.column_id' => 'required|string',
            'rows.*.cells.*.value' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $matrix = UnitMatrix::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'room_id' => $validated['room_id'],
            ]);

            if (!empty($validated['rows'])) {
                foreach ($validated['rows'] as $rowData) {
                    $row = UnitMatrixRow::create([
                        'unit_matrix_id' => $matrix->id,
                        'label' => $rowData['label'],
                        'color' => $rowData['color'] ?? null,
                    ]);

                    if (!empty($rowData['cells'])) {
                        foreach ($rowData['cells'] as $cellData) {
                            UnitMatrixCell::create([
                                'unit_matrix_row_id' => $row->id,
                                'column_id' => $cellData['column_id'],
                                'value' => $cellData['value'] ?? null,
                            ]);
                        }
                    }
                }
            }

            return response()->json($matrix->load(['room', 'rows.cells']), 201);
        });
    }

    public function update(Request $request, UnitMatrix $unitMatrix)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'sometimes|required|exists:rooms,id',
            'rows' => 'array',
            'rows.*.id' => 'nullable|integer|exists:unit_matrix_rows,id',
            'rows.*.label' => 'required|string|max:255',
            'rows.*.color' => 'nullable|string|max:20',
            'rows.*.cells' => 'array',
            'rows.*.cells.*.id' => 'nullable|integer|exists:unit_matrix_cells,id',
            'rows.*.cells.*.column_id' => 'required|string',
            'rows.*.cells.*.value' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $unitMatrix) {
            $unitMatrix->update([
                'name' => $validated['name'] ?? $unitMatrix->name,
                'description' => $validated['description'] ?? $unitMatrix->description,
                'room_id' => $validated['room_id'] ?? $unitMatrix->room_id,
            ]);

            if (isset($validated['rows'])) {
                $existingRowIds = $unitMatrix->rows()->pluck('id')->toArray();
                $incomingRowIds = array_filter(array_map(fn($r) => $r['id'] ?? null, $validated['rows']));

                // Delete removed rows
                $rowsToDelete = array_diff($existingRowIds, $incomingRowIds);
                if (!empty($rowsToDelete)) {
                    UnitMatrixRow::whereIn('id', $rowsToDelete)->delete();
                }

                foreach ($validated['rows'] as $rowData) {
                    if (!empty($rowData['id'])) {
                        $row = UnitMatrixRow::findOrFail($rowData['id']);
                        $row->update([
                            'label' => $rowData['label'],
                            'color' => $rowData['color'] ?? null,
                        ]);
                    } else {
                        $row = UnitMatrixRow::create([
                            'unit_matrix_id' => $unitMatrix->id,
                            'label' => $rowData['label'],
                            'color' => $rowData['color'] ?? null,
                        ]);
                    }

                    // Cells processing
                    $existingCellIds = $row->cells()->pluck('id')->toArray();
                    $incomingCellIds = array_filter(array_map(fn($c) => $c['id'] ?? null, $rowData['cells'] ?? []));
                    $cellsToDelete = array_diff($existingCellIds, $incomingCellIds);
                    if (!empty($cellsToDelete)) {
                        UnitMatrixCell::whereIn('id', $cellsToDelete)->delete();
                    }

                    foreach ($rowData['cells'] ?? [] as $cellData) {
                        if (!empty($cellData['id'])) {
                            $cell = UnitMatrixCell::findOrFail($cellData['id']);
                            $cell->update([
                                'column_id' => $cellData['column_id'],
                                'value' => $cellData['value'] ?? null,
                            ]);
                        } else {
                            UnitMatrixCell::create([
                                'unit_matrix_row_id' => $row->id,
                                'column_id' => $cellData['column_id'],
                                'value' => $cellData['value'] ?? null,
                            ]);
                        }
                    }
                }
            }

            return response()->json($unitMatrix->load(['room', 'rows.cells']));
        });
    }

    public function show(UnitMatrix $unitMatrix)
    {
        return response()->json($unitMatrix->load(['room', 'rows.cells']));
    }

    public function destroy(UnitMatrix $unitMatrix)
    {
        $unitMatrix->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
