
<!DOCTYPE html>
<html>
<head>
    <title>{{ $reportName }}</title>
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
            <h2>{{ $reportName }}</h2>
        </div>
        
        <div class="content">
            <p>Please find attached the {{ $reportName }} report generated from your Inventory Management System.</p>
            <p>This report was automatically generated on {{ date('Y-m-d H:i:s') }}.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from your Inventory Management System.</p>
        </div>
    </div>
</body>
</html>
