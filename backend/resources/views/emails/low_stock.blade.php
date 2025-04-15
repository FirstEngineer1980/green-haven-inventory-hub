
<!DOCTYPE html>
<html>
<head>
    <title>Low Stock Alert</title>
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
            <h2>Low Stock Alert</h2>
        </div>
        
        <div class="content">
            <p>This is to inform you that the following products have reached or fallen below their minimum stock threshold:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Current Stock</th>
                        <th>Threshold</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($products as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->sku }}</td>
                        <td>{{ $product->quantity }}</td>
                        <td>{{ $product->threshold }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            
            <p>Please take necessary action to restock these items.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from your Inventory Management System.</p>
        </div>
    </div>
</body>
</html>
