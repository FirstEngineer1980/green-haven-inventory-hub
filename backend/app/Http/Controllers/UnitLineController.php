<?php

namespace App\Http\Controllers;

use App\Models\UnitLine;
use Illuminate\Http\Request;

class UnitLineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = UnitLine::query()->with('unit');

        // Filter by unit_id if provided
        if ($request->has('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        $unitLines = $query->orderBy('position')->get();

        return response()->json($unitLines);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'position' => 'nullable|integer|min:0',
        ]);

        $unitLine = UnitLine::create($validated);
        $unitLine->load('unit');

        return response()->json($unitLine, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UnitLine $unitLine)
    {
        $unitLine->load('unit');

        return response()->json($unitLine);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UnitLine $unitLine)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'position' => 'nullable|integer|min:0',
        ]);

        $unitLine->update($validated);
        $unitLine->load('unit');

        return response()->json($unitLine);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UnitLine $unitLine)
    {
        $unitLine->delete();

        return response()->json(null, 204);
    }
}