import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MapService } from '../../core/services/map.service';
import { MapMarker, MapStats } from '../../shared/models/map.model';
import { EntryCategory } from '../../shared/models/entry.model';

declare const L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
              <span>Volver</span>
            </button>
            
            <h1 class="font-romantic font-bold text-lg text-gray-800">Mapa de Aventuras</h1>
            
            <div *ngIf="stats" class="text-sm text-gray-600">
              {{ stats.total_places }} lugar{{ stats.total_places !== 1 ? 'es' : '' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Stats -->
      <div *ngIf="stats" class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex flex-wrap gap-2">
          <div *ngFor="let item of getCategoryStats()" 
               class="px-3 py-1.5 bg-white/80 rounded-full text-sm flex items-center gap-2">
            <span>{{ getCategoryIcon(item.category) }}</span>
            <span class="font-medium">{{ item.count }}</span>
            <span class="text-gray-500">{{ getCategoryLabel(item.category) }}</span>
          </div>
        </div>
      </div>

      <!-- Mapa -->
      <div class="max-w-4xl mx-auto px-4">
        <div class="card-romantic overflow-hidden">
          <div id="map" class="w-full h-[60vh] sm:h-[70vh]"></div>
        </div>
      </div>

      <!-- Lista de lugares -->
      <div *ngIf="markers.length > 0" class="max-w-4xl mx-auto px-4 py-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Nuestros lugares</h2>
        <div class="space-y-3">
          <div *ngFor="let marker of markers" 
               class="card-romantic p-4 cursor-pointer hover:shadow-lg transition-shadow"
               (click)="goToEntry(marker.id)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                   [class.bg-pink-100]="marker.category === 'carta'"
                   [class.text-pink-600]="marker.category === 'carta'"
                   [class.bg-blue-100]="marker.category === 'cita'"
                   [class.text-blue-600]="marker.category === 'cita'"
                   [class.bg-green-100]="marker.category === 'agradecimiento'"
                   [class.text-green-600]="marker.category === 'agradecimiento'"
                   [class.bg-purple-100]="marker.category === 'aniversario'"
                   [class.text-purple-600]="marker.category === 'aniversario'"
                   [class.bg-gray-100]="marker.category === 'otro'"
                   [class.text-gray-600]="marker.category === 'otro'">
                <span class="text-xl">{{ getCategoryIcon(marker.category) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-800 truncate">{{ marker.title }}</h3>
                <p class="text-sm text-gray-500">{{ marker.location.name }}</p>
                <p class="text-xs text-gray-400">{{ marker.event_date | date }}</p>
              </div>
              <div *ngIf="marker.preview_image" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img [src]="marker.preview_image" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any = null;
  markers: MapMarker[] = [];
  stats: MapStats | null = null;
  mapMarkers: any[] = [];

  constructor(
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarkers();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  loadMarkers(): void {
    this.mapService.getMarkers().subscribe({
      next: (response) => {
        this.markers = response.data;
        this.addMarkersToMap();
      }
    });
  }

  loadStats(): void {
    this.mapService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
      }
    });
  }

  initMap(): void {
    if (typeof L === 'undefined') {
      console.error('Leaflet no está cargado');
      return;
    }

    // Centro del mapa (México por defecto)
    this.map = L.map('map').setView([23.6345, -102.5528], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.addMarkersToMap();
  }

  addMarkersToMap(): void {
    if (!this.map || this.markers.length === 0) return;

    // Limpiar marcadores anteriores
    this.mapMarkers.forEach(m => this.map.removeLayer(m));
    this.mapMarkers = [];

    const bounds = L.latLngBounds();

    this.markers.forEach(marker => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                    style="background: ${this.getCategoryColor(marker.category)}">
                 ${this.getCategoryIcon(marker.category)}
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const mapMarker = L.marker(
        [marker.location.latitude, marker.location.longitude],
        { icon: customIcon }
      ).addTo(this.map);

      // Popup con información
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-gray-800 mb-1">${marker.title}</h3>
          <p class="text-sm text-gray-500 mb-2">${marker.location.name}</p>
          ${marker.preview_image ? `<img src="${marker.preview_image}" class="w-full h-24 object-cover rounded-lg mb-2">` : ''}
          <button onclick="window.location.href='/entry/${marker.id}'" 
                  class="w-full px-3 py-1.5 bg-romantic-500 text-white text-sm rounded-full hover:bg-romantic-600">
            Ver entrada
          </button>
        </div>
      `;

      mapMarker.bindPopup(popupContent);
      
      // Evento click
      mapMarker.on('click', () => {
        // this.goToEntry(marker.id);
      });

      this.mapMarkers.push(mapMarker);
      bounds.extend([marker.location.latitude, marker.location.longitude]);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  goToEntry(id: number): void {
    this.router.navigate(['/entry', id]);
  }

  getCategoryStats(): { category: EntryCategory; count: number }[] {
    if (!this.stats) return [];
    return Object.entries(this.stats.by_category).map(([category, count]) => ({
      category: category as EntryCategory,
      count
    }));
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

  getCategoryLabel(category: EntryCategory): string {
    const labels: Record<EntryCategory, string> = {
      carta: 'Cartas',
      cita: 'Citas',
      agradecimiento: 'Agradecimientos',
      aniversario: 'Aniversarios',
      otro: 'Otros'
    };
    return labels[category];
  }

  getCategoryColor(category: EntryCategory): string {
    const colors: Record<EntryCategory, string> = {
      carta: '#fce7f3',
      cita: '#e0f2fe',
      agradecimiento: '#dcfce7',
      aniversario: '#f3e8ff',
      otro: '#f3f4f6'
    };
    return colors[category];
  }
}
