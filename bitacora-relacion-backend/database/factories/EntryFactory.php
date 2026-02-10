<?php

namespace Database\Factories;

use App\Models\Entry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entry>
 */
class EntryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Entry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['carta', 'cita', 'agradecimiento', 'aniversario', 'otro'];
        $statuses = ['publicado', 'borrador'];
        
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'event_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'category' => fake()->randomElement($categories),
            'status' => fake()->randomElement($statuses),
            'location_name' => fake()->optional()->city(),
            'latitude' => fake()->optional()->latitude(),
            'longitude' => fake()->optional()->longitude(),
        ];
    }

    /**
     * Indicate that the entry is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'publicado',
        ]);
    }

    /**
     * Indicate that the entry is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'borrador',
        ]);
    }
}
