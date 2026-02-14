<?php

// Debugging: Force error display
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require __DIR__.'/../vendor/autoload.php';

    $app = require_once __DIR__.'/../bootstrap/app.php';

    // Verificar si es una app Laravel 11 (estructura diferente)
    if ($app instanceof \Illuminate\Foundation\Application) {
         $app->handleRequest(\Illuminate\Http\Request::capture());
    } else {
         // Fallback legacy (Laravel <11 o estructura custom)
         $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
         $response = $kernel->handle(
             $request = Illuminate\Http\Request::capture()
         );
         $response->send();
         $kernel->terminate($request, $response);
    }

} catch (\Throwable $e) {
    // Si algo falla catastróficamente, imprimir el error directamente
    http_response_code(500);
    header('Content-Type: text/plain');
    echo "CRITICAL STARTUP ERROR:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "\nTrace:\n" . $e->getTraceAsString();
    exit(1);
}
