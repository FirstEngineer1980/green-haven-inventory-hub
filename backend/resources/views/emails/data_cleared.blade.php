
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Data Clearing Notification</title>
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
        .alert {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Data Clearing Notification</h2>
        </div>
        <div class="content">
            <div class="alert">
                <strong>Warning:</strong> All system data has been cleared.
            </div>
            
            <p>Hello Admin,</p>
            
            <p>This is to inform you that all data has been cleared from the system:</p>
            
            <ul>
                <li><strong>Performed by:</strong> {{ $user }}</li>
                <li><strong>Date and Time:</strong> {{ $date }}</li>
            </ul>
            
            <p>This action has removed all operational data from the system. User accounts have been preserved.</p>
            
            <p>Best regards,<br>
            The {{ config('app.name') }} System</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
