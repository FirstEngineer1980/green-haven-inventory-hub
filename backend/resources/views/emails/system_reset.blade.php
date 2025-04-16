
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>System Reset Notification</title>
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
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
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
            <h2>System Reset Notification</h2>
        </div>
        <div class="content">
            <div class="alert">
                <strong>Important:</strong> The system has been reset.
            </div>
            
            <p>Hello Admin,</p>
            
            <p>This is to inform you that a system reset has been performed:</p>
            
            <ul>
                <li><strong>Performed by:</strong> {{ $user }}</li>
                <li><strong>Date and Time:</strong> {{ $date }}</li>
            </ul>
            
            <p>The system has been reset to its default settings. User accounts and critical data have been preserved.</p>
            
            <p>Best regards,<br>
            The {{ config('app.name') }} System</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
