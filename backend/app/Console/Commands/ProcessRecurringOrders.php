<?php

namespace App\Console\Commands;

use App\Services\PurchaseOrderService;
use App\Services\ClientOrderTemplateService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessRecurringOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process due recurring orders and client order templates';

    /**
     * Execute the console command.
     */
    public function handle(PurchaseOrderService $purchaseOrderService, ClientOrderTemplateService $templateService)
    {
        $this->info('Starting to process recurring orders...');

        try {
            // Process recurring purchase orders
            $processedPOs = $purchaseOrderService->processRecurringOrders();
            $this->info('Processed ' . count($processedPOs) . ' recurring purchase orders');

            foreach ($processedPOs as $po) {
                $this->line("- Created PO #{$po->order_number} for {$po->vendor->name}");
            }

            // Process client order templates
            $createdOrders = $templateService->processTemplates();
            $this->info('Created ' . count($createdOrders) . ' orders from client templates');

            foreach ($createdOrders as $order) {
                $this->line("- Created PO #{$order->order_number} from template '{$order->notes}'");
            }

            Log::info('Successfully processed recurring orders', [
                'recurring_pos_count' => count($processedPOs),
                'template_orders_count' => count($createdOrders),
            ]);

            return 0;
        } catch (\Exception $e) {
            $this->error('Failed to process recurring orders: ' . $e->getMessage());

            Log::error('Failed to process recurring orders', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return 1;
        }
    }
}
