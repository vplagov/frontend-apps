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
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Blogs</h2>
        <lib-button (clicked)="showAddModal = true">Add New Blog</lib-button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">URL</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let blog of blogs()" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ blog.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <a [href]="blog.feedUrl" target="_blank" class="hover:underline">{{ blog.feedUrl }}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <lib-button (clicked)="fetchLatest(blog.id)" variant="secondary" class="text-xs">Fetch</lib-button>
                    <button (click)="unsubscribe(blog.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Unsubscribe</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Blog Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New RSS Feed</h3>
            <form (ngSubmit)="addBlog()">
              <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name</label>
                <input type="text" [(ngModel)]="newBlog.name" name="name" required 
                       class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">URL</label>
                <input type="url" [(ngModel)]="newBlog.feedUrl" name="url" required 
                       class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div class="flex justify-end gap-2">
                <button type="button" (click)="showAddModal = false" 
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <lib-button type="submit">Add Blog</lib-button>
              </div>
            </form>
          </div>
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
