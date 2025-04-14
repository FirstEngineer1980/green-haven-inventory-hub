
<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        $vendors = [
            [
                'name' => 'Tech Supplies Co.',
                'contact_name' => 'John Smith',
                'email' => 'john@techsupplies.com',
                'phone' => '1234567893',
                'address' => '123 Tech Street, City, State 12345'
            ],
            [
                'name' => 'Office Solutions Ltd.',
                'contact_name' => 'Jane Doe',
                'email' => 'jane@officesolutions.com',
                'phone' => '1234567894',
                'address' => '456 Office Ave, City, State 12345'
            ],
            [
                'name' => 'Hardware Plus',
                'contact_name' => 'Bob Wilson',
                'email' => 'bob@hardwareplus.com',
                'phone' => '1234567895',
                'address' => '789 Hardware Blvd, City, State 12345'
            ]
        ];

        foreach ($vendors as $vendor) {
            Vendor::create($vendor);
        }
    }
}
