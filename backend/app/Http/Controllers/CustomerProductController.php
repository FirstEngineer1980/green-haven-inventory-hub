<?php

namespace App\Http\Controllers;

use App\Models\CustomerProduct;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class CustomerProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CustomerProduct::query()->with('customer');

        // Filter by customer_id if provided
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Get all products for SKU selection.
     */
    public function getProducts()
    {
        $products = Product::select('id', 'name', 'sku', 'description', 'price', 'cost_price', 'image')
            ->where('status', 'active')
            ->whereNotNull('sku')
            ->orderBy('name')
            ->get();

        return response()->json($products);
    }

    /**
     * Get product details by SKU.
     */
    public function getProductBySku($sku)
    {
        $product = Product::where('sku', $sku)
            ->where('status', 'active')
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'description' => $product->description,
            'price' => $product->price,
            'cost_price' => $product->cost_price,
            'image' => $product->image,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50',
            'qty' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'picture' => 'nullable|string',
        ]);

        $product = CustomerProduct::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerProduct $customerProduct)
    {
        $customerProduct->load('customer');

        return response()->json($customerProduct);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomerProduct $customerProduct)
    {
        $validated = $request->validate([
            'customer_id' => 'sometimes|required|exists:customers,id',
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'sometimes|required|string|max:50',
            'qty' => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string',
            'picture' => 'nullable|string',
        ]);

        $customerProduct->update($validated);

        return response()->json($customerProduct);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerProduct $customerProduct)
    {
        $customerProduct->delete();

        return response()->json(null, 204);
    }

    /**
     * Get products for a specific customer.
     */
    public function getByCustomer(Customer $customer)
    {
        $products = $customer->customerProducts;

        return response()->json($products);
    }
}
