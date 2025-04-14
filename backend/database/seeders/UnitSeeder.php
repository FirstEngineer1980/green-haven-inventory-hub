
<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'name' => 'Shelf A1',
                'description' => 'Electronics storage shelf',
                'room_id' => 1,
                'number' => 'A1',
                'size' => '100',
                'size_unit' => 'sqft',
                'status' => 'active'
            ],
            [
                'name' => 'Shelf B1',
                'description' => 'Office supplies shelf',
                'room_id' => 2,
                'number' => 'B1',
                'size' => '80',
                'size_unit' => 'sqft',
                'status' => 'active'
            ]
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
