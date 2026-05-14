import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RssService } from '../services/rss.service';
import { RssBlogResponse, RssNewBlogRequest } from 'shared-ui';
import { ButtonComponent } from 'shared-ui';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="max-w-6xl mx-auto rss-fade-in">
      <section class="rss-panel p-4 sm:p-6 mb-5 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p class="text-xs tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400">Subscriptions</p>
            <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Manage Blogs</h2>
          </div>
          <div class="[&>button]:!rounded-full [&>button]:!px-4 [&>button]:!py-2">
            <lib-button (clicked)="showAddModal = true">Add New Blog</lib-button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-4 md:hidden">
        <article *ngFor="let blog of blogs()" class="rss-card p-4">
          <h3 class="font-semibold text-base mb-2 break-words">{{ blog.name }}</h3>
          <a [href]="blog.feedUrl" target="_blank" class="rss-link text-sm break-all">{{ blog.feedUrl }}</a>
          <div class="flex items-center gap-2 mt-4">
            <div class="[&>button]:!rounded-lg [&>button]:!text-xs [&>button]:!px-3 [&>button]:!py-1.5">
              <lib-button (clicked)="fetchLatest(blog.id)" variant="secondary">Fetch</lib-button>
            </div>
            <button (click)="unsubscribe(blog.id)" class="text-sm text-red-600 dark:text-red-400 hover:underline">Unsubscribe</button>
          </div>
        </article>
      </section>

      <section class="rss-panel overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50/80 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Feed URL</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let blog of blogs()" class="border-b border-slate-200/80 dark:border-slate-700/80 last:border-b-0">
                <td class="px-6 py-4 text-sm font-medium">{{ blog.name }}</td>
                <td class="px-6 py-4 text-sm">
                  <a [href]="blog.feedUrl" target="_blank" class="rss-link">{{ blog.feedUrl }}</a>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex items-center gap-3">
                    <div class="[&>button]:!rounded-lg [&>button]:!text-xs [&>button]:!px-3 [&>button]:!py-1.5">
                      <lib-button (clicked)="fetchLatest(blog.id)" variant="secondary">Fetch</lib-button>
                    </div>
                    <button (click)="unsubscribe(blog.id)" class="text-sm text-red-600 dark:text-red-400 hover:underline">Unsubscribe</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div *ngIf="showAddModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4">
        <div class="rss-panel w-full max-w-md p-5 sm:p-6 rss-fade-in">
          <h3 class="text-lg font-semibold mb-4">Add New RSS Feed</h3>
          <form (ngSubmit)="addBlog()" class="space-y-4">
            <div>
              <label for="blog-name" class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">Name</label>
              <input
                id="blog-name"
                type="text"
                [(ngModel)]="newBlog.name"
                name="name"
                required
                class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label for="blog-url" class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">URL</label>
              <input
                id="blog-url"
                type="url"
                [(ngModel)]="newBlog.feedUrl"
                name="url"
                required
                class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div class="flex justify-end gap-2 pt-1">
              <button
                type="button"
                (click)="showAddModal = false"
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <div class="[&>button]:!rounded-xl [&>button]:!px-4 [&>button]:!py-2 [&>button]:!text-sm">
                <lib-button type="submit">Add Blog</lib-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class BlogListComponent implements OnInit {
  private rssService = inject(RssService);
  blogs = signal<RssBlogResponse[]>([]);
  showAddModal = false;
  newBlog: RssNewBlogRequest = { name: '', feedUrl: '' };

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.rssService.getBlogs().subscribe(blogs => this.blogs.set(blogs));
  }

  addBlog(): void {
    if (this.newBlog.name && this.newBlog.feedUrl) {
      this.rssService.addBlog(this.newBlog).subscribe(() => {
        this.showAddModal = false;
        this.newBlog = { name: '', feedUrl: '' };
        this.loadBlogs();
      });
    }
  }

  unsubscribe(id: number): void {
    if (confirm('Are you sure you want to unsubscribe from this blog?')) {
      this.rssService.unsubscribeFromBlog(id).subscribe(() => {
        this.loadBlogs();
      });
    }
  }

  fetchLatest(id: number): void {
    this.rssService.fetchLatestForBlog(id).subscribe(msg => {
      alert(msg);
    });
  }
}
