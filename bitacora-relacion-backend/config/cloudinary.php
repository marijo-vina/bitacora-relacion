<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your Cloudinary settings. You can find your
    | Cloud Name, API Key, and API Secret in the Cloudinary Dashboard.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),

    'api_key' => env('CLOUDINARY_API_KEY'),

    'api_secret' => env('CLOUDINARY_API_SECRET'),

    'url' => env('CLOUDINARY_URL'),

    /*
    |--------------------------------------------------------------------------
    | Upload Presets
    |--------------------------------------------------------------------------
    |
    | Configure default upload settings for your media files.
    |
    */

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    /*
    |--------------------------------------------------------------------------
    | Folder Structure
    |--------------------------------------------------------------------------
    |
    | Define the folder structure for organizing uploads in Cloudinary.
    |
    */

    'folders' => [
        'entries' => 'nuestro-diario/entries',
    ],

    /*
    |--------------------------------------------------------------------------
    | Transformation Defaults
    |--------------------------------------------------------------------------
    |
    | Default transformation settings for images.
    |
    */

    'transformations' => [
        'thumbnail' => [
            'width' => 300,
            'height' => 300,
            'crop' => 'fill',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ],
        'medium' => [
            'width' => 800,
            'height' => 600,
            'crop' => 'limit',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ],
        'large' => [
            'width' => 1920,
            'height' => 1080,
            'crop' => 'limit',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ],
    ],

];
