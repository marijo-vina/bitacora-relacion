<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
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
            'url' => $this->url,
            'file_type' => $this->file_type,
            'description' => $this->description,
            'display_order' => $this->display_order,
            'is_image' => $this->isImage(),
            'is_video' => $this->isVideo(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
