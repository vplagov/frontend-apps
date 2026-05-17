import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'shared-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ButtonComponent],
  template: `
    <div class="rss-shell text-slate-900 dark:text-slate-100">
      <nav class="rss-nav sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="h-16 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 sm:gap-8 min-w-0">
              <span class="text-lg sm:text-xl font-semibold tracking-tight text-teal-700 dark:text-teal-300">Reader Flow</span>
              <div class="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-1">
                <a
                  routerLink="/posts"
                  routerLinkActive="bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  class="px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Posts
                </a>
                <a
                  routerLink="/blogs"
                  routerLinkActive="bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  class="px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Blogs
                </a>
                <a
                  routerLink="/archive"
                  routerLinkActive="bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  class="px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Archive
                </a>
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-sm text-slate-500 dark:text-slate-300 hidden md:block">{{ authService.currentUser()?.username }}</span>
              <div class="[&>button]:!rounded-full [&>button]:!px-4 [&>button]:!py-1.5">
                <lib-button (clicked)="authService.logout()" variant="secondary">
                  Logout
                </lib-button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  public authService = inject(AuthService);
}
