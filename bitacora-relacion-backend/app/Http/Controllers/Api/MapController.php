<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MapMarkerResource;
use App\Models\Entry;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MapController extends Controller
{
    /**
     * Get all markers for the map.
     */
    public function markers(): JsonResponse
    {
        $user = Auth::user();

        $markers = Entry::with(['media'])
            ->visibleTo($user)
            ->withLocation()
            ->published()
            ->orderBy('event_date', 'desc')
            ->get();

        return response()->json([
            'data' => MapMarkerResource::collection($markers)
        ]);
    }

    /**
     * Get map statistics.
     */
    public function stats(): JsonResponse
    {
        $user = Auth::user();

        $totalPlaces = Entry::visibleTo($user)
            ->published()
            ->withLocation()
            ->count();

        $categories = Entry::visibleTo($user)
            ->published()
            ->withLocation()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return response()->json([
            'data' => [
                'total_places' => $totalPlaces,
                'by_category' => $categories,
            ]
        ]);
    }
}
