
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Promotion;
use App\Models\Product;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'discount' => 'required|numeric|min:0|max:1',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
            'categories' => 'required|array',
            'active' => 'required|boolean',
            'image' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion = Promotion::create([
            'title' => $request->title,
            'description' => $request->description,
            'discount' => $request->discount,
            'start_date' => $request->startDate,
            'end_date' => $request->endDate,
            'categories' => json_encode($request->categories),
            'active' => $request->active,
            'image' => $request->image
        ]);

        return response()->json($promotion, 201);
    }

    public function show($id)
    {
        $promotion = Promotion::find($id);
        
        if (!$promotion) {
            return response()->json(['error' => 'Promotion not found'], 404);
        }

        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);
        
        if (!$promotion) {
            return response()->json(['error' => 'Promotion not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'discount' => 'numeric|min:0|max:1',
            'startDate' => 'date',
            'endDate' => 'date|after:startDate',
            'categories' => 'array',
            'active' => 'boolean',
            'image' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion->update([
            'title' => $request->title ?? $promotion->title,
            'description' => $request->description ?? $promotion->description,
            'discount' => $request->discount ?? $promotion->discount,
            'start_date' => $request->startDate ?? $promotion->start_date,
            'end_date' => $request->endDate ?? $promotion->end_date,
            'categories' => $request->categories ? json_encode($request->categories) : $promotion->categories,
            'active' => $request->active ?? $promotion->active,
            'image' => $request->image ?? $promotion->image
        ]);

        return response()->json($promotion);
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);
        
        if (!$promotion) {
            return response()->json(['error' => 'Promotion not found'], 404);
        }

        $promotion->delete();
        return response()->json(null, 204);
    }

    public function getActivePromotions()
    {
        $now = now()->format('Y-m-d');
        
        $promotions = Promotion::where('active', true)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->get();
            
        return response()->json($promotions);
    }

    public function getPromotedProducts()
    {
        $now = now()->format('Y-m-d');
        
        // Get active promotions
        $promotions = Promotion::where('active', true)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->get();
            
        if ($promotions->isEmpty()) {
            return response()->json([]);
        }
        
        // Get all products
        $products = Product::all();
        $promotedProducts = [];
        
        foreach ($products as $product) {
            foreach ($promotions as $promotion) {
                $categories = json_decode($promotion->categories);
                
                // Check if product category matches any promotion category
                if (in_array($product->category, $categories)) {
                    // Calculate discounted price
                    $discountedPrice = $product->price * (1 - $promotion->discount);
                    
                    $promotedProducts[] = [
                        'product' => $product,
                        'original_price' => $product->price,
                        'discounted_price' => $discountedPrice,
                        'discount_percentage' => $promotion->discount * 100,
                        'promotion' => $promotion
                    ];
                    
                    // We found a promotion for this product, no need to check other promotions
                    break;
                }
            }
        }
        
        return response()->json($promotedProducts);
    }

    public function toggleActive($id)
    {
        $promotion = Promotion::find($id);
        
        if (!$promotion) {
            return response()->json(['error' => 'Promotion not found'], 404);
        }

        $promotion->active = !$promotion->active;
        $promotion->save();
        
        return response()->json($promotion);
    }
}
