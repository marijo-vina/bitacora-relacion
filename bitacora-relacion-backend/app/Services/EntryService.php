<?php

namespace App\Services;

use App\Models\Entry;
use Illuminate\Support\Facades\Storage;

class EntryService
{
    /**
     * Create a new entry.
     */
    public function create(array $data, int $userId): Entry
    {
        $data['user_id'] = $userId;
        
        return Entry::create($data);
    }

    /**
     * Update an existing entry.
     */
    public function update(Entry $entry, array $data): Entry
    {
        $entry->update($data);
        
        return $entry->fresh();
    }

    /**
     * Delete an entry and all its media files.
     */
    public function delete(Entry $entry): void
    {
        // Delete media files from storage
        foreach ($entry->media as $media) {
            Storage::delete($media->file_path);
        }

        $entry->delete();
    }

    /**
     * Duplicate an entry (for creating from draft).
     */
    public function duplicate(Entry $entry, int $userId): Entry
    {
        $newEntry = $entry->replicate();
        $newEntry->user_id = $userId;
        $newEntry->status = 'borrador';
        $newEntry->title = $entry->title . ' (Copia)';
        $newEntry->save();

        return $newEntry;
    }
}
