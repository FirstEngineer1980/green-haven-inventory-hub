<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PassportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a password client for OAuth
        DB::table('oauth_clients')->insert([
            'id' => 1,
            'name' => 'Personal Access Client',
            'secret' => Str::random(40),
            'provider' => 'users',
            'redirect' => 'http://localhost',
            'personal_access_client' => 1,
            'password_client' => 0,
            'revoked' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a standard password grant client
        DB::table('oauth_clients')->insert([
            'id' => 2,
            'name' => 'Password Grant Client',
            'secret' => 'RWLvB1BjmVM2c0tLDWZFfNgozZNvk6VIhEogQOo5',  // This would typically be secure and environment-specific
            'provider' => 'users',
            'redirect' => 'http://localhost',
            'personal_access_client' => 0,
            'password_client' => 1,
            'revoked' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create the personal access clients record
        DB::table('oauth_personal_access_clients')->insert([
            'client_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
