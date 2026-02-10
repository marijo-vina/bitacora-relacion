<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'event_date',
        'category',
        'status',
        'location_name',
        'latitude',
        'longitude',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    /**
     * Get the user who created this entry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all media files associated with this entry.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class)->orderBy('display_order');
    }

    /**
     * Get all comments on this entry.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->orderBy('created_at');
    }

    /**
     * Scope to get only published entries.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'publicado');
    }

    /**
     * Scope to get only draft entries.
     */
    public function scopeDrafts($query)
    {
        return $query->where('status', 'borrador');
    }

    /**
     * Scope to get entries visible to a specific user.
     * (Published entries + user's own drafts)
     */
    public function scopeVisibleTo($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('status', 'publicado')
              ->orWhere(function ($q2) use ($user) {
                  $q2->where('status', 'borrador')
                     ->where('user_id', $user->id);
              });
        });
    }

    /**
     * Scope to filter by category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get only entries with location data.
     */
    public function scopeWithLocation($query)
    {
        return $query->whereNotNull('latitude')
                     ->whereNotNull('longitude');
    }

    /**
     * Check if this entry has location data.
     */
    public function hasLocation(): bool
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    /**
     * Get the Google Maps URL for this location.
     */
    public function getMapUrlAttribute(): ?string
    {
        if (!$this->hasLocation()) {
            return null;
        }
        return "https://www.google.com/maps?q={$this->latitude},{$this->longitude}";
    }
}
