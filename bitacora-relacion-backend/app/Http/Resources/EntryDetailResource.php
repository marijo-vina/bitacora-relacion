<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryDetailResource extends JsonResource
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
            'content' => $this->content,
            'event_date' => $this->event_date->format('Y-m-d'),
            'category' => $this->category,
            'status' => $this->status,
            'author' => new UserResource($this->whenLoaded('user')),
            'location' => $this->when($this->hasLocation(), [
                'name' => $this->location_name,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'map_url' => $this->map_url,
            ]),
            'media' => MediaResource::collection($this->whenLoaded('media')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
