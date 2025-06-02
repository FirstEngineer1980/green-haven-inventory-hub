<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Unit::query()->with('room');

        // Filter by room_id if provided
        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $units = $query->get();

        return response()->json($units);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'required|exists:rooms,id',
            'roomId' => 'sometimes|exists:rooms,id', // Accept both formats
            'number' => 'nullable|string|max:255',
            'size' => 'nullable|string',
            'size_unit' => 'nullable|string',
            'status' => 'nullable|string|max:255',
        ]);

        // Handle both roomId and room_id field names
        if (isset($validated['roomId']) && !isset($validated['room_id'])) {
            $validated['room_id'] = $validated['roomId'];
        }

        // Remove roomId if it exists to avoid database issues
        unset($validated['roomId']);

        $unit = Unit::create($validated);

        return response()->json($unit, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        $unit->load('room');

        return response()->json($unit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'room_id' => 'sometimes|required|exists:rooms,id',
            'number' => 'nullable|string|max:255',
            'size' => 'nullable|string',
            'size_unit' => 'nullable|string',
            'status' => 'nullable|string|max:255',
        ]);

        $unit->update($validated);

        return response()->json($unit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        $unit->delete();

        return response()->json(null, 204);
    }
}
