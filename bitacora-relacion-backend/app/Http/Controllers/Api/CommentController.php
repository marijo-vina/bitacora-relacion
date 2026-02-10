<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Entry;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for an entry.
     */
    public function index(Entry $entry): JsonResponse
    {
        Gate::authorize('view', [Comment::class, $entry]);

        $comments = $entry->comments()->with('user')->get();

        return response()->json([
            'data' => CommentResource::collection($comments)
        ]);
    }

    /**
     * Store a newly created comment.
     */
    public function store(StoreCommentRequest $request, Entry $entry): JsonResponse
    {
        Gate::authorize('create', [Comment::class, $entry]);

        $comment = $entry->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comentario agregado con éxito.',
            'data' => new CommentResource($comment)
        ], 201);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'message' => 'Comentario eliminado con éxito.'
        ]);
    }
}
