<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://myphr.io',
        'https://preview--green-haven-inventory-hub.lovable.app',
        'http://localhost:3000',
        'https://green-haven-inventory-hub.lovable.app'
    ],

    'allowed_origins_patterns' => ['#^https://.*\.lovable\.app$#'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
