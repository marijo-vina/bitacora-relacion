import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-40">
      <button 
        (click)="togglePlay()"
        class="group relative w-14 h-14 rounded-full bg-gradient-to-r from-romantic-500 to-road-500 
               shadow-lg shadow-romantic-500/30 hover:shadow-xl hover:shadow-romantic-500/40
               flex items-center justify-center transition-all duration-300
               hover:scale-110 active:scale-95"
        [title]="(isPlaying$ | async) ? 'Pausar música' : 'Reproducir música'"
      >
        <!-- Icono de nota musical cuando está pausado -->
        <svg *ngIf="!(isPlaying$ | async)" 
             xmlns="http://www.w3.org/2000/svg" 
             class="w-6 h-6 text-white" 
             viewBox="0 0 24 24" 
             fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
        
        <!-- Icono de pausa cuando está reproduciendo -->
        <svg *ngIf="isPlaying$ | async" 
             xmlns="http://www.w3.org/2000/svg" 
             class="w-6 h-6 text-white" 
             viewBox="0 0 24 24" 
             fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        
        <!-- Indicador de reproducción -->
        <div *ngIf="isPlaying$ | async" 
             class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse">
        </div>
        
        <!-- Ondas de sonido animadas -->
        <div *ngIf="isPlaying$ | async" 
             class="absolute inset-0 rounded-full border-2 border-white/30 animate-ping">
        </div>
      </button>
      
      <!-- Tooltip con nombre de la canción -->
      <div *ngIf="currentTrack$ | async as track"
           class="absolute bottom-full right-0 mb-2 px-3 py-1 
                  bg-white/90 backdrop-blur-sm rounded-lg shadow-lg
                  text-xs text-gray-600 whitespace-nowrap">
        {{ track }}
      </div>
    </div>
  `
})
export class AudioPlayerComponent {
  isPlaying$ = this.audioService.isPlaying$;
  currentTrack$ = this.audioService.currentTrack$;

  constructor(private audioService: AudioService) {}

  togglePlay(): void {
    this.audioService.toggle();
  }
}
