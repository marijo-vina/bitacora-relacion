<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\EntryController;
use App\Http\Controllers\Api\MapController;
use App\Http\Controllers\Api\MediaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Nuestro Diario de Ruta
|--------------------------------------------------------------------------
*/

// Public routes (login only)
Route::post('/login', [AuthController::class, 'login']);

// Debug route for database connection
Route::get('/db-check', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        $count = \Illuminate\Support\Facades\DB::table('users')->count();
        return response()->json([
            'status' => 'success',
            'message' => "Successfully connected to database: $dbName",
            'user_count' => $count
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});

// Manual Seeder Route (Emergency Fix)
Route::get('/seed-db', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = \Illuminate\Support\Facades\Artisan::output();
        
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = \Illuminate\Support\Facades\Artisan::output();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Migrations and Seeds executed successfully',
            'migrate_output' => $migrateOutput,
            'seed_output' => $seedOutput
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Entries (Momentos/Cartas)
    Route::get('/entries/categories', [EntryController::class, 'categories']);
    Route::get('/entries', [EntryController::class, 'index']);
    Route::post('/entries', [EntryController::class, 'store']);
    Route::get('/entries/{entry}', [EntryController::class, 'show']);
    Route::put('/entries/{entry}', [EntryController::class, 'update']);
    Route::delete('/entries/{entry}', [EntryController::class, 'destroy']);
    Route::post('/entries/{entry}/publish', [EntryController::class, 'publish']);
    
    // Media (Galería)
    Route::post('/entries/{entry}/media', [MediaController::class, 'store']);
    Route::put('/media/{media}/description', [MediaController::class, 'updateDescription']);
    Route::post('/entries/{entry}/media/reorder', [MediaController::class, 'reorder']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);
    
    // Comments
    Route::get('/entries/{entry}/comments', [CommentController::class, 'index']);
    Route::post('/entries/{entry}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Map
    Route::get('/map/markers', [MapController::class, 'markers']);
    Route::get('/map/stats', [MapController::class, 'stats']);
    
});
