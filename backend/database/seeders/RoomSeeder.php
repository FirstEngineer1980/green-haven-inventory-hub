
<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Main Warehouse',
                'description' => 'Main storage facility',
                'customer_id' => 1
            ],
            [
                'name' => 'Office Storage',
                'description' => 'Office supplies storage',
                'customer_id' => 1
            ],
            [
                'name' => 'Electronics Room',
                'description' => 'Storage for electronic items',
                'customer_id' => 2
            ]
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}
