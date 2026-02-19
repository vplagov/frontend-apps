import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Using Signals for state management (Angular's modern way)
  private readonly _token = signal<string | null>(localStorage.getItem('token'));

  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(token: string): void {
    localStorage.setItem('token', token);
    this._token.set(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);
  }
}
