<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['items', 'creator']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%");
            });
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:salary,service,product,commission,other',
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email',
            'client_address' => 'nullable|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            $invoice = Invoice::create([
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'type' => $request->type,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'client_address' => $request->client_address,
                'issue_date' => $request->issue_date,
                'due_date' => $request->due_date,
                'tax_rate' => $request->tax_rate ?? 0,
                'discount_amount' => $request->discount_amount ?? 0,
                'notes' => $request->notes,
                'terms' => $request->terms,
                'created_by' => Auth::id()
            ]);

            foreach ($request->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'notes' => $item['notes'] ?? null
                ]);
            }

            $invoice->calculateTotals();
            $invoice->load(['items', 'creator']);

            DB::commit();

            return response()->json($invoice, 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to create invoice'], 500);
        }
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['items', 'creator']);
        return response()->json($invoice);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'type' => 'required|in:salary,service,product,commission,other',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email',
            'client_address' => 'nullable|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            $invoice->update([
                'type' => $request->type,
                'status' => $request->status,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'client_address' => $request->client_address,
                'issue_date' => $request->issue_date,
                'due_date' => $request->due_date,
                'tax_rate' => $request->tax_rate ?? 0,
                'discount_amount' => $request->discount_amount ?? 0,
                'notes' => $request->notes,
                'terms' => $request->terms
            ]);

            // Delete existing items and create new ones
            $invoice->items()->delete();

            foreach ($request->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'notes' => $item['notes'] ?? null
                ]);
            }

            $invoice->calculateTotals();
            $invoice->load(['items', 'creator']);

            DB::commit();

            return response()->json($invoice);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to update invoice'], 500);
        }
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $request->validate([
            'status' => 'required|in:draft,sent,paid,overdue,cancelled'
        ]);

        $invoice->update(['status' => $request->status]);

        return response()->json($invoice);
    }
}
