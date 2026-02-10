<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User 1 (Marijose)
        User::create([
            'name' => 'Marijose',
            'email' => config('app.partner1_email', 'tu@email.com'),
            'password' => Hash::make('password123'),
        ]);

        // User 2 (David)
        User::create([
            'name' => 'David',
            'email' => config('app.partner2_email', 'el@email.com'),
            'password' => Hash::make('password123'),
        ]);
    }
}
