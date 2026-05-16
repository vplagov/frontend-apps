import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RssService } from '../services/rss.service';
import { RssBlogResponse, RssNewBlogRequest, RssUpdateBlogRequest } from 'shared-ui';
import { ButtonComponent } from 'shared-ui';

interface BlogFormState {
  name: string;
  feedUrl: string;
  isSubscribed: boolean;
  useAiFiltering: boolean;
}

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
            <lib-button (clicked)="openAddModal()">Add New Blog</lib-button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:hidden">
        <article *ngFor="let blog of blogs()" class="rss-card p-5">
          <h3 class="font-semibold text-lg mb-1 break-words">{{ blog.name }}</h3>
          <a [href]="blog.feedUrl" target="_blank" class="rss-link text-sm break-all mb-4 block">{{ blog.feedUrl }}</a>
          <div class="mb-4 text-sm text-slate-600 dark:text-slate-300">
            AI Filtering:
            <span class="font-medium">{{ blog.useAiFiltering ? 'Enabled' : 'Disabled' }}</span>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <div class="flex-1 [&>button]:!w-full [&>button]:!rounded-xl [&>button]:!py-2 [&>button]:!text-sm">
              <lib-button (clicked)="fetchLatest(blog.id)" variant="secondary">Fetch</lib-button>
            </div>
            <button (click)="openEditModal(blog)" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline">Edit</button>
            <button (click)="unsubscribe(blog.id)" class="px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:underline">Unsubscribe</button>
          </div>
        </article>
      </section>

      <section class="rss-panel overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="rss-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Feed URL</th>
                <th>AI Filtering</th>
                <th class="w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let blog of blogs()">
                <td class="font-semibold text-slate-700 dark:text-slate-300">{{ blog.name }}</td>
                <td>
                  <a [href]="blog.feedUrl" target="_blank" class="rss-link">{{ blog.feedUrl }}</a>
                </td>
                <td>
                  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium" [class.bg-emerald-100]="blog.useAiFiltering" [class.text-emerald-700]="blog.useAiFiltering" [class.bg-slate-100]="!blog.useAiFiltering" [class.text-slate-600]="!blog.useAiFiltering">
                    {{ blog.useAiFiltering ? 'Enabled' : 'Disabled' }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="inline-flex items-center gap-3">
                    <div class="[&>button]:!rounded-lg [&>button]:!text-xs [&>button]:!px-3 [&>button]:!py-1.5">
                      <lib-button (clicked)="fetchLatest(blog.id)" variant="secondary">Fetch</lib-button>
                    </div>
                    <button (click)="openEditModal(blog)" class="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline">Edit</button>
                    <button (click)="unsubscribe(blog.id)" class="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Unsubscribe</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4">
        <div class="rss-panel w-full max-w-md p-5 sm:p-6 rss-fade-in">
          <h3 class="text-lg font-semibold mb-4">{{ editingBlogId === null ? 'Add New RSS Feed' : 'Edit Blog' }}</h3>
          <form (ngSubmit)="saveBlog()" class="space-y-4">
            <div>
              <label for="blog-name" class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">Name</label>
              <input
                id="blog-name"
                type="text"
                [(ngModel)]="blogForm.name"
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
                [(ngModel)]="blogForm.feedUrl"
                name="url"
                required
                class="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div *ngIf="editingBlogId !== null" class="space-y-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <label class="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  [(ngModel)]="blogForm.isSubscribed"
                  name="isSubscribed"
                  class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Subscribed
              </label>
              <label class="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  [(ngModel)]="blogForm.useAiFiltering"
                  name="useAiFiltering"
                  class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                AI Filtering
              </label>
            </div>
            <div class="flex justify-end gap-2 pt-1">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <div class="[&>button]:!rounded-xl [&>button]:!px-4 [&>button]:!py-2 [&>button]:!text-sm">
                <lib-button type="submit">{{ editingBlogId === null ? 'Add Blog' : 'Save Changes' }}</lib-button>
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
  showModal = false;
  editingBlogId: number | null = null;
  blogForm: BlogFormState = this.createEmptyBlogForm();

  ngOnInit(): void {
    this.loadBlogs();
  }

  private createEmptyBlogForm(): BlogFormState {
    return {
      name: '',
      feedUrl: '',
      isSubscribed: true,
      useAiFiltering: false
    };
  }

  loadBlogs(): void {
    this.rssService.getBlogs().subscribe(blogs => this.blogs.set(blogs));
  }

  openAddModal(): void {
    this.editingBlogId = null;
    this.blogForm = this.createEmptyBlogForm();
    this.showModal = true;
  }

  openEditModal(blog: RssBlogResponse): void {
    this.editingBlogId = blog.id;
    this.blogForm = {
      name: blog.name,
      feedUrl: blog.feedUrl,
      isSubscribed: blog.isSubscribed,
      useAiFiltering: blog.useAiFiltering
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBlogId = null;
    this.blogForm = this.createEmptyBlogForm();
  }

  saveBlog(): void {
    if (!this.blogForm.name || !this.blogForm.feedUrl) {
      return;
    }

    if (this.editingBlogId === null) {
      const newBlog: RssNewBlogRequest = {
        name: this.blogForm.name,
        feedUrl: this.blogForm.feedUrl
      };

      this.rssService.addBlog(newBlog).subscribe(() => {
        this.closeModal();
        this.loadBlogs();
      });
      return;
    }

    const updateBlog: RssUpdateBlogRequest = {
      name: this.blogForm.name,
      feedUrl: this.blogForm.feedUrl,
      isSubscribed: this.blogForm.isSubscribed,
      useAiFiltering: this.blogForm.useAiFiltering
    };

    this.rssService.updateBlog(this.editingBlogId, updateBlog).subscribe(() => {
      this.closeModal();
      this.loadBlogs();
    });
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
