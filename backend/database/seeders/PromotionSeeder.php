
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Promotion;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Promotion::create([
            'title' => 'Summer Sale',
            'description' => 'Save up to 40% on selected products',
            'discount' => 0.4,
            'start_date' => '2024-06-01',
            'end_date' => '2024-08-31',
            'categories' => json_encode(['Electronics', 'Office Supplies']),
            'active' => true,
            'image' => 'https://picsum.photos/seed/promo1/800/300'
        ]);

        Promotion::create([
            'title' => 'Back to Office',
            'description' => '25% off on furniture and office supplies',
            'discount' => 0.25,
            'start_date' => '2024-07-15',
            'end_date' => '2024-09-15',
            'categories' => json_encode(['Furniture', 'Office Supplies']),
            'active' => true,
            'image' => 'https://picsum.photos/seed/promo2/800/300'
        ]);

        Promotion::create([
            'title' => 'Flash Sale',
            'description' => 'Limited time offer - 30% off select electronics',
            'discount' => 0.3,
            'start_date' => '2024-06-10',
            'end_date' => '2024-07-20',
            'categories' => json_encode(['Electronics']),
            'active' => true,
            'image' => 'https://picsum.photos/seed/promo3/800/300'
        ]);
    }
}
