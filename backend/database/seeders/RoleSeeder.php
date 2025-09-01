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
        $superAdmin = Role::create(['name' => 'super_admin']);
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
            'manage_settings',
            'manage_orders',
            'manage_shopify_orders',
            'manage_rooms',
            'manage_units',
            'manage_sku_matrix',
            'manage_sku_units',
            'manage_bins',
            'manage_notifications',
            'manage_support',
            'manage_categories',
            'manage_promotions',
            'manage_crm',
            'manage_export_import',
            'manage_wizards'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign all permissions to super admin
        $superAdmin->givePermissionTo(Permission::all());

        // Assign specific permissions to admin (limited access)
        $admin->givePermissionTo([
            'view_dashboard',
            'manage_customers',
            'manage_products',
            'manage_orders',
            'manage_shopify_orders',
            'manage_rooms',
            'manage_units',
            'manage_sku_matrix',
            'manage_sku_units',
            'view_reports',
            'manage_settings',
            'manage_bins',
            'manage_notifications',
            'manage_support'
        ]);

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
