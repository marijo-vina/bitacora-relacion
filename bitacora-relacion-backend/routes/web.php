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

// Ruta de Diagnóstico y Reparación (A prueba de fallos)
Route::get('/fix-prod', function () {
    // 0. Forzar visualización de errores PHP
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $results = [
        'timestamp' => now()->toDateTimeString(),
        'status' => 'running_diagnostics',
        'environment' => app()->environment(),
        'php_version' => phpversion(),
    ];

    // 1. Verificar Permisos de Carpetas Críticas
    $pathsToCheck = [
        storage_path(),
        storage_path('logs'),
        storage_path('framework'),
        storage_path('framework/views'),
        storage_path('framework/cache'),
        base_path('bootstrap/cache'),
    ];

    $results['permissions'] = [];
    foreach ($pathsToCheck as $path) {
        // Crear si no existe
        if (!file_exists($path)) {
            @mkdir($path, 0775, true);
        }
        
        $isWritable = is_writable($path);
        $status = $isWritable ? 'OK' : 'FAIL (Not Writable)';
        
        // Intentar arreglar (chmod)
        if (!$isWritable) {
            @chmod($path, 0775);
            $isWritableAfter = is_writable($path);
            $status .= ' -> Fix Attempt: ' . ($isWritableAfter ? 'SUCCESS' : 'FAILED');
        }
        
        $results['permissions'][basename($path)] = $status;
    }

    // 2. Probar Conexión a Base de Datos
    try {
        \DB::connection()->getPdo();
        $results['database'] = 'SUCCESS: Connected to ' . \DB::connection()->getDatabaseName();
    } catch (\Throwable $e) {
        $results['database'] = 'ERROR: ' . $e->getMessage();
    }

    // 3. Ejecutar Comandos Artisan (Uno por uno)
    $commands = [
        'optimize:clear', // Limpia config, views, routes, etc.
        'storage:link',
        'migrate --force',
        'config:cache',   // Regenerar cache al final
        'route:cache',
    ];

    $results['commands'] = [];
    foreach ($commands as $cmdString) {
        try {
            $parts = explode(' ', $cmdString);
            $command = array_shift($parts);
            $params = [];
            foreach ($parts as $part) {
                if (str_starts_with($part, '--')) {
                    $key = substr($part, 2);
                    $params['--'.$key] = true;
                }
            }
            
            \Artisan::call($command, $params);
            $results['commands'][$cmdString] = 'OK: ' . trim(str_replace("\n", " ", \Artisan::output()));
        } catch (\Throwable $e) {
            $results['commands'][$cmdString] = 'ERROR: ' . $e->getMessage();
        }
    }

    return response()->json($results, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
});
