
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'phone' => '1234567890',
            'position' => 'System Administrator',
            'status' => 'active'
        ]);
        $admin->assignRole('admin');

        // Create manager user
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'phone' => '1234567891',
            'position' => 'Inventory Manager',
            'status' => 'active'
        ]);
        $manager->assignRole('manager');

        // Create staff user
        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'phone' => '1234567892',
            'position' => 'Inventory Staff',
            'status' => 'active'
        ]);
        $staff->assignRole('staff');
    }
}
