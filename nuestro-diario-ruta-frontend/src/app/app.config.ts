import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { routes } from './app.routes';
import { catchError, throwError, finalize } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';

// Contador global para peticiones activas
let activeRequests = 0;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        // Interceptor de Loading
        (req, next) => {
          const loadingService = inject(LoadingService);
          
          if (activeRequests === 0) {
            loadingService.show();
          }
          activeRequests++;
          
          return next(req).pipe(
            finalize(() => {
              activeRequests--;
              if (activeRequests === 0) {
                loadingService.hide();
              }
            })
          );
        },
        // Interceptor de Autenticación y CSRF
        (req, next) => {
          // Para peticiones a la API, agregar withCredentials y el token XSRF manualmente
          if (req.url.startsWith('/api') || req.url.startsWith('/sanctum')) {
            // Leer la cookie XSRF-TOKEN
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('XSRF-TOKEN='))
              ?.split('=')[1];
            
            let clonedReq = req.clone({
              withCredentials: true
            });
            
            // Agregar header X-XSRF-TOKEN si existe la cookie y no es la petición de csrf-cookie
            if (token && !req.url.includes('/sanctum/csrf-cookie')) {
              clonedReq = clonedReq.clone({
                setHeaders: {
                  'X-XSRF-TOKEN': decodeURIComponent(token)
                }
              });
            }
            
            return next(clonedReq).pipe(
              catchError((error: HttpErrorResponse) => {
                // Manejar errores 401 Unauthorized
                if (error.status === 401) {
                  const authService = inject(AuthService);
                  const router = inject(Router);
                  authService.clearAuth();
                  router.navigate(['/login']);
                }
                return throwError(() => error);
              })
            );
          }
          return next(req);
        }
      ])
    )
  ]
};
