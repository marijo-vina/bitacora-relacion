<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // En Producción, forzar HTTPS
        if($this->app->environment('production')) {
            \URL::forceScheme('https');
        }

        // Asegurar que existan los directorios de almacenamiento en Railway
        $paths = [
            storage_path('framework/views'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('logs'),
        ];

        foreach ($paths as $path) {
            if (!is_dir($path)) {
                @mkdir($path, 0775, true);
            }
        }
    }
}
