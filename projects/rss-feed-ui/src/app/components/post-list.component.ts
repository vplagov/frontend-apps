import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RssService } from '../services/rss.service';
import { RssPostResponse } from 'shared-ui';
import { ButtonComponent } from 'shared-ui';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="max-w-6xl mx-auto rss-fade-in">
      <section class="rss-panel p-4 sm:p-6 mb-5 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-xs tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400">Unread feed</p>
            <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Recent Posts</h2>
          </div>
          <div class="[&>button]:!rounded-full [&>button]:!px-4 [&>button]:!py-2">
            <lib-button (clicked)="fetchLatest()" variant="secondary" class="whitespace-nowrap">Fetch Latest</lib-button>
          </div>
        </div>
      </section>

      <div *ngIf="posts().length === 0" class="rss-panel p-10 text-center">
        <p class="text-4xl mb-3">📰</p>
        <p class="text-lg font-medium">No unread posts right now</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Run "Fetch Latest" to refresh your feed.</p>
      </div>

      <section *ngIf="posts().length > 0" class="md:hidden space-y-4">
        <article *ngFor="let post of posts()" class="rss-card p-5 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="rss-tag rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">{{ post.dateAdded | date:'MMM d, y' }}</span>
              <span class="rss-tag rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">{{ post.blogName }}</span>
            </div>

            <a [href]="post.url" target="_blank" class="rss-link text-lg leading-tight font-semibold break-words line-clamp-3">
              {{ post.name }}
            </a>
          </div>

          <div class="mt-5 [&>button]:!w-full [&>button]:!rounded-xl [&>button]:!py-2.5 [&>button]:!font-medium">
            <lib-button (clicked)="markAsRead(post.id)">
              Mark as read
            </lib-button>
          </div>
        </article>
      </section>

      <section *ngIf="posts().length > 0" class="rss-panel overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="rss-table">
            <thead>
              <tr>
                <th class="w-32">Date</th>
                <th class="w-48">Blog</th>
                <th>Title</th>
                <th class="w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let post of posts()">
                <td class="whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                  {{ post.dateAdded | date:'MMM d, y' }}
                </td>
                <td class="whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                  {{ post.blogName }}
                </td>
                <td>
                  <a [href]="post.url" target="_blank" class="rss-link font-medium line-clamp-2 leading-snug">
                    {{ post.name }}
                  </a>
                </td>
                <td class="text-right">
                  <div class="inline-flex [&>button]:!rounded-lg [&>button]:!text-xs [&>button]:!px-3 [&>button]:!py-1.5">
                    <lib-button (clicked)="markAsRead(post.id)" variant="secondary">
                      Mark as read
                    </lib-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class PostListComponent implements OnInit {
  private rssService = inject(RssService);
  posts = signal<RssPostResponse[]>([]);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.rssService.getUnreadPosts().subscribe(posts => this.posts.set(posts));
  }

  markAsRead(id: number): void {
    this.rssService.markPostAsRead(id).subscribe(() => {
      this.posts.update(posts => posts.filter(p => p.id !== id));
    });
  }

  fetchLatest(): void {
    this.rssService.fetchLatestPosts().subscribe(msg => {
      alert(msg);
      setTimeout(() => this.loadPosts(), 2000);
    });
  }
}
