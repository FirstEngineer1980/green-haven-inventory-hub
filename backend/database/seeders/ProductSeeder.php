
<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Computer',
                'sku' => 'LAP001',
                'description' => 'High-performance laptop',
                'category_id' => 1,
                'price' => 999.99,
                'cost_price' => 800.00,
                'quantity' => 50,
                'threshold' => 10,
                'status' => 'active'
            ],
            [
                'name' => 'Office Chair',
                'sku' => 'CHR001',
                'description' => 'Ergonomic office chair',
                'category_id' => 2,
                'price' => 199.99,
                'cost_price' => 150.00,
                'quantity' => 30,
                'threshold' => 5,
                'status' => 'active'
            ],
            [
                'name' => 'Printer Paper',
                'sku' => 'PAP001',
                'description' => 'A4 printer paper, 500 sheets',
                'category_id' => 3,
                'price' => 9.99,
                'cost_price' => 5.00,
                'quantity' => 100,
                'threshold' => 20,
                'status' => 'active'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
