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
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Posts</h2>
        <div class="flex gap-2">
           <lib-button (clicked)="fetchLatest()" variant="secondary">Fetch Latest</lib-button>
           <lib-button (clicked)="cleanup()" variant="secondary">Cleanup</lib-button>
        </div>
      </div>
      
      <div *ngIf="posts().length === 0" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <p class="text-gray-500 dark:text-gray-400">No posts available</p>
      </div>
      
      <div *ngIf="posts().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let post of posts()" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-colors duration-200 flex flex-col justify-between">
          <div>
            <div class="mb-2 flex justify-between">
              <span class="text-gray-500 dark:text-gray-400 text-xs">ID: {{ post.id }}</span>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ post.dateAdded | date:'yyyy-MM-dd' }}</span>
            </div>
            
            <div class="mb-3">
              <a [href]="post.url" 
                 target="_blank" 
                 class="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 break-words line-clamp-2">
                {{ post.name }}
              </a>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">Blog: {{ post.blogName }}</p>
          </div>
          
          <div class="mt-4">
            <lib-button (clicked)="markAsRead(post.id)" class="w-full">
              Mark as read
            </lib-button>
          </div>
        </div>
      </div>
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

  cleanup(): void {
    this.rssService.cleanupPosts().subscribe(() => {
      this.loadPosts();
    });
  }
}
