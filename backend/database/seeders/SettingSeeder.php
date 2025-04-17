<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'company_name',
                'value' => 'Inventory System',
                'group' => 'general',
                'description' => 'Company name'
            ],
            [
                'key' => 'notification_email',
                'value' => 'notifications@example.com',
                'group' => 'notifications',
                'description' => 'Email for system notifications'
            ],
            [
                'key' => 'low_stock_threshold',
                'value' => '10',
                'group' => 'inventory',
                'description' => 'Default low stock alert threshold'
            ],
            [
                'key' => 'currency',
                'value' => 'USD',
                'group' => 'general',
                'description' => 'System currency'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
