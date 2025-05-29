<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // In Laravel 11, Passport routes are automatically registered
        // No need to call Passport::routes()

        // Define token scopes if needed
        Passport::tokensCan([
            'view-products' => 'View products',
            'manage-products' => 'Create, update and delete products',
            'view-categories' => 'View categories',
            'manage-categories' => 'Create, update and delete categories',
            'view-users' => 'View users',
            'manage-users' => 'Create, update and delete users',
            'manage-inventory' => 'Manage inventory items',
            'view-promotions' => 'View promotions',
            'manage-promotions' => 'Create, update and delete promotions',
            'view-customers' => 'View customers',
            'manage-customers' => 'Create, update and delete customers',
        ]);

        // Set default scope
        Passport::setDefaultScope([
            'view-products',
            'view-promotions',
            'view-customers',
        ]);

        // Set token expiration (optional)
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
    }
}
