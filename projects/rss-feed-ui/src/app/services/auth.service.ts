import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from 'shared-ui';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<UserResponse | null>(this.getUserFromStorage());

  register(request: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem('rss_token', response.token);
        localStorage.setItem('rss_user', JSON.stringify({ id: response.id, username: response.username }));
        this.currentUser.set({ id: response.id, username: response.username, email: '' });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('rss_token');
    localStorage.removeItem('rss_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('rss_token');
  }

  private getUserFromStorage(): UserResponse | null {
    const userStr = localStorage.getItem('rss_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
