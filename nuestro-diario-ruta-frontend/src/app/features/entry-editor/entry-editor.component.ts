import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntryService } from '../../core/services/entry.service';
import { Entry, EntryCategory, CreateEntryRequest, UpdateEntryRequest, CategoryOption } from '../../shared/models/entry.model';

declare const L: any;

@Component({
  selector: 'app-entry-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen pb-20">
      <!-- Header -->
      <header class="sticky top-0 z-30 glass-effect border-b border-romantic-100">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <button 
              routerLink="/timeline"
              class="flex items-center gap-2 text-gray-600 hover:text-romantic-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <span>Cancelar</span>
            </button>
            
            <h1 class="font-romantic font-bold text-lg text-gray-800">
              {{ isEditing ? 'Editar entrada' : 'Nueva entrada' }}
            </h1>
            
            <div class="flex items-center gap-2">
              <button 
                (click)="saveAsDraft()"
                [disabled]="isSaving"
                class="px-4 py-2 text-romantic-600 font-medium hover:bg-romantic-50 rounded-full transition-colors"
              >
                {{ isSaving && savingAsDraft ? 'Guardando...' : 'Guardar borrador' }}
              </button>
              <button 
                (click)="publish()"
                [disabled]="isSaving"
                class="btn-primary"
              >
                {{ isSaving && !savingAsDraft ? 'Publicando...' : 'Publicar' }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Formulario -->
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="card-romantic p-6 space-y-6">
          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let cat of categories"
                      type="button"
                      (click)="entry.category = cat.value"
                      [class.ring-2]="entry.category === cat.value"
                      [class.ring-romantic-500]="entry.category === cat.value"
                      class="px-4 py-2 rounded-full border transition-all"
                      [class.bg-romantic-50]="entry.category === cat.value"
                      [class.border-romantic-300]="entry.category === cat.value"
                      [class.bg-white]="entry.category !== cat.value"
                      [class.border-gray-200]="entry.category !== cat.value">
                <span class="mr-1">{{ getCategoryIcon(cat.value) }}</span>
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Título -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input 
              type="text" 
              [(ngModel)]="entry.title"
              placeholder="¿Qué quieres recordar?"
              class="input-romantic"
            >
          </div>

          <!-- Fecha del evento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha del evento</label>
            <input 
              type="date" 
              [(ngModel)]="entry.event_date"
              class="input-romantic"
            >
          </div>

          <!-- Contenido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
            <textarea 
              [(ngModel)]="entry.content"
              rows="8"
              placeholder="Escribe aquí tus pensamientos, recuerdos, sentimientos..."
              class="input-romantic resize-none"
            ></textarea>
          </div>

          <!-- Ubicación -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Ubicación (opcional)</label>
              <button 
                type="button"
                (click)="toggleMap()"
                class="text-sm text-romantic-600 hover:underline"
              >
                {{ showMap ? 'Ocultar mapa' : 'Seleccionar en mapa' }}
              </button>
            </div>
            
            <input 
              type="text" 
              [(ngModel)]="entry.location_name"
              placeholder="Nombre del lugar (ej: Playa del Carmen)"
              class="input-romantic mb-2"
            >
            
            <!-- Mapa -->
            <div *ngIf="showMap" class="relative">
              <div id="map" class="w-full h-64 rounded-xl border border-gray-200"></div>
              <p class="text-xs text-gray-500 mt-1">Haz clic en el mapa para seleccionar la ubicación</p>
            </div>
          </div>

          <!-- Fotos/Videos -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fotos y videos</label>
            
            <!-- Input de archivos -->
            <div class="relative">
              <input 
                type="file" 
                #fileInput
                (change)="onFilesSelected($event)"
                multiple
                accept="image/*,video/*"
                capture="environment"
                class="hidden"
              >
              <button 
                type="button"
                (click)="fileInput.click()"
                class="w-full py-8 border-2 border-dashed border-romantic-300 rounded-xl 
                       hover:border-romantic-500 hover:bg-romantic-50 transition-all
                       flex flex-col items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-romantic-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <span class="text-romantic-600 font-medium">Toca para subir fotos o videos</span>
                <span class="text-sm text-gray-400">También puedes usar la cámara</span>
              </button>
            </div>
            
            <!-- Preview de archivos seleccionados -->
            <div *ngIf="selectedFiles.length > 0" class="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div *ngFor="let file of selectedFiles; let i = index" class="relative aspect-square rounded-xl overflow-hidden">
                <img *ngIf="file.type.startsWith('image')" 
                     [src]="file.preview" 
                     class="w-full h-full object-cover">
                <div *ngIf="file.type.startsWith('video')" 
                     class="w-full h-full bg-gray-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                
                <!-- Botón eliminar -->
                <button 
                  (click)="removeFile(i)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full 
                         flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
                
                <!-- Input para descripción -->
                <input 
                  type="text" 
                  [(ngModel)]="file.description"
                  placeholder="Descripción..."
                  class="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs 
                         placeholder-white/70 border-none outline-none"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EntryEditorComponent implements OnInit {
  isEditing = false;
  entryId: number | null = null;
  categories: CategoryOption[] = [];
  
  entry: CreateEntryRequest = {
    title: '',
    content: '',
    event_date: new Date().toISOString().split('T')[0],
    category: 'carta',
    status: 'borrador'
  };
  
  selectedFiles: { file: File; preview: string; description: string; type: string }[] = [];
  showMap = false;
  map: any = null;
  marker: any = null;
  
  isSaving = false;
  savingAsDraft = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.entryId = +id;
      this.loadEntry(+id);
    }
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  loadCategories(): void {
    this.entryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      }
    });
  }

  loadEntry(id: number): void {
    this.entryService.getEntry(id).subscribe({
      next: (response) => {
        const data = response.data;
        this.entry = {
          title: data.title,
          content: data.content,
          event_date: data.event_date,
          category: data.category,
          status: data.status,
          location_name: data.location?.name,
          latitude: data.location?.latitude,
          longitude: data.location?.longitude
        };
      }
    });
  }

  initMap(): void {
    if (typeof L === 'undefined') return;
    
    setTimeout(() => {
      const lat = this.entry.latitude || 20.9674;
      const lng = this.entry.longitude || -89.5926;
      
      this.map = L.map('map').setView([lat, lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.map);
      
      if (this.entry.latitude && this.entry.longitude) {
        this.marker = L.marker([this.entry.latitude, this.entry.longitude]).addTo(this.map);
      }
      
      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.entry.latitude = lat;
        this.entry.longitude = lng;
        
        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        } else {
          this.marker = L.marker([lat, lng]).addTo(this.map);
        }
      });
    }, 100);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFiles.push({
          file,
          preview: e.target?.result as string,
          description: '',
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  saveAsDraft(): void {
    this.savingAsDraft = true;
    this.save('borrador');
  }

  publish(): void {
    this.savingAsDraft = false;
    this.save('publicado');
  }

  save(status: 'publicado' | 'borrador'): void {
    if (!this.entry.title || !this.entry.content) {
      alert('Por favor completa el título y el contenido');
      return;
    }

    this.isSaving = true;
    this.entry.status = status;

    const request: CreateEntryRequest = {
      ...this.entry,
      media: this.selectedFiles.map(f => f.file),
      media_descriptions: this.selectedFiles.map(f => f.description)
    };

    if (this.isEditing && this.entryId) {
      const updateRequest: UpdateEntryRequest = {
        title: this.entry.title,
        content: this.entry.content,
        event_date: this.entry.event_date,
        category: this.entry.category,
        status: this.entry.status,
        location_name: this.entry.location_name,
        latitude: this.entry.latitude,
        longitude: this.entry.longitude
      };
      
      this.entryService.updateEntry(this.entryId, updateRequest).subscribe({
        next: () => {
          this.router.navigate(['/entry', this.entryId]);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      this.entryService.createEntry(request).subscribe({
        next: (response) => {
          this.router.navigate(['/entry', response.data.id]);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  getCategoryIcon(category: EntryCategory): string {
    const icons: Record<EntryCategory, string> = {
      carta: '💌',
      cita: '💑',
      agradecimiento: '🙏',
      aniversario: '🎉',
      otro: '📝'
    };
    return icons[category];
  }
}
