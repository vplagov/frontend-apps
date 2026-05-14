import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ButtonComponent } from 'shared-ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen px-4 py-10 sm:px-6 flex items-center justify-center">
      <section class="rss-panel w-full max-w-md p-6 sm:p-8 rss-fade-in">
        <p class="text-xs tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400">Welcome back</p>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight">Sign in to Reader Flow</h2>

        <form class="mt-6 space-y-4" (ngSubmit)="onSubmit()">
          <div>
            <label for="username" class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              [(ngModel)]="username"
              class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Username"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              [(ngModel)]="password"
              class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Password"
            >
          </div>

          <div *ngIf="error" class="text-red-600 text-sm">{{ error }}</div>

          <div class="pt-1 [&>button]:!w-full [&>button]:!rounded-xl [&>button]:!py-2.5 [&>button]:!font-medium">
            <lib-button type="submit">Sign in</lib-button>
          </div>

          <div class="text-center pt-1">
            <a routerLink="/register" class="text-sm rss-link hover:underline">Don't have an account? Register</a>
          </div>
        </form>
      </section>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = '';

  onSubmit() {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Invalid username or password'
    });
  }
}
