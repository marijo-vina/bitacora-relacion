<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->date('event_date');
            $table->enum('category', ['carta', 'cita', 'agradecimiento', 'aniversario', 'otro'])
                  ->default('carta');
            $table->enum('status', ['publicado', 'borrador'])
                  ->default('borrador');
            
            // Campos para el Mapa de Aventuras
            $table->string('location_name')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->timestamps();
            
            // Índices para búsquedas frecuentes
            $table->index(['status', 'event_date']);
            $table->index('category');
            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
