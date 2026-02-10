<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Entry;
use App\Models\Media;
use App\Policies\CommentPolicy;
use App\Policies\EntryPolicy;
use App\Policies\MediaPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Entry::class => EntryPolicy::class,
        Media::class => MediaPolicy::class,
        Comment::class => CommentPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Gate to check if user is an authorized partner
        Gate::define('access-platform', function ($user) {
            $allowedEmails = [
                config('app.partner1_email'),
                config('app.partner2_email')
            ];
            return in_array($user->email, $allowedEmails);
        });
    }
}
