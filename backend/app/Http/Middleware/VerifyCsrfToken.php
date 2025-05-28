<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*', // Exclude all API routes from CSRF protection as we use Sanctum instead
        'sanctum/csrf-cookie', // Allow fetching CSRF cookie without verification
        'login',
        'logout',
        'register',
        'dashboard',
//        'register',
//        'register',
//        'register',
    ];

    /**
     * Add additional handling to check if the request has valid authorization
     */
    protected function tokensMatch($request)
    {
        // Check if this is an API request first
        if (strpos($request->path(), 'api/') === 0) {
            // For API requests, we'll assume they're protected by Sanctum authentication
            return true;
        }

        // For non-API requests, use the parent CSRF token validation
        return parent::tokensMatch($request);
    }
}
