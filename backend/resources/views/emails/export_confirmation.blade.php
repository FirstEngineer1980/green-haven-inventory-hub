
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Data Export Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            border-bottom: 2px solid #ddd;
        }
        .content {
            padding: 20px;
            background-color: #fff;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Data Export Confirmation</h2>
        </div>
        <div class="content">
            <p>Hello {{ $user }},</p>
            
            <p>This is to confirm that you have exported data from the system:</p>
            
            <table>
                <tr>
                    <th>Export Type</th>
                    <td>{{ $type }}</td>
                </tr>
                <tr>
                    <th>File Name</th>
                    <td>{{ $filename }}</td>
                </tr>
                <tr>
                    <th>Export Date</th>
                    <td>{{ $date }}</td>
                </tr>
                <tr>
                    <th>Record Count</th>
                    <td>{{ $recordCount }}</td>
                </tr>
            </table>
            
            <p>Please remember that this data may contain sensitive information. Handle it according to your organization's data security policies.</p>
            
            <p>Best regards,<br>
            The {{ config('app.name') }} System</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
