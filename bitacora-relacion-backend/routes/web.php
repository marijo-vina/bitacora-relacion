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
    ]);
});
