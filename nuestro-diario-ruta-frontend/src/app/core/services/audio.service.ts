import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();
  
  private currentTrackSubject = new BehaviorSubject<string>('');
  public currentTrack$ = this.currentTrackSubject.asObservable();

  constructor() {}

  loadTrack(url: string, title: string = ''): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    
    this.audio = new Audio(url);
    this.audio.loop = true;
    this.currentTrackSubject.next(title);
  }

  play(): void {
    if (this.audio) {
      this.audio.play().then(() => {
        this.isPlayingSubject.next(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }

  toggle(): void {
    if (this.isPlayingSubject.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }
}
