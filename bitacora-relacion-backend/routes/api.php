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
