import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingAnimationComponent } from './shared/components/loading-animation/loading-animation.component';
import { AudioPlayerComponent } from './shared/components/audio-player/audio-player.component';
import { AudioService } from './core/services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    LoadingAnimationComponent,
    AudioPlayerComponent
  ],
  template: `
    <!-- Corazones flotantes -->
    <div class="floating-hearts">
      <div class="heart">❤️</div>
      <div class="heart">💕</div>
      <div class="heart">💖</div>
      <div class="heart">💗</div>
      <div class="heart">💝</div>
    </div>
    
    <app-loading-animation></app-loading-animation>
    <router-outlet></router-outlet>
    <app-audio-player></app-audio-player>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Nuestro Diario de Ruta';

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Cargar canción de Keane (debes reemplazar con tu URL)
    this.audioService.loadTrack('/assets/audio/Odisseo-LosImanes.mp3', 'Odisseo - Los Imanes');
  }
}


 