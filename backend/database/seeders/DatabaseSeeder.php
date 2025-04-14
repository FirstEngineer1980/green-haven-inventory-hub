
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
            VendorSeeder::class,
            CustomerSeeder::class,
            ProductSeeder::class,
            RoomSeeder::class,
            UnitSeeder::class,
            SkuMatrixSeeder::class,
            PurchaseOrderSeeder::class,
            ClientOrderTemplateSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
