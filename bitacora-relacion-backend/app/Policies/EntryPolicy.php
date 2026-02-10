<?php

namespace App\Policies;

use App\Models\Entry;
use App\Models\User;

class EntryPolicy
{
    /**
     * Determine whether the user can view the entry.
     */
    public function view(User $user, Entry $entry): bool
    {
        // If published, both users can view
        if ($entry->status === 'publicado') {
            return true;
        }
        
        // If draft, only the author can view
        return $entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can create entries.
     */
    public function create(User $user): bool
    {
        // Both users can create entries
        return true;
    }

    /**
     * Determine whether the user can update the entry.
     */
    public function update(User $user, Entry $entry): bool
    {
        // Only the author can edit
        return $entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the entry.
     */
    public function delete(User $user, Entry $entry): bool
    {
        // Only the author can delete
        return $entry->user_id === $user->id;
    }

    /**
     * Determine whether the user can publish the entry.
     */
    public function publish(User $user, Entry $entry): bool
    {
        // Only the author can change status to published
        return $entry->user_id === $user->id;
    }
}
