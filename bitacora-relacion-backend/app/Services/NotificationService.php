<?php

namespace App\Services;

use App\Models\Entry;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Notify the other user when an entry is published.
     */
    public function notifyNewEntry(Entry $entry): void
    {
        $otherUser = User::where('id', '!=', $entry->user_id)
            ->whereIn('email', [
                config('app.partner1_email'),
                config('app.partner2_email')
            ])
            ->first();

        if (!$otherUser) {
            return;
        }

        // Here you can implement:
        // - Email notification
        // - Push notification (Firebase, Pusher, etc.)
        // - Real-time notification with WebSockets
        
        // Simple logging for now:
        Log::info("Nueva entrada publicada: {$entry->title} por {$entry->user->name}");
    }

    /**
     * Notify about a new comment.
     */
    public function notifyNewComment(Entry $entry, User $commenter): void
    {
        $entryAuthor = $entry->user;
        
        if ($entryAuthor->id === $commenter->id) {
            return; // Don't notify if commenting on own entry
        }

        Log::info("Nuevo comentario en '{$entry->title}' por {$commenter->name}");
    }
}
