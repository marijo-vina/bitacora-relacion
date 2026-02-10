<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Entry;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MediaController extends Controller
{
    public function __construct(
        private MediaService $mediaService
    ) {}

    /**
     * Store media files for an entry.
     */
    public function store(StoreMediaRequest $request, Entry $entry): JsonResponse
    {
        Gate::authorize('create', [Media::class, $entry->id]);

        $media = $this->mediaService->uploadForEntry(
            $entry,
            $request->file('files'),
            $request->input('descriptions', [])
        );

        return response()->json([
            'message' => 'Archivos subidos con éxito.',
            'data' => MediaResource::collection($media)
        ], 201);
    }

    /**
     * Update the description of a media file.
     */
    public function updateDescription(Request $request, Media $media): JsonResponse
    {
        Gate::authorize('view', $media);

        $request->validate([
            'description' => ['nullable', 'string', 'max:500']
        ]);

        $media->update(['description' => $request->description]);

        return response()->json([
            'message' => 'Descripción actualizada.',
            'data' => new MediaResource($media)
        ]);
    }

    /**
     * Reorder media files for an entry.
     */
    public function reorder(Request $request, Entry $entry): JsonResponse
    {
        Gate::authorize('update', $entry);

        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:media,id'],
        ]);

        $this->mediaService->reorder($request->order);

        return response()->json([
            'message' => 'Orden actualizado con éxito.'
        ]);
    }

    /**
     * Remove the specified media from storage.
     */
    public function destroy(Media $media): JsonResponse
    {
        Gate::authorize('delete', $media);

        $this->mediaService->delete($media);

        return response()->json([
            'message' => 'Archivo eliminado con éxito.'
        ]);
    }
}
