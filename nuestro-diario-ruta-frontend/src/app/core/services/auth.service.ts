import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private userKey = 'user_data';
  private tokenKey = 'auth_token';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Login con Token (sin CSRF cookie previo necesario para mobile/cross-domain)
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
      }),
      // Si falla el logout (token invalido), limpiamos localmente igual
      catchError(() => {
        this.clearAuth();
        return of(null);
      })
    );
  }

  getMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.setUser(response.user);
      })
    );
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    this.setUser(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  public setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
