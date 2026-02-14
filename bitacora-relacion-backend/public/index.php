<?php

use Illuminate\Http\Request;

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

// Verificar si es una app Laravel 11 (estructura diferente)
if ($app instanceof \Illuminate\Foundation\Application) {
     $app->handleRequest(Request::capture());
} else {
     // Fallback legacy (Laravel <11 o estructura custom)
     $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
     $response = $kernel->handle(
         $request = Request::capture()
     );
     $response->send();
     $kernel->terminate($request, $response);
}
