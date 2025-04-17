<?php

namespace App\Http\Controllers;

use App\Models\SkuMatrix;
use App\Models\Room;
use Illuminate\Http\Request;

class SkuMatrixController extends Controller
{
    public function index()
    {
        return SkuMatrix::with(['room', 'rows.cells'])->get();
    }

    public function store(Request $request)
    {
        $matrix = SkuMatrix::create($request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'required|exists:rooms,id',
        ]));

        return $matrix->load(['room', 'rows.cells']);
    }

    public function show(SkuMatrix $skuMatrix)
    {
        return $skuMatrix->load(['room', 'rows.cells']);
    }

    public function update(Request $request, SkuMatrix $skuMatrix)
    {
        $skuMatrix->update($request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'exists:rooms,id',
        ]));

        return $skuMatrix->load(['room', 'rows.cells']);
    }

    public function destroy(SkuMatrix $skuMatrix)
    {
        $skuMatrix->delete();
        return response()->json(['message' => 'SKU matrix deleted successfully']);
    }

    public function getByRoom(Room $room)
    {
        return $room->skuMatrices()->with('rows.cells')->get();
    }
}
