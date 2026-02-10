import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading$ | async" class="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div class="relative">
        <!-- Fondo decorativo -->
        <div class="absolute inset-0 bg-gradient-to-r from-romantic-100 via-road-100 to-sunset-100 rounded-full blur-3xl opacity-50"></div>
        
        <!-- Animación del doble remolque -->
        <div class="relative flex flex-col items-center">
          <!-- Carretera animada -->
          <div class="w-screen h-3 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 mb-8 overflow-hidden fixed top-1/2 left-0">
            <div class="h-full w-full bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent animate-pulse"></div>
            <!-- Líneas de carretera -->
            <div class="absolute top-1/2 left-0 w-full h-1 flex gap-8 -translate-y-1/2">
              <div class="flex-1 h-full bg-white/80 rounded animate-pulse" style="animation-delay: 0s;"></div>
              <div class="flex-1 h-full bg-white/80 rounded animate-pulse" style="animation-delay: 0.2s;"></div>
              <div class="flex-1 h-full bg-white/80 rounded animate-pulse" style="animation-delay: 0.4s;"></div>
              <div class="flex-1 h-full bg-white/80 rounded animate-pulse" style="animation-delay: 0.6s;"></div>
            </div>
          </div>
          
          <!-- Camión con doble remolque SVG - animación oscillante -->
          <div class="relative" style="animation: truckBounce 0.5s ease-in-out infinite;">
            <svg width="200" height="80" viewBox="0 0 200 80">
              <!-- Primera caja (remolque delantero) -->
              <rect x="10" y="20" width="60" height="40" rx="4" fill="#ec4899" class="drop-shadow-lg"/>
              <rect x="15" y="25" width="50" height="20" rx="2" fill="#fce7f3"/>
              
              <!-- Segunda caja (remolque trasero) -->
              <rect x="75" y="20" width="60" height="40" rx="4" fill="#0ea5e9" class="drop-shadow-lg"/>
              <rect x="80" y="25" width="50" height="20" rx="2" fill="#e0f2fe"/>
              
              <!-- Cabina -->
              <rect x="140" y="25" width="45" height="35" rx="4" fill="#f97316" class="drop-shadow-lg"/>
              <rect x="155" y="30" width="25" height="18" rx="2" fill="#ffedd5"/>
              
              <!-- Ruedas con animación de rotación -->
              <g class="animate-spin origin-center" style="transform-origin: 30px 62px;">
                <circle cx="30" cy="62" r="8" fill="#374151"/>
                <circle cx="30" cy="62" r="3" fill="#6b7280"/>
              </g>
              <g class="animate-spin origin-center" style="transform-origin: 50px 62px;">
                <circle cx="50" cy="62" r="8" fill="#374151"/>
                <circle cx="50" cy="62" r="3" fill="#6b7280"/>
              </g>
              <g class="animate-spin origin-center" style="transform-origin: 95px 62px;">
                <circle cx="95" cy="62" r="8" fill="#374151"/>
                <circle cx="95" cy="62" r="3" fill="#6b7280"/>
              </g>
              <g class="animate-spin origin-center" style="transform-origin: 115px 62px;">
                <circle cx="115" cy="62" r="8" fill="#374151"/>
                <circle cx="115" cy="62" r="3" fill="#6b7280"/>
              </g>
              <g class="animate-spin origin-center" style="transform-origin: 155px 62px;">
                <circle cx="155" cy="62" r="8" fill="#374151"/>
                <circle cx="155" cy="62" r="3" fill="#6b7280"/>
              </g>
              <g class="animate-spin origin-center" style="transform-origin: 175px 62px;">
                <circle cx="175" cy="62" r="8" fill="#374151"/>
                <circle cx="175" cy="62" r="3" fill="#6b7280"/>
              </g>
              
              <!-- Corazón decorativo -->
              <path d="M100 10 C100 5, 95 0, 90 0 C85 0, 80 5, 80 10 C80 15, 100 25, 100 25 C100 25, 120 15, 120 10 C120 5, 115 0, 110 0 C105 0, 100 5, 100 10" 
                    fill="#ec4899" class="animate-heart-beat"/>
            </svg>
          </div>
          
          <!-- Texto -->
          <p class="mt-6 text-lg font-romantic text-romantic-600 animate-pulse">
            Cargando nuestros recuerdos...
          </p>
          <!-- Emoji del camión -->
          <p class="text-4xl mt-2 animate-bounce">🚚</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes truckBounce {
      0%, 100% { 
        transform: translateY(0px); 
      }
      50% { 
        transform: translateY(-3px); 
      }
    }
  `]
})
export class LoadingAnimationComponent {
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
