
<?php

namespace Database\Seeders;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Database\Seeder;
use Spatie\Activitylog\Models\Activity;

class PurchaseOrderSeeder extends Seeder
{
    public function run(): void
    {
        // Temporarily disable activity logging
        $originalLogging = Activity::$recordEvents;
        Activity::$recordEvents = false;
        
        // Create Purchase Order
        $po = PurchaseOrder::create([
            'order_number' => 'PO-2024001',
            'vendor_id' => 1,
            'customer_id' => 1,
            'status' => 'pending',
            'total_amount' => 1199.98,
            'expected_delivery_date' => now()->addDays(7),
            'is_recurring' => false,
            'notes' => 'Initial order'
        ]);

        // Create Purchase Order Items
        PurchaseOrderItem::create([
            'purchase_order_id' => $po->id,
            'product_id' => 1,
            'sku' => 'LAP001',
            'name' => 'Laptop Computer',
            'quantity' => 1,
            'unit_price' => 999.99,
            'total_price' => 999.99,
            'status' => 'pending'
        ]);

        PurchaseOrderItem::create([
            'purchase_order_id' => $po->id,
            'product_id' => 2,
            'sku' => 'CHR001',
            'name' => 'Office Chair',
            'quantity' => 1,
            'unit_price' => 199.99,
            'total_price' => 199.99,
            'status' => 'pending'
        ]);
        
        // Re-enable activity logging
        Activity::$recordEvents = $originalLogging;
    }
}
