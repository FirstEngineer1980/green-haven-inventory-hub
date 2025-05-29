<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $promotions = Promotion::with('products')->get();
        return response()->json($promotions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount' => 'required|numeric|between:0,1',
            'categories' => 'nullable|array',
            'active' => 'boolean',
            'image' => 'nullable|string',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id',
        ]);

        $promotion = Promotion::create($validated);

        // Attach products if provided
        if ($request->has('products')) {
            $promotion->products()->attach($request->products);
        }

        return response()->json($promotion, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Promotion $promotion)
    {
        return response()->json($promotion->load('products'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'discount' => 'sometimes|required|numeric|between:0,1',
            'categories' => 'nullable|array',
            'active' => 'boolean',
            'image' => 'nullable|string',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id',
        ]);

        $promotion->update($validated);

        // Sync products if provided
        if ($request->has('products')) {
            $promotion->products()->sync($request->products);
        }

        return response()->json($promotion);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return response()->json(null, 204);
    }

    /**
     * Get all active promotions with their products.
     */
    public function getActivePromotions()
    {
        $activePromotions = Promotion::where('active', true)
            ->where('start_date', '<=', Carbon::now())
            ->where('end_date', '>=', Carbon::now())
            ->with('products.category')
            ->get();

        return response()->json($activePromotions);
    }

    /**
     * Get all products with active promotions.
     */
    public function getDiscountedProducts()
    {
        $products = Product::with('category', 'promotions')
            ->whereHas('promotions', function ($query) {
                $query->where('active', true)
                    ->where('start_date', '<=', Carbon::now())
                    ->where('end_date', '>=', Carbon::now());
            })
            ->get()
            ->map(function ($product) {
                $product->discounted_price = $product->getDiscountedPrice();
                return $product;
            });

        return response()->json($products);
    }
}
