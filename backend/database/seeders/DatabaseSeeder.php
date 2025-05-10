
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            CategorySeeder::class,
            VendorSeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            RoomSeeder::class,
            UnitSeeder::class,
            BinSeeder::class,
            SkuMatrixSeeder::class,
            PurchaseOrderSeeder::class,
            ClientOrderTemplateSeeder::class,
            SettingSeeder::class,
            PassportSeeder::class, // Add Passport seeder
        ]);
    }
}
