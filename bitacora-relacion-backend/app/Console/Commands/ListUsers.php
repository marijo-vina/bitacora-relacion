<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ListUsers extends Command
{
    protected $signature = 'user:list';
    protected $description = 'Lista todos los usuarios registrados';

    public function handle()
    {
        $users = User::all(['id', 'name', 'email', 'created_at']);

        if ($users->isEmpty()) {
            $this->warn("⚠️  No hay usuarios registrados.");
            return 0;
        }

        $this->info("📋 Usuarios registrados:");
        $this->newLine();

        $this->table(
            ['ID', 'Nombre', 'Email', 'Creado'],
            $users->map(fn($user) => [
                $user->id,
                $user->name,
                $user->email,
                $user->created_at->format('Y-m-d H:i:s')
            ])
        );

        return 0;
    }
}
