
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\InventoryItem;
use App\Models\PurchaseOrder;
use App\Models\ClientOrderTemplate;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get overview statistics for the dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function stats()
    {
        $totalProducts = Product::count();
        $lowStockCount = Product::whereRaw('quantity <= threshold')->count();
        $totalValue = Product::sum(DB::raw('quantity * price'));
        
        $monthlyMovements = StockMovement::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        return response()->json([
            'totalProducts' => $totalProducts,
            'lowStockCount' => $lowStockCount,
            'totalValue' => round($totalValue, 2),
            'monthlyMovements' => $monthlyMovements
        ]);
    }

    /**
     * Get low stock products for the dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function lowStock()
    {
        $products = Product::select('id', 'name', 'sku', 'quantity', 'threshold', 'category_id')
            ->with('category:id,name')
            ->whereRaw('quantity <= threshold')
            ->orderBy('quantity')
            ->limit(10)
            ->get();

        return response()->json(['data' => $products]);
    }

    /**
     * Get recent stock movements for the dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function recentMovements()
    {
        $movements = StockMovement::select(
                'stock_movements.id',
                'products.name as productName',
                'stock_movements.quantity',
                'stock_movements.type',
                'stock_movements.created_at as date',
                'users.name as performedBy'
            )
            ->join('products', 'stock_movements.product_id', '=', 'products.id')
            ->leftJoin('users', 'stock_movements.performed_by', '=', 'users.id')
            ->orderBy('stock_movements.created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json(['data' => $movements]);
    }

    /**
     * Get products by category for the dashboard chart.
     *
     * @return \Illuminate\Http\Response
     */
    public function productsByCategory()
    {
        $categories = DB::table('products')
            ->select('categories.name as category', DB::raw('count(*) as count'))
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->groupBy('categories.name')
            ->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * Get stock trend data for the dashboard chart.
     *
     * @return \Illuminate\Http\Response
     */
    public function stockTrend()
    {
        $dates = [];
        $currentDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');
            $dates[$dateStr] = [
                'date' => $dateStr,
                'stockIn' => 0,
                'stockOut' => 0
            ];
            $currentDate->addDay();
        }

        $movements = StockMovement::select(
                DB::raw('DATE(created_at) as date'),
                'type',
                DB::raw('SUM(quantity) as total')
            )
            ->whereDate('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date', 'type')
            ->get();

        foreach ($movements as $movement) {
            if (isset($dates[$movement->date])) {
                if ($movement->type === 'in') {
                    $dates[$movement->date]['stockIn'] = $movement->total;
                } else {
                    $dates[$movement->date]['stockOut'] = $movement->total;
                }
            }
        }

        return response()->json(['data' => array_values($dates)]);
    }

    /**
     * Get upcoming orders for the dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function upcomingOrders()
    {
        $purchaseOrders = PurchaseOrder::select('id', 'po_number', 'vendor_id', 'expected_delivery_date', 'status', 'total')
            ->with('vendor:id,name')
            ->where('status', 'ordered')
            ->whereNotNull('expected_delivery_date')
            ->orderBy('expected_delivery_date')
            ->limit(5)
            ->get();

        $clientOrders = ClientOrderTemplate::select('id', 'name', 'customer_id', 'next_order_date', 'frequency')
            ->with('customer:id,name')
            ->whereNotNull('next_order_date')
            ->orderBy('next_order_date')
            ->limit(5)
            ->get();

        return response()->json([
            'purchaseOrders' => $purchaseOrders,
            'clientOrders' => $clientOrders
        ]);
    }
}
