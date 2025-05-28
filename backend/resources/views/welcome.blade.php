
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Inventory System</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f9fafb;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .status-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .status-success {
            background: #dcfce7;
            color: #166534;
        }
        .status-error {
            background: #fee2e2;
            color: #991b1b;
        }
        h1 {
            color: #111827;
            margin-bottom: 2rem;
        }
        h2 {
            color: #374151;
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }
        .info {
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Inventory System</h1>

        <div class="status-card">
            <h2>System Status</h2>
            <div class="info">
                Database Connection:
{{--                @if($dbStatus)--}}
{{--                    <span class="status status-success">Connected</span>--}}
{{--                @else--}}
{{--                    <span class="status status-error">Not Connected</span>--}}
{{--                @endif--}}
            </div>
{{--            <div class="info">PHP Version: {{ $phpVersion }}</div>--}}
{{--            <div class="info">Laravel Version: {{ $laravelVersion }}</div>--}}
        </div>

        <div class="status-card">
            <h2>Next Steps</h2>
            <div class="info">1. Configure your environment variables in .env file</div>
            <div class="info">2. Run database migrations: php artisan migrate</div>
            <div class="info">3. Seed the database: php artisan db:seed</div>
            <div class="info">4. Access the API endpoints</div>
        </div>
    </div>
</body>
</html>
