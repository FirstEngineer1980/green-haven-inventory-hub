
<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['https://frontend.myphr.io', 'https://preview--green-haven-inventory-hub.lovable.app', 'http://localhost:3000'],

    'allowed_origins_patterns' => ['#^https://.*\.lovable\.app$#'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
