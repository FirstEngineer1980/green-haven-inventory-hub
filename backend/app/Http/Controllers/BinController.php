<?php

namespace App\Http\Controllers;

use App\Models\Bin;
use Illuminate\Http\Request;

class BinController extends Controller
{
    public function index()
    {
        return Bin::with('unitMatrix')->get();
    }

    public function store(Request $request)
    {
        $bin = Bin::create($request->validate([
            'name' => 'required|string|max:255',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'volume_capacity' => 'nullable|numeric|min:0',
            'location' => 'nullable|string',
            'unit_matrix_id' => 'nullable|exists:unit_matrices,id',
            'status' => 'string|in:active,inactive',
        ]));

        return $bin->load('unitMatrix');
    }

    public function show(Bin $bin)
    {
        return $bin->load(['unitMatrix', 'inventoryItems']);
    }

    public function update(Request $request, Bin $bin)
    {
        $bin->update($request->validate([
            'name' => 'string|max:255',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'volume_capacity' => 'nullable|numeric|min:0',
            'location' => 'nullable|string',
            'unit_matrix_id' => 'nullable|exists:unit_matrices,id',
            'status' => 'string|in:active,inactive',
        ]));

        return $bin->load('unitMatrix');
    }

    public function destroy(Bin $bin)
    {
        $bin->delete();
        return response()->json(['message' => 'Bin deleted successfully']);
    }
}
