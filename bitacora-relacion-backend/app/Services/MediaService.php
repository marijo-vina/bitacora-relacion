<?php

namespace App\Services;

use App\Models\Entry;
use App\Models\Media;
use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Base directory for storage.
     */
    private string $basePath = 'entries';

    /**
     * Cloudinary instance.
     */
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key' => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    /**
     * Upload media files for an entry.
     *
     * @param Entry $entry
     * @param array<UploadedFile> $files
     * @param array<string> $descriptions
     * @return array<Media>
     */
    public function uploadForEntry(Entry $entry, array $files, array $descriptions = []): array
    {
        $uploaded = [];
        $order = $entry->media()->max('display_order') ?? 0;

        foreach ($files as $index => $file) {
            $order++;
            $uploaded[] = $this->uploadSingle($entry, $file, $descriptions[$index] ?? null, $order);
        }

        return $uploaded;
    }

    /**
     * Upload a single file.
     */
    private function uploadSingle(Entry $entry, UploadedFile $file, ?string $description, int $order): Media
    {
        $fileType = $this->determineFileType($file);
        $fileName = $this->generateFileName($file);
        
        // Upload to Cloudinary
        $folder = config('cloudinary.folders.entries') . '/' . $entry->id;
        
        $uploadOptions = [
            'folder' => $folder,
            'public_id' => pathinfo($fileName, PATHINFO_FILENAME),
            'resource_type' => $fileType === 'video' ? 'video' : 'image',
            'overwrite' => false,
            'use_filename' => true,
        ];

        // Upload file to Cloudinary
        $uploadResult = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            $uploadOptions
        );

        // Store the Cloudinary public_id and secure_url
        return $entry->media()->create([
            'file_path' => $uploadResult['public_id'],
            'file_type' => $fileType,
            'file_url' => $uploadResult['secure_url'],
            'description' => $description,
            'display_order' => $order,
        ]);
    }

    /**
     * Determine if file is image or video.
     */
    private function determineFileType(UploadedFile $file): string
    {
        $mimeType = $file->getMimeType();
        
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }
        
        // Fallback by extension
        $extension = strtolower($file->getClientOriginalExtension());
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        
        return in_array($extension, $imageExtensions) ? 'image' : 'video';
    }

    /**
     * Generate a unique file name.
     */
    private function generateFileName(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $uniqueId = Str::random(20);
        $timestamp = now()->format('Ymd_His');
        
        return "{$timestamp}_{$uniqueId}.{$extension}";
    }

    /**
     * Reorder media files.
     *
     * @param array<int> $order Array of media IDs in new order
     */
    public function reorder(array $order): void
    {
        foreach ($order as $index => $mediaId) {
            Media::where('id', $mediaId)->update(['display_order' => $index + 1]);
        }
    }

    /**
     * Delete a media file.
     */
    public function delete(Media $media): void
    {
        // Delete from Cloudinary
        try {
            $resourceType = $media->file_type === 'video' ? 'video' : 'image';
            $this->cloudinary->uploadApi()->destroy(
                $media->file_path,
                ['resource_type' => $resourceType]
            );
        } catch (\Exception $e) {
            Log::error('Error deleting from Cloudinary: ' . $e->getMessage());
        }
        
        $media->delete();
    }

    /**
     * Generate thumbnail for images (optional).
     */
    public function generateThumbnail(Media $media, int $width = 300, int $height = 300): ?string
    {
        if (!$media->isImage()) {
            return null;
        }

        // Use Cloudinary transformation to generate thumbnail
        $transformation = [
            'width' => $width,
            'height' => $height,
            'crop' => 'fill',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ];

        return $this->cloudinary->image($media->file_path)
            ->addTransformation($transformation)
            ->toUrl();
    }

    /**
     * Get transformed image URL.
     */
    public function getTransformedUrl(Media $media, string $transformation = 'medium'): ?string
    {
        if (!$media->isImage()) {
            return $media->file_url;
        }

        $config = config("cloudinary.transformations.{$transformation}");
        
        if (!$config) {
            return $media->file_url;
        }

        return $this->cloudinary->image($media->file_path)
            ->addTransformation($config)
            ->toUrl();
    }
}
