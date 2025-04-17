
<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        // Try to get first admin user for association
        $user = User::first();

        // If no user exists, create one
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'phone' => '1234567890',
                'position' => 'Administrator',
                'status' => 'active'
            ]);
        }

        $customers = [
            [
                'name' => 'XYZ Corporation',
                'contact_name' => 'Alice Johnson',
                'email' => 'alice@xyzcorp.com',
                'phone' => '1234567896',
                'address' => '321 Corp Street, City, State 12345',
                'status' => 'active',
                'user_id' => $user->id
            ],
            [
                'name' => 'ABC Industries',
                'contact_name' => 'Mike Brown',
                'email' => 'mike@abcindustries.com',
                'phone' => '1234567897',
                'address' => '654 Industry Road, City, State 12345',
                'status' => 'active',
                'user_id' => $user->id
            ]
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
