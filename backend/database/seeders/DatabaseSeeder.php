
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class, // Ensuring this runs before purchase orders
            VendorSeeder::class,
            CustomerSeeder::class,
            RoomSeeder::class,
            UnitSeeder::class,
            SkuMatrixSeeder::class,
            PurchaseOrderSeeder::class,
            ClientOrderTemplateSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
