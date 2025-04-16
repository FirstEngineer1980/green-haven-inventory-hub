
<?php

namespace Database\Seeders;

use App\Models\Bin;
use Illuminate\Database\Seeder;

class BinSeeder extends Seeder
{
    public function run(): void
    {
        $bins = [
            [
                'name' => 'Bin A1',
                'length' => 100,
                'width' => 50,
                'height' => 30,
                'volume_capacity' => 150000,
                'location' => 'Warehouse A, Section 1',
                'status' => 'active'
            ],
            [
                'name' => 'Bin B2',
                'length' => 80,
                'width' => 40,
                'height' => 25,
                'volume_capacity' => 80000,
                'location' => 'Warehouse A, Section 2',
                'status' => 'active'
            ],
            [
                'name' => 'Bin C3',
                'length' => 120,
                'width' => 60,
                'height' => 40,
                'volume_capacity' => 288000,
                'location' => 'Warehouse B, Section 1',
                'status' => 'active'
            ]
        ];

        foreach ($bins as $bin) {
            Bin::create($bin);
        }
    }
}
