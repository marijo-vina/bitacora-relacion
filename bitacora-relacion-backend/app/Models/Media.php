<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'media';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'entry_id',
        'file_path',
        'file_url',
        'file_type',
        'description',
        'display_order',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['url'];

    /**
     * Get the entry that owns this media.
     */
    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    /**
     * Get the full URL for this media file.
     */
    public function getUrlAttribute(): string
    {
        // If file_url is set (Cloudinary), use it
        if ($this->file_url) {
            return $this->file_url;
        }
        
        // Fallback to local storage (for backwards compatibility)
        return Storage::url($this->file_path);
    }

    /**
     * Check if this media is an image.
     */
    public function isImage(): bool
    {
        return $this->file_type === 'image';
    }

    /**
     * Check if this media is a video.
     */
    public function isVideo(): bool
    {
        return $this->file_type === 'video';
    }
}
