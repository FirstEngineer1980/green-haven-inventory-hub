
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::with('children')->whereNull('parent_id')->get();
    }

    public function store(Request $request)
    {
        $category = Category::create($request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id'
        ]));

        return $category;
    }

    public function show(Category $category)
    {
        return $category->load(['parent', 'children']);
    }

    public function update(Request $request, Category $category)
    {
        $category->update($request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id'
        ]));

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function getProducts(Category $category)
    {
        return $category->products()->with('category')->get();
    }
}
