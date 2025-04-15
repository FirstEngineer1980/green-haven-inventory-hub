
<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display a listing of all reports.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $reports = Report::with('user')->get();
        return response()->json(['data' => $reports]);
    }

    /**
     * Store a newly created report in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'params' => 'required|array',
            'schedule' => 'nullable|string',
        ]);

        $report = new Report($request->all());
        $report->user_id = Auth::id();
        $report->save();

        return response()->json(['data' => $report, 'message' => 'Report created successfully'], 201);
    }

    /**
     * Display the specified report.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function show(Report $report)
    {
        return response()->json(['data' => $report->load('user')]);
    }

    /**
     * Update the specified report in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Report $report)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|string',
            'params' => 'sometimes|required|array',
            'schedule' => 'nullable|string',
        ]);

        $report->update($request->all());
        return response()->json(['data' => $report, 'message' => 'Report updated successfully']);
    }

    /**
     * Remove the specified report from storage.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function destroy(Report $report)
    {
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }

    /**
     * Generate the specified report.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function generate(Report $report)
    {
        $data = [];
        $message = 'Report generated successfully';

        // Update last_run timestamp
        $report->last_run = now();
        $report->save();

        // Handle different report types
        switch ($report->type) {
            case 'inventory_summary':
                $data = $this->generateInventorySummary($report->params);
                break;
            case 'stock_movements':
                $data = $this->generateStockMovements($report->params);
                break;
            case 'low_stock':
                $data = $this->generateLowStockReport($report->params);
                break;
            case 'customer_inventory':
                $data = $this->generateCustomerInventory($report->params);
                break;
            default:
                return response()->json(['error' => 'Unsupported report type'], 400);
        }

        return response()->json([
            'data' => $data,
            'report' => $report,
            'message' => $message
        ]);
    }

    /**
     * Generate inventory summary report.
     *
     * @param  array  $params
     * @return array
     */
    private function generateInventorySummary($params)
    {
        return DB::table('products')
            ->select('products.name', 'products.sku', 'categories.name as category', 'products.quantity')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->get()
            ->toArray();
    }

    /**
     * Generate stock movements report.
     *
     * @param  array  $params
     * @return array
     */
    private function generateStockMovements($params)
    {
        $query = DB::table('stock_movements')
            ->select(
                'stock_movements.id',
                'products.name as product_name',
                'stock_movements.quantity',
                'stock_movements.type',
                'stock_movements.reason',
                'users.name as performed_by',
                'stock_movements.created_at'
            )
            ->join('products', 'stock_movements.product_id', '=', 'products.id')
            ->leftJoin('users', 'stock_movements.performed_by', '=', 'users.id')
            ->orderBy('stock_movements.created_at', 'desc');

        // Apply date filters if provided
        if (isset($params['start_date'])) {
            $query->where('stock_movements.created_at', '>=', $params['start_date']);
        }
        
        if (isset($params['end_date'])) {
            $query->where('stock_movements.created_at', '<=', $params['end_date']);
        }

        return $query->get()->toArray();
    }

    /**
     * Generate low stock report.
     *
     * @param  array  $params
     * @return array
     */
    private function generateLowStockReport($params)
    {
        $threshold = $params['threshold'] ?? 10;

        return DB::table('products')
            ->select('products.name', 'products.sku', 'products.quantity', 'products.threshold')
            ->where('products.quantity', '<=', DB::raw('products.threshold'))
            ->where('products.threshold', '>', 0)
            ->orderBy('products.quantity')
            ->get()
            ->toArray();
    }

    /**
     * Generate customer inventory report.
     *
     * @param  array  $params
     * @return array
     */
    private function generateCustomerInventory($params)
    {
        $customerId = $params['customer_id'] ?? null;

        if (!$customerId) {
            return [];
        }

        return DB::table('inventory_items')
            ->select(
                'products.name as product_name',
                'products.sku',
                'inventory_items.quantity',
                'units.name as unit_name',
                'rooms.name as room_name'
            )
            ->join('products', 'inventory_items.product_id', '=', 'products.id')
            ->join('units', 'inventory_items.unit_id', '=', 'units.id')
            ->join('rooms', 'units.room_id', '=', 'rooms.id')
            ->where('rooms.customer_id', $customerId)
            ->get()
            ->toArray();
    }
}
