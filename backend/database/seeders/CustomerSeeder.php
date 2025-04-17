
<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        // Get first admin user for association
        $user = User::first();
        
        if (!$user) {
            // If no user exists, we can't proceed
            return;
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
