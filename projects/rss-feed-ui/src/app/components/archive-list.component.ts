import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RssService } from '../services/rss.service';
import { RssPostResponse } from 'shared-ui';

@Component({
  selector: 'app-archive-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto rss-fade-in">
      <section class="rss-panel p-4 sm:p-6 mb-5 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="text-xs tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400">Archive</p>
            <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Read Posts</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Read-only view of all posts that have already been opened.</p>
          </div>
        </div>
      </section>

      <section *ngIf="archivedPosts().length === 0" class="rss-panel p-10 text-center">
        <p class="text-4xl mb-3">🗂️</p>
        <p class="text-lg font-medium">No archived posts yet</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Read posts will appear here after they are marked as read.</p>
      </section>

      <section *ngIf="archivedPosts().length > 0" class="grid grid-cols-1 gap-4 md:hidden">
        <article *ngFor="let post of archivedPosts()" class="rss-card p-5">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="rss-tag rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">
              {{ post.dateRead | date:'MMM d, y' }}
            </span>
            <span class="rss-tag rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">
              {{ post.blogName }}
            </span>
          </div>

          <a [href]="post.url" target="_blank" class="rss-link text-lg leading-tight font-semibold break-words line-clamp-3">
            {{ post.name }}
          </a>

          <div class="mt-4 text-sm text-slate-600 dark:text-slate-300">
            <span class="font-medium text-slate-700 dark:text-slate-200">AI ignored:</span>
            <span class="ml-1">{{ post.isIgnored ? 'Yes' : '' }}</span>
          </div>

          <div *ngIf="post.aiReason" class="mt-4 relative">
            <button
              type="button"
              (click)="toggleReason(post.id)"
              class="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Reason
            </button>

            <div
              *ngIf="activeReasonPostId === post.id"
              class="absolute left-0 top-full mt-2 z-20 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4"
            >
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">AI reason</p>
              <p class="text-sm leading-6 text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{{ post.aiReason }}</p>
            </div>
          </div>
        </article>
      </section>

      <section *ngIf="archivedPosts().length > 0" class="rss-panel overflow-visible hidden md:block">
        <div class="overflow-x-auto">
          <table class="rss-table">
            <thead>
              <tr>
                <th class="w-40">Date read</th>
                <th class="w-48">Blog</th>
                <th>Post</th>
                <th class="w-32 whitespace-nowrap">ai ignored</th>
                <th class="w-60 whitespace-nowrap">ai reason</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let post of archivedPosts()">
                <td class="whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                  {{ post.dateRead | date:'MMM d, y' }}
                </td>
                <td class="whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                  {{ post.blogName }}
                </td>
                <td>
                  <a [href]="post.url" target="_blank" class="rss-link font-medium line-clamp-2 leading-snug">
                    {{ post.name }}
                  </a>
                </td>
                <td class="whitespace-nowrap">
                  <span *ngIf="post.isIgnored" class="font-medium text-slate-700 dark:text-slate-200">Yes</span>
                </td>
                <td class="relative">
                  <ng-container *ngIf="post.aiReason">
                    <button
                      type="button"
                      (click)="toggleReason(post.id)"
                      class="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      [attr.aria-expanded]="activeReasonPostId === post.id"
                    >
                      Reason
                    </button>

                    <div
                      *ngIf="activeReasonPostId === post.id"
                      class="absolute right-0 top-full mt-2 z-20 w-96 max-w-[24rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4"
                    >
                      <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">AI reason</p>
                      <p class="text-sm leading-6 text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{{ post.aiReason }}</p>
                    </div>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class ArchiveListComponent implements OnInit {
  private rssService = inject(RssService);
  archivedPosts = signal<RssPostResponse[]>([]);
  activeReasonPostId: number | null = null;

  ngOnInit(): void {
    this.loadArchive();
  }

  loadArchive(): void {
    this.activeReasonPostId = null;
    this.rssService.getArchivedPosts().subscribe(posts => this.archivedPosts.set(posts));
  }

  toggleReason(postId: number): void {
    this.activeReasonPostId = this.activeReasonPostId === postId ? null : postId;
  }
}
