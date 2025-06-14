<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'backend/api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.1.2:8080',
        'https://5020aa74-8fb2-4204-9261-5971408510aa.lovableproject.com',
        'https://preview--green-haven-inventory-hub-78.lovable.app',
        'https://preview--green-haven-inventory-hub.lovable.app',
        'https://145b2e48-5bdc-472c-911a-bf04de9cdccc.lovableproject.com',
        '*.lovable.app',
    ],

    'allowed_origins_patterns' => [
        '*://preview--*.lovable.app',
        '*://*.lovableproject.com',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
