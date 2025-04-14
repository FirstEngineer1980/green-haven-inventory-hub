
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $manager = Role::create(['name' => 'manager']);
        $staff = Role::create(['name' => 'staff']);

        // Define permissions
        $permissions = [
            'view_dashboard',
            'manage_users',
            'manage_roles',
            'manage_customers',
            'manage_products',
            'manage_inventory',
            'manage_purchase_orders',
            'manage_vendors',
            'view_reports',
            'manage_settings'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign all permissions to admin
        $admin->givePermissionTo(Permission::all());
        
        // Assign specific permissions to manager
        $manager->givePermissionTo([
            'view_dashboard',
            'manage_customers',
            'manage_products',
            'manage_inventory',
            'manage_purchase_orders',
            'manage_vendors',
            'view_reports'
        ]);

        // Assign limited permissions to staff
        $staff->givePermissionTo([
            'view_dashboard',
            'manage_inventory',
            'view_reports'
        ]);
    }
}
