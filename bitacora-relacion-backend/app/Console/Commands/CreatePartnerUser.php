<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreatePartnerUser extends Command
{
    protected $signature = 'user:create-partner {email} {name} {password}';
    protected $description = 'Crea un usuario para la pareja';

    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $password = $this->argument('password');

        // Verificar si ya existe
        if (User::where('email', $email)->exists()) {
            $this->error("❌ El usuario con email {$email} ya existe.");
            return 1;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $this->info("✅ Usuario creado exitosamente:");
        $this->line("   ID: {$user->id}");
        $this->line("   Nombre: {$user->name}");
        $this->line("   Email: {$user->email}");
        
        return 0;
    }
}
