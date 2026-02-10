<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapMarkerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'location' => [
                'name' => $this->location_name,
                'latitude' => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],
            'event_date' => $this->event_date->format('Y-m-d'),
            'has_media' => $this->media()->exists(),
            'preview_image' => $this->when($this->media()->exists(), function () {
                $firstImage = $this->media()->where('file_type', 'image')->first();
                return $firstImage ? $firstImage->url : null;
            }),
        ];
    }
}
