<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Bienvenido a Nuestro Diario de Ruta API',
        'version' => '1.0.0',
        'status' => 'active',
        'timestamp' => now(),
    ]);
});

// Ruta temporal para mantenimiento en producción (sin consola SSH)
Route::get('/fix-prod', function () {
    try {
        $output = [];
        
        // 1. Limpiar caches
        \Artisan::call('config:clear');
        $output[] = 'Config cleared: ' . \Artisan::output();
        
        \Artisan::call('route:clear');
        $output[] = 'Route cleared: ' . \Artisan::output();
        
        \Artisan::call('view:clear');
        $output[] = 'View cleared: ' . \Artisan::output();
        
        // 2. Cachear configuración
        \Artisan::call('config:cache');
        $output[] = 'Config cached: ' . \Artisan::output();
        
        \Artisan::call('route:cache');
        $output[] = 'Route cached: ' . \Artisan::output();
        
        // 3. Storage Link
        try {
            \Artisan::call('storage:link');
            $output[] = 'Storage linked: ' . \Artisan::output();
        } catch (\Exception $e) {
            $output[] = 'Storage link skipped: ' . $e->getMessage();
        }
        
        // 4. Intentar arreglar permisos (si el sistema lo permite)
        if (function_exists('exec')) {
            try {
                exec('chmod -R 775 ../storage ../bootstrap/cache', $execOutput, $returnVar);
                $output[] = 'Permissions chmod result (' . $returnVar . '): ' . implode("\n", $execOutput);
            } catch (\Exception $e) {
                $output[] = 'Permissions error: ' . $e->getMessage();
            }
        }

        // 5. Migraciones
        \Artisan::call('migrate', ['--force' => true]);
        $output[] = 'Migrations: ' . \Artisan::output();

        return response()->json([
            'status' => 'success',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
