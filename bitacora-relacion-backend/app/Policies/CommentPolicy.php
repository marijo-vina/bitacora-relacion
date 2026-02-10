<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Entry;
use App\Models\User;

class CommentPolicy
{
    /**
     * Determine whether the user can view comments on an entry.
     */
    public function view(User $user, Entry $entry): bool
    {
        // If the entry is published, both users can view comments
        if ($entry->status === 'publicado') {
            return true;
        }
        
        // If draft, only the entry author can view comments
        return $entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can create comments on an entry.
     */
    public function create(User $user, Entry $entry): bool
    {
        // Can only comment on published entries
        // And cannot comment on your own entries (optional - remove if you want to allow)
        return $entry->status === 'publicado' && $entry->user_id !== $user->id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        // Only the comment author can delete it
        return $comment->user_id === $user->id;
    }
}
