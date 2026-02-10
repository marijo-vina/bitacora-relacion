<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Entry\StoreEntryRequest;
use App\Http\Requests\Entry\UpdateEntryRequest;
use App\Http\Resources\EntryDetailResource;
use App\Http\Resources\EntryResource;
use App\Models\Entry;
use App\Services\EntryService;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class EntryController extends Controller
{
    public function __construct(
        private EntryService $entryService,
        private MediaService $mediaService
    ) {}

    /**
     * Display a listing of entries (Timeline).
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $query = Entry::with(['user'])
            ->withCount(['media', 'comments'])
            ->visibleTo($user);

        // Apply filters
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Order by event date (newest first)
        $entries = $query->orderBy('event_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => EntryResource::collection($entries),
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
            ]
        ]);
    }

    /**
     * Store a newly created entry.
     */
    public function store(StoreEntryRequest $request): JsonResponse
    {
        Gate::authorize('create', Entry::class);

        $entry = $this->entryService->create($request->validated(), Auth::id());

        // Process media files if provided
        if ($request->hasFile('media')) {
            $this->mediaService->uploadForEntry(
                $entry, 
                $request->file('media'),
                $request->input('media_descriptions', [])
            );
        }

        return response()->json([
            'message' => $entry->status === 'publicado' 
                ? 'Entrada publicada con éxito.' 
                : 'Borrador guardado con éxito.',
            'data' => new EntryDetailResource($entry->load(['media', 'comments.user', 'user']))
        ], 201);
    }

    /**
     * Display the specified entry.
     */
    public function show(Entry $entry): JsonResponse
    {
        Gate::authorize('view', $entry);

        $entry->load(['media', 'comments.user', 'user']);

        return response()->json([
            'data' => new EntryDetailResource($entry)
        ]);
    }

    /**
     * Update the specified entry.
     */
    public function update(UpdateEntryRequest $request, Entry $entry): JsonResponse
    {
        Gate::authorize('update', $entry);

        $entry = $this->entryService->update($entry, $request->validated());

        return response()->json([
            'message' => 'Entrada actualizada con éxito.',
            'data' => new EntryDetailResource($entry->load(['media', 'comments.user', 'user']))
        ]);
    }

    /**
     * Remove the specified entry from storage.
     */
    public function destroy(Entry $entry): JsonResponse
    {
        Gate::authorize('delete', $entry);

        $this->entryService->delete($entry);

        return response()->json([
            'message' => 'Entrada eliminada con éxito.'
        ]);
    }

    /**
     * Publish a draft entry.
     */
    public function publish(Entry $entry): JsonResponse
    {
        Gate::authorize('publish', $entry);

        $entry->update(['status' => 'publicado']);

        return response()->json([
            'message' => 'Entrada publicada con éxito.',
            'data' => new EntryResource($entry)
        ]);
    }

    /**
     * Get available categories.
     */
    public function categories(): JsonResponse
    {
        $categories = [
            ['value' => 'carta', 'label' => 'Carta'],
            ['value' => 'cita', 'label' => 'Cita'],
            ['value' => 'agradecimiento', 'label' => 'Agradecimiento'],
            ['value' => 'aniversario', 'label' => 'Aniversario'],
            ['value' => 'otro', 'label' => 'Otro'],
        ];

        return response()->json(['data' => $categories]);
    }
}
