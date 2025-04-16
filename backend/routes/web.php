
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    try {
        // Test database connection
        DB::connection()->getPdo();
        $dbStatus = true;
    } catch (\Exception $e) {
        $dbStatus = false;
    }

    return view('welcome', [
        'dbStatus' => $dbStatus,
        'phpVersion' => PHP_VERSION,
        'laravelVersion' => app()->version(),
    ]);
});

