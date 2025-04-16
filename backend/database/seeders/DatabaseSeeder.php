
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            BinSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            RoomSeeder::class,
            UnitSeeder::class,
            VendorSeeder::class,
            PurchaseOrderSeeder::class,
            CustomerSeeder::class,
            SettingSeeder::class,
            SkuMatrixSeeder::class,
            PromotionSeeder::class, // Add the promotion seeder
        ]);
    }
}
