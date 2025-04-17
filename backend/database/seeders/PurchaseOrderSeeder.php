
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
        $wasLoggingEnabled = app('events')->hasListeners('eloquent.created: App\Models\PurchaseOrder');
        
        // Unregister the activity logger
        app('events')->forget('eloquent.created: App\Models\PurchaseOrder');
        app('events')->forget('eloquent.updated: App\Models\PurchaseOrder');
        app('events')->forget('eloquent.deleted: App\Models\PurchaseOrder');

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

        // If logging was originally enabled, we would re-register the listeners here
        // But since we're in a seeder, it's not necessary
    }
}
