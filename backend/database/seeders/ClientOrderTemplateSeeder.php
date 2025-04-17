<?php

namespace Database\Seeders;

use App\Models\ClientOrderTemplate;
use App\Models\ClientOrderTemplateItem;
use Illuminate\Database\Seeder;

class ClientOrderTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Create Client Order Template
        $template = ClientOrderTemplate::create([
            'customer_id' => 1,
            'name' => 'Weekly Office Supplies',
            'frequency' => 'weekly',
            'next_order_date' => now()->addWeek(),
            'is_active' => true,
            'notes' => 'Standard weekly office supplies order'
        ]);

        // Create Template Items
        ClientOrderTemplateItem::create([
            'client_order_template_id' => $template->id,
            'product_id' => 3, // Printer Paper
            'quantity' => 2,
            'is_active' => true
        ]);
    }
}
