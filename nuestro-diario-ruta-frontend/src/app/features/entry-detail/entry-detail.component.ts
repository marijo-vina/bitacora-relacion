import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntryService } from '../../core/services/entry.service';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Entry, EntryCategory } from '../../shared/models/entry.model';
import { Comment } from '../../shared/models/comment.model';
import { User } from '../../shared/models/user.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DateFormatPipe],
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
            
            <!-- Acciones del autor -->
            <div *ngIf="isAuthor" class="flex items-center gap-2">
              <button 
                *ngIf="entry?.status === 'borrador'"
                (click)="publishEntry()"
                [disabled]="isPublishing"
                class="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
              >
                {{ isPublishing ? 'Publicando...' : 'Publicar' }}
              </button>
              <button 
                routerLink="/entry/{{ entry?.id }}/edit"
                class="p-2 rounded-full hover:bg-romantic-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button 
                (click)="deleteEntry()"
                class="p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <div *ngIf="entry" class="max-w-4xl mx-auto px-4 py-6">
        <!-- Header de la entrada -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center"
                 [class.bg-pink-100]="entry.category === 'carta'"
                 [class.text-pink-600]="entry.category === 'carta'"
                 [class.bg-blue-100]="entry.category === 'cita'"
                 [class.text-blue-600]="entry.category === 'cita'"
                 [class.bg-green-100]="entry.category === 'agradecimiento'"
                 [class.text-green-600]="entry.category === 'agradecimiento'"
                 [class.bg-purple-100]="entry.category === 'aniversario'"
                 [class.text-purple-600]="entry.category === 'aniversario'"
                 [class.bg-gray-100]="entry.category === 'otro'"
                 [class.text-gray-600]="entry.category === 'otro'">
              <span class="text-2xl">{{ getCategoryIcon(entry.category) }}</span>
            </div>
            <div>
              <span class="text-xs uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm"
                    [class.text-pink-700]="entry.category === 'carta'"
                    [class.text-blue-700]="entry.category === 'cita'"
                    [class.text-green-700]="entry.category === 'agradecimiento'"
                    [class.text-purple-700]="entry.category === 'aniversario'"
                    [class.text-gray-700]="entry.category === 'otro'">{{ getCategoryLabel(entry.category) }}</span>
              <h1 class="text-2xl sm:text-3xl font-romantic font-bold text-gray-900 mt-2" style="text-shadow: 0 2px 4px rgba(255,255,255,0.8);">{{ entry.title }}</h1>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-4 text-sm bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-full inline-flex">
            <span class="flex items-center gap-1 text-gray-800 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              {{ entry.event_date | dateFormat:'long' }}
            </span>
            <span *ngIf="entry.author" class="flex items-center gap-1 text-gray-800 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {{ entry.author.name }}
            </span>
            <span *ngIf="entry.status === 'borrador'" class="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
              Borrador
            </span>
          </div>
        </div>

        <!-- Contenido -->
        <div class="card-romantic p-6 mb-6">
          <div class="prose prose-romantic max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ entry.content }}</p>
          </div>
        </div>

        <!-- Ubicación -->
        <div *ngIf="entry.location" class="card-romantic p-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-road-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-road-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-800">{{ entry.location.name }}</p>
              <a *ngIf="entry.location.map_url" 
                 [href]="entry.location.map_url" 
                 target="_blank"
                 class="text-sm text-road-600 hover:underline">
                Ver en Google Maps →
              </a>
            </div>
          </div>
        </div>

        <!-- Galería de fotos/videos -->
        <div *ngIf="entry.media && entry.media.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Galería</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div *ngFor="let media of entry.media" class="relative aspect-square rounded-xl overflow-hidden group">
              <img *ngIf="media.is_image" 
                   [src]="media.url" 
                   [alt]="media.description || 'Foto'"
                   class="w-full h-full object-cover transition-transform group-hover:scale-105">
              <video *ngIf="media.is_video" 
                     [src]="media.url" 
                     class="w-full h-full object-cover"
                     controls>
              </video>
              <div *ngIf="media.description" 
                   class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p class="text-white text-xs line-clamp-2">{{ media.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comentarios -->
        <div class="card-romantic p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Comentarios 
            <span *ngIf="comments.length > 0" class="text-sm font-normal text-gray-500">({{ comments.length }})</span>
          </h3>
          
          <!-- Lista de comentarios -->
          <div *ngIf="comments.length > 0" class="space-y-4 mb-6">
            <div *ngFor="let comment of comments" class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-romantic-400 to-road-400 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm font-medium">
                  {{ comment.author?.name?.charAt(0) || '?' }}
                </span>
              </div>
              <div class="flex-1">
                <div class="bg-gray-50 rounded-2xl rounded-tl-none p-3">
                  <p class="text-sm font-medium text-gray-800">{{ comment.author?.name }}</p>
                  <p class="text-gray-600 text-sm">{{ comment.content }}</p>
                </div>
                <div class="flex items-center gap-3 mt-1 ml-1">
                  <span class="text-xs text-gray-400">{{ comment.created_at | dateFormat:'relative' }}</span>
                  <button *ngIf="comment.is_mine" 
                          (click)="deleteComment(comment.id)"
                          class="text-xs text-red-500 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Formulario de comentario -->
          <div *ngIf="entry.status === 'publicado' && !isAuthor" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-romantic-400 to-road-400 flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-medium">
                {{ currentUser?.name?.charAt(0) || '?' }}
              </span>
            </div>
            <div class="flex-1 flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="newComment"
                (keyup.enter)="addComment()"
                placeholder="Escribe un comentario..."
                class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-romantic-400"
              >
              <button 
                (click)="addComment()"
                [disabled]="!newComment.trim() || isAddingComment"
                class="px-4 py-2 bg-romantic-500 text-white rounded-full text-sm font-medium hover:bg-romantic-600 transition-colors disabled:opacity-50"
              >
                {{ isAddingComment ? '...' : 'Enviar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EntryDetailComponent implements OnInit {
  entry: Entry | null = null;
  comments: Comment[] = [];
  currentUser: User | null = null;
  isAuthor = false;
  isPublishing = false;
  isAddingComment = false;
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    const entryId = this.route.snapshot.paramMap.get('id');
    if (entryId) {
      this.loadEntry(+entryId);
    }
  }

  loadEntry(id: number): void {
    this.entryService.getEntry(id).subscribe({
      next: (response) => {
        this.entry = response.data;
        this.isAuthor = this.entry.author?.id === this.currentUser?.id;
        if (this.entry.comments) {
          this.comments = this.entry.comments;
        }
      },
      error: () => {
        this.router.navigate(['/timeline']);
      }
    });
  }

  loadComments(): void {
    if (!this.entry) return;
    this.commentService.getComments(this.entry.id).subscribe({
      next: (response) => {
        this.comments = response.data;
      }
    });
  }

  publishEntry(): void {
    if (!this.entry) return;
    this.isPublishing = true;
    this.entryService.publishEntry(this.entry.id).subscribe({
      next: (response) => {
        this.entry = response.data;
        this.isPublishing = false;
      },
      error: () => {
        this.isPublishing = false;
      }
    });
  }

  deleteEntry(): void {
    if (!this.entry) return;
    if (confirm('¿Estás segura de que quieres eliminar esta entrada?')) {
      this.entryService.deleteEntry(this.entry.id).subscribe({
        next: () => {
          this.router.navigate(['/timeline']);
        }
      });
    }
  }

  addComment(): void {
    if (!this.entry || !this.newComment.trim()) return;
    this.isAddingComment = true;
    this.commentService.createComment(this.entry.id, { content: this.newComment.trim() }).subscribe({
      next: (response) => {
        this.comments.push(response.data);
        this.newComment = '';
        this.isAddingComment = false;
      },
      error: () => {
        this.isAddingComment = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('¿Eliminar este comentario?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
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

  getCategoryLabel(category: EntryCategory): string {
    const labels: Record<EntryCategory, string> = {
      carta: 'Carta',
      cita: 'Cita',
      agradecimiento: 'Agradecimiento',
      aniversario: 'Aniversario',
      otro: 'Otro'
    };
    return labels[category];
  }
}
