import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntryService } from '../../core/services/entry.service';
import { AuthService } from '../../core/services/auth.service';
import { Entry, EntryCategory, EntryFilters } from '../../shared/models/entry.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { NostalgiaPipe } from '../../shared/pipes/nostalgia.pipe';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DateFormatPipe, NostalgiaPipe],
  template: `
    <div class="min-h-screen pb-20 relative">
      <!-- Header -->
      <header class="sticky top-0 z-30 glass-effect border-b border-white/30">
        <div class="max-w-2xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-romantic-500 via-sunset-400 to-road-500 flex items-center justify-center shadow-lg shadow-romantic-300/50 relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white animate-heart-beat" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-road-500 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xs">🚚</span>
                </div>
              </div>
              <div>
                <h1 class="font-romantic font-bold text-xl bg-gradient-to-r from-romantic-600 via-sunset-600 to-road-600 bg-clip-text text-transparent">Cabina de Recuerdos</h1>
                <p *ngIf="currentUser" class="text-sm text-gray-600 font-medium">En ruta contigo, {{ currentUser.name }} ✨</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button 
                routerLink="/map"
                class="p-3 rounded-2xl bg-gradient-to-br from-road-100 to-road-200 hover:from-road-200 hover:to-road-300 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                title="Ver mapa de aventuras"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-road-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
              </button>
              <button 
                (click)="logout()"
                class="p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-red-100 hover:to-red-200 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Filters -->
      <div class="max-w-2xl mx-auto px-4 py-6">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filtro de categoría -->
          <select 
            [(ngModel)]="filters.category"
            (change)="applyFilters()"
            class="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-lg border-3 border-road-400/60 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:border-road-500 focus:ring-4 focus:ring-road-200/50 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27%230ea5e9%27%3E%3Cpath d=%27M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: 12px center; background-size: 18px;"
          >
            <option [ngValue]="undefined">🏷️ Todas las categorías</option>
            <option *ngFor="let cat of categories" [value]="cat.value">{{ getCategoryIcon(cat.value) }} {{ cat.label }}</option>
          </select>
          
          <!-- Filtro de estado -->
          <select 
            [(ngModel)]="filters.status"
            (change)="applyFilters()"
            class="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-lg border-3 border-road-400/60 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:border-road-500 focus:ring-4 focus:ring-road-200/50 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27%230ea5e9%27%3E%3Cpath d=%27M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: 12px center; background-size: 18px;"
          >
            <option [ngValue]="undefined">📋 Todos los estados</option>
            <option value="publicado">✅ Publicados</option>
            <option value="borrador">✏️ Borradores</option>
          </select>
          
          <!-- Modo nostalgia -->
          <button 
            (click)="toggleNostalgia()"
            [class.bg-gradient-to-r]="showNostalgia"
            [class.from-sunset-400]="showNostalgia"
            [class.to-sunset-500]="showNostalgia"
            [class.text-white]="showNostalgia"
            [class.shadow-lg]="showNostalgia"
            [class.shadow-sunset-300]="showNostalgia"
            [class.bg-white/90]="!showNostalgia"
            [class.text-sunset-600]="!showNostalgia"
            class="px-5 py-3 backdrop-blur-sm border-2 border-sunset-300/50 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Hace un año</span>
          </button>
          
          <!-- Botón nuevo -->
          <button 
            routerLink="/entry/new"
            class="ml-auto btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span class="hidden sm:inline">Nueva entrada</span>
            <span class="sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>

      <!-- Timeline -->
      <div class="max-w-2xl mx-auto px-4">
        <div *ngIf="entries.length === 0 && !isLoading" class="text-center py-20">
          <!-- Contenedor con fondo semi-transparente para mejorar legibilidad -->
          <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50 max-w-lg mx-auto">
            <div class="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-romantic-100 via-sunset-100 to-road-100 flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-romantic-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-romantic font-bold bg-gradient-to-r from-romantic-600 via-sunset-600 to-road-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">El camino comienza aquí</h3>
            <p class="text-gray-800 font-medium mb-6">Tu bitácora de viaje está lista para guardar cada momento, cada sonrisa, cada aventura juntos 🚚✨</p>
            <button routerLink="/entry/new" class="px-8 py-4 bg-gradient-to-r from-romantic-500 via-romantic-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-romantic-400/40 hover:shadow-romantic-400/60 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 active:scale-95">
              ✍️ Crear primera entrada
            </button>
          </div>
        </div>

        <div class="space-y-5">
          <div *ngFor="let entry of (showNostalgia ? (entries | nostalgia:showNostalgia) : entries); trackBy: trackByEntryId" 
               class="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 hover:shadow-black/30 border-2 border-white/40 p-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
               style="backdrop-filter: blur(16px);"
               (click)="viewEntry(entry.id)">
            <!-- Header de la entrada -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <!-- Categoría icono -->
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                     [class.bg-gradient-to-br]="true"
                     [class.from-pink-100]="entry.category === 'carta'"
                     [class.to-romantic-200]="entry.category === 'carta'"
                     [class.from-blue-100]="entry.category === 'cita'"
                     [class.to-road-200]="entry.category === 'cita'"
                     [class.from-green-100]="entry.category === 'agradecimiento'"
                     [class.to-emerald-200]="entry.category === 'agradecimiento'"
                     [class.from-purple-100]="entry.category === 'aniversario'"
                     [class.to-purple-200]="entry.category === 'aniversario'"
                     [class.from-gray-100]="entry.category === 'otro'"
                     [class.to-gray-200]="entry.category === 'otro'">
                  <span class="text-2xl drop-shadow-sm">{{ getCategoryIcon(entry.category) }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800 line-clamp-1 mb-1">{{ entry.title }}</h3>
                  <p class="text-xs text-gray-500 font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                    </svg>
                    {{ entry.event_date | dateFormat:'long' }}
                    <span *ngIf="entry.author" class="flex items-center gap-1">
                      <span class="text-gray-400">·</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {{ entry.author.name }}
                    </span>
                  </p>
                </div>
              </div>
              
              <!-- Estado -->
              <span *ngIf="entry.status === 'borrador'" 
                    class="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 text-xs font-semibold rounded-xl border border-yellow-200 shadow-sm">
                ✏️ Borrador
              </span>
            </div>
            
            <!-- Contenido preview -->
            <p class="text-gray-700 text-base leading-relaxed line-clamp-3 mb-4 px-1 font-['Georgia',serif] italic">"{{ entry.content }}"</p>
            
            <!-- Footer con metadatos -->
            <div class="flex items-center flex-wrap gap-4 pt-3 border-t border-gray-100">
              <span *ngIf="entry.has_media" class="flex items-center gap-1.5 text-xs font-medium text-romantic-600 bg-romantic-50 px-3 py-1.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                {{ entry.media_count }} foto{{ entry.media_count !== 1 ? 's' : '' }}
              </span>
              
              <span *ngIf="entry.comments_count" class="flex items-center gap-1.5 text-xs font-medium text-road-600 bg-road-50 px-3 py-1.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                </svg>
                {{ entry.comments_count }} comentario{{ entry.comments_count !== 1 ? 's' : '' }}
              </span>
              
              <span *ngIf="entry.location" class="flex items-center gap-1.5 text-xs font-medium text-sunset-600 bg-sunset-50 px-3 py-1.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ entry.location.name }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Load more -->
        <div *ngIf="hasMorePages" class="text-center py-8">
          <button 
            (click)="loadMore()"
            [disabled]="isLoading"
            class="px-8 py-3 bg-white/90 backdrop-blur-sm text-road-600 font-semibold rounded-2xl border-2 border-road-300/50 hover:border-road-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <svg *ngIf="!isLoading" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <svg *ngIf="isLoading" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <span>{{ isLoading ? 'Cargando recuerdos...' : 'Ver más recuerdos' }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class TimelineComponent implements OnInit {
  entries: Entry[] = [];
  categories: { value: EntryCategory; label: string }[] = [];
  filters: EntryFilters = {};
  showNostalgia = false;
  isLoading = false;
  currentPage = 1;
  hasMorePages = false;
  currentUser: User | null = null;

  constructor(
    private entryService: EntryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadCategories();
    this.loadEntries();
  }

  loadCategories(): void {
    this.entryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // El interceptor manejará el error 401 automáticamente
      }
    });
  }

  loadEntries(page: number = 1): void {
    this.isLoading = true;
    this.entryService.getEntries(this.filters, page).subscribe({
      next: (response) => {
        if (page === 1) {
          this.entries = response.data;
        } else {
          this.entries = [...this.entries, ...response.data];
        }
        this.currentPage = response.meta.current_page;
        this.hasMorePages = response.meta.current_page < response.meta.last_page;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadEntries(1);
  }

  toggleNostalgia(): void {
    this.showNostalgia = !this.showNostalgia;
  }

  loadMore(): void {
    if (!this.isLoading && this.hasMorePages) {
      this.loadEntries(this.currentPage + 1);
    }
  }

  viewEntry(id: number): void {
    this.router.navigate(['/entry', id]);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Si hay error (ej. 401), limpiamos y redirigimos de todos modos
        this.authService.clearAuth();
        this.router.navigate(['/login']);
      }
    });
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

  trackByEntryId(index: number, entry: Entry): number {
    return entry.id;
  }
}
