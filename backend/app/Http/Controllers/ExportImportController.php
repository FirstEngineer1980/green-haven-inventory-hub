<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Room;
use App\Models\Unit;
use App\Models\Seller;
use App\Models\Client;
use App\Models\SellerCommission;
use App\Models\User;
use App\Models\ExportLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ExportImportController extends Controller
{
    /**
     * Export data for a specific type
     */
    public function export(Request $request, $type)
    {
        $validated = $request->validate([
            'fields' => 'array',
            'format' => 'in:json,csv',
        ]);

        $format = $validated['format'] ?? 'json';
        $fields = $validated['fields'] ?? [];

        try {
            $data = $this->getDataByType($type, $fields);

            // Log the export
            ExportLog::create([
                'type' => $type,
                'filename' => "{$type}_export_" . now()->format('Y-m-d_H-i-s') . ".{$format}",
                'exported_by' => auth()->id(),
                'exported_at' => now(),
                'record_count' => count($data),
            ]);

            if ($format === 'csv') {
                return $this->exportToCsv($data, $type);
            }

            return response()->json([
                'data' => $data,
                'count' => count($data),
                'exported_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error("Export failed for type {$type}: " . $e->getMessage());
            return response()->json(['error' => 'Export failed'], 500);
        }
    }

    /**
     * Import data for a specific type
     */
    public function import(Request $request, $type)
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'overwrite' => 'boolean',
        ]);

        $data = $validated['data'];
        $overwrite = $validated['overwrite'] ?? false;

        try {
            DB::beginTransaction();

            $result = $this->importDataByType($type, $data, $overwrite);

            DB::commit();

            return response()->json([
                'message' => 'Import completed successfully',
                'imported_count' => $result['imported'],
                'updated_count' => $result['updated'],
                'errors' => $result['errors'],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Import failed for type {$type}: " . $e->getMessage());
            return response()->json(['error' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get export logs
     */
    public function exportLogs()
    {
        $logs = ExportLog::with('user')
            ->orderBy('exported_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    private function getDataByType($type, $fields = [])
    {
        switch ($type) {
            case 'products':
                $query = Product::with('category');
                break;
            case 'categories':
                $query = Category::query();
                break;
            case 'customers':
                $query = Customer::query();
                break;
            case 'rooms':
                $query = Room::with('customer');
                break;
            case 'units':
                $query = Unit::with('room');
                break;
            case 'sellers':
                $query = Seller::query();
                break;
            case 'clients':
                $query = Client::query();
                break;
            case 'seller-commissions':
                $query = SellerCommission::with(['seller', 'client']);
                break;
            case 'users':
                $query = User::query();
                break;
            default:
                throw new \Exception("Invalid export type: {$type}");
        }

        $data = $query->get();

        if (!empty($fields)) {
            $data = $data->map(function ($item) use ($fields) {
                return $item->only($fields);
            });
        }

        return $data->toArray();
    }

    private function importDataByType($type, $data, $overwrite)
    {
        $imported = 0;
        $updated = 0;
        $errors = [];

        foreach ($data as $index => $item) {
            try {
                $result = $this->importSingleItem($type, $item, $overwrite);
                if ($result['action'] === 'imported') {
                    $imported++;
                } elseif ($result['action'] === 'updated') {
                    $updated++;
                }
            } catch (\Exception $e) {
                $errors[] = "Row {$index}: " . $e->getMessage();
            }
        }

        return [
            'imported' => $imported,
            'updated' => $updated,
            'errors' => $errors,
        ];
    }

    private function importSingleItem($type, $item, $overwrite)
    {
        switch ($type) {
            case 'products':
                return $this->importProduct($item, $overwrite);
            case 'categories':
                return $this->importCategory($item, $overwrite);
            case 'customers':
                return $this->importCustomer($item, $overwrite);
            case 'rooms':
                return $this->importRoom($item, $overwrite);
            case 'units':
                return $this->importUnit($item, $overwrite);
            case 'sellers':
                return $this->importSeller($item, $overwrite);
            case 'clients':
                return $this->importClient($item, $overwrite);
            case 'seller-commissions':
                return $this->importSellerCommission($item, $overwrite);
            case 'users':
                return $this->importUser($item, $overwrite);
            default:
                throw new \Exception("Invalid import type: {$type}");
        }
    }

    private function importProduct($item, $overwrite)
    {
        $existing = Product::where('sku', $item['sku'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Product with SKU {$item['sku']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Product::create($item);
        return ['action' => 'imported'];
    }

    private function importCategory($item, $overwrite)
    {
        $existing = Category::where('name', $item['name'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Category {$item['name']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Category::create($item);
        return ['action' => 'imported'];
    }

    private function importCustomer($item, $overwrite)
    {
        $existing = Customer::where('email', $item['email'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Customer with email {$item['email']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Customer::create($item);
        return ['action' => 'imported'];
    }

    private function importRoom($item, $overwrite)
    {
        $existing = Room::where('name', $item['name'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Room {$item['name']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Room::create($item);
        return ['action' => 'imported'];
    }

    private function importUnit($item, $overwrite)
    {
        $existing = Unit::where('number', $item['number'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Unit {$item['number']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Unit::create($item);
        return ['action' => 'imported'];
    }

    private function importSeller($item, $overwrite)
    {
        $existing = Seller::where('email', $item['email'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Seller with email {$item['email']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Seller::create($item);
        return ['action' => 'imported'];
    }

    private function importClient($item, $overwrite)
    {
        $existing = Client::where('email', $item['email'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Client with email {$item['email']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        Client::create($item);
        return ['action' => 'imported'];
    }

    private function importSellerCommission($item, $overwrite)
    {
        $existing = SellerCommission::where('seller_id', $item['seller_id'])
            ->where('client_id', $item['client_id'])
            ->first();

        if ($existing && !$overwrite) {
            throw new \Exception("Commission structure for this seller-client combination already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        SellerCommission::create($item);
        return ['action' => 'imported'];
    }

    private function importUser($item, $overwrite)
    {
        $existing = User::where('email', $item['email'])->first();

        if ($existing && !$overwrite) {
            throw new \Exception("User with email {$item['email']} already exists");
        }

        if ($existing && $overwrite) {
            $existing->update($item);
            return ['action' => 'updated'];
        }

        User::create($item);
        return ['action' => 'imported'];
    }

    private function exportToCsv($data, $type)
    {
        if (empty($data)) {
            return response()->json(['error' => 'No data to export'], 400);
        }

        $headers = array_keys($data[0]);
        $csvData = [];
        $csvData[] = $headers;

        foreach ($data as $row) {
            $csvData[] = array_values($row);
        }

        $filename = "{$type}_export_" . now()->format('Y-m-d_H-i-s') . ".csv";

        return response()->streamDownload(function () use ($csvData) {
            $handle = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
