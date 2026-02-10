<?php

namespace App\Http\Requests\Entry;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'event_date' => ['required', 'date', 'before_or_equal:today'],
            'category' => ['required', Rule::in(['carta', 'cita', 'agradecimiento', 'aniversario', 'otro'])],
            'status' => ['required', Rule::in(['publicado', 'borrador'])],
            
            // Optional location fields
            'location_name' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            
            // Media files (optional on creation)
            'media' => ['nullable', 'array', 'max:10'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png,mp4,mov,avi', 'max:51200'],
            'media_descriptions' => ['nullable', 'array'],
            'media_descriptions.*' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'content.required' => 'El contenido es obligatorio.',
            'event_date.required' => 'La fecha del evento es obligatoria.',
            'event_date.before_or_equal' => 'La fecha no puede ser futura.',
            'category.required' => 'La categoría es obligatoria.',
            'category.in' => 'La categoría seleccionada no es válida.',
            'status.required' => 'El estado es obligatorio.',
            'latitude.between' => 'La latitud debe estar entre -90 y 90.',
            'longitude.between' => 'La longitud debe estar entre -180 y 180.',
            'media.*.mimes' => 'Los archivos deben ser imágenes (jpg, png) o videos (mp4, mov, avi).',
            'media.*.max' => 'Cada archivo no puede pesar más de 50MB.',
        ];
    }
}
