<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Promotion;
use App\Models\Product;
use Carbon\Carbon;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample promotions
        $promotions = [
            [
                'title' => 'Summer Sale',
                'description' => 'Save up to 40% on selected products',
                'start_date' => Carbon::now()->subDays(5),
                'end_date' => Carbon::now()->addDays(25),
                'discount' => 0.4,
                'categories' => ['Electronics', 'Office Supplies'],
                'active' => true,
                'image' => 'https://picsum.photos/seed/promo1/800/300'
            ],
            [
                'title' => 'Back to Office',
                'description' => '25% off on furniture and office supplies',
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(15),
                'discount' => 0.25,
                'categories' => ['Furniture', 'Office Supplies'],
                'active' => true,
                'image' => 'https://picsum.photos/seed/promo2/800/300'
            ],
            [
                'title' => 'Flash Sale',
                'description' => 'Limited time offer - 30% off select electronics',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(7),
                'discount' => 0.3,
                'categories' => ['Electronics'],
                'active' => true,
                'image' => 'https://picsum.photos/seed/promo3/800/300'
            ]
        ];

        foreach ($promotions as $promotionData) {
            $promotion = Promotion::create($promotionData);

            // Attach some random products to each promotion
            $categoryNames = $promotionData['categories'];
            $products = Product::whereHas('category', function ($query) use ($categoryNames) {
                $query->whereIn('name', $categoryNames);
            })
            ->inRandomOrder()
            ->limit(rand(3, 8))
            ->get();

            $promotion->products()->attach($products->pluck('id'));
        }
    }
}
