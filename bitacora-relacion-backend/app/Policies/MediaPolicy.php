<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;

class MediaPolicy
{
    /**
     * Determine whether the user can view the media.
     */
    public function view(User $user, Media $media): bool
    {
        // If the entry is published, both users can view
        if ($media->entry->status === 'publicado') {
            return true;
        }
        
        // If draft, only the entry author can view
        return $media->entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can add media.
     */
    public function create(User $user, $entryId): bool
    {
        // Only the entry author can add media
        $entry = \App\Models\Entry::find($entryId);
        return $entry && $entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the media.
     */
    public function delete(User $user, Media $media): bool
    {
        // Only the entry author can delete media
        return $media->entry->user_id === $user->id;
    }
}
