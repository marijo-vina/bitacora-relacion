import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <!-- Fondo decorativo -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-0 w-96 h-96 bg-romantic-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-road-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-sunset-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <!-- Card de login -->
      <div class="relative w-full max-w-md">
        <div class="card-romantic p-8">
          <!-- Logo/Icono -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-romantic-400 to-road-400 mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-romantic font-bold text-gradient mb-2">
              Nuestro Diario de Ruta <span class="text-sm font-normal text-gray-400">v1.3</span>
            </h1>
            <p class="text-gray-500 text-sm">
              Un espacio privado para nuestros recuerdos
            </p>
          </div>
          
          <!-- Formulario -->
          <form class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input 
                type="email" 
                [(ngModel)]="credentials.email"
                name="email"
                required
                class="input-romantic"
                placeholder="tu@email.com"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input 
                type="password" 
                [(ngModel)]="credentials.password"
                name="password"
                required
                class="input-romantic"
                placeholder="••••••••"
              >
            </div>
            
            <!-- Error message -->
            <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600 text-center">{{ errorMessage }}</p>
            </div>
            
            <button 
              type="button"
              (click)="onSubmit()"
              [disabled]="isLoading"
              class="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span *ngIf="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ isLoading ? 'Entrando...' : 'Entrar a nuestro diario' }}</span>
            </button>
          </form>
          
          <!-- Decoración inferior -->
          <div class="mt-8 flex items-center justify-center gap-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            <span class="text-xs">🚚💕</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    console.log('LoginComponent: onSubmit disparado'); // DEBUG
    console.log('Datos del formulario:', this.credentials); // DEBUG

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/timeline']);
      },
      error: (error) => {
        console.error('Login error details:', error); // DEBUG: Ver error completo
        this.isLoading = false;
        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.';
        } else {
          this.errorMessage = error.error?.message || `Error (${error.status}): ${error.statusText || 'Desconocido'}`;
        }
      }
    });
  }
}
