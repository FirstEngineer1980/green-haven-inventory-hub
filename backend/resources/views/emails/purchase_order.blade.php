
<!DOCTYPE html>
<html>
<head>
    <title>Purchase Order #{{ $purchaseOrder->po_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .content {
            padding: 20px;
        }
        .info-row {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            display: inline-block;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total-row {
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Purchase Order #{{ $purchaseOrder->po_number }}</h2>
        </div>
        
        <div class="content">
            <div class="info-row">
                <span class="info-label">Vendor:</span>
                <span>{{ $purchaseOrder->vendor->name }}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Order Date:</span>
                <span>{{ $purchaseOrder->order_date->format('Y-m-d') }}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Expected Delivery:</span>
                <span>{{ $purchaseOrder->expected_delivery_date ? $purchaseOrder->expected_delivery_date->format('Y-m-d') : 'Not specified' }}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span>{{ ucfirst($purchaseOrder->status) }}</span>
            </div>
            
            <h3>Order Items</h3>
            
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($purchaseOrder->items as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $item->product->sku }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>${{ number_format($item->price, 2) }}</td>
                        <td>${{ number_format($item->quantity * $item->price, 2) }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="4" style="text-align: right;">Total:</td>
                        <td>${{ number_format($purchaseOrder->total, 2) }}</td>
                    </tr>
                </tbody>
            </table>
            
            @if($purchaseOrder->notes)
            <div style="margin-top: 20px;">
                <strong>Notes:</strong>
                <p>{{ $purchaseOrder->notes }}</p>
            </div>
            @endif
        </div>
        
        <div class="footer">
            <p>This is an automated notification from your Inventory Management System.</p>
        </div>
    </div>
</body>
</html>
