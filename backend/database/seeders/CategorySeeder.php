<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'description' => 'Electronic devices and accessories'],
            ['name' => 'Furniture', 'description' => 'Office and home furniture'],
            ['name' => 'Stationery', 'description' => 'Office supplies and stationery items'],
            ['name' => 'Tools', 'description' => 'Hardware tools and equipment'],
            ['name' => 'Storage', 'description' => 'Storage solutions and containers']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
