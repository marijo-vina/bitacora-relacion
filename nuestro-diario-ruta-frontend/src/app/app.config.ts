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
          // Inyección de dependencia en contexto funcional
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

        // Interceptor de Autenticación (Bearer Token)
        (req, next) => {
          const authService = inject(AuthService);
          const router = inject(Router);
          const token = authService.getToken();

          // Clonar request y agregar header si existe token
          let authReq = req;
          if (token) {
            authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }

          return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
              // Manejar errores 401 Unauthorized
              if (error.status === 401) {
                // Evitar loop infinito si falla el logout
                if (!req.url.includes('/login') && !req.url.includes('/logout')) {
                  authService.clearAuth();
                  router.navigate(['/login']);
                }
              }
              return throwError(() => error);
            })
          );
        }
      ])
    )
  ]
};
