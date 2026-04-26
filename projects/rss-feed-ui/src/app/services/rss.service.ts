import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RssPostResponse, RssBlogResponse, RssNewBlogRequest } from 'shared-ui';

@Injectable({
  providedIn: 'root'
})
export class RssService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Posts
  getUnreadPosts(): Observable<RssPostResponse[]> {
    return this.http.get<RssPostResponse[]>(`${this.apiUrl}/posts`);
  }

  markPostAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/${id}/mark-as-read`, {});
  }

  fetchLatestPosts(): Observable<string> {
    return this.http.post(`${this.apiUrl}/posts/fetch-latest`, {}, { responseType: 'text' });
  }

  cleanupPosts(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/cleanup`, {});
  }

  // Blogs
  getBlogs(): Observable<RssBlogResponse[]> {
    return this.http.get<RssBlogResponse[]>(`${this.apiUrl}/blogs`);
  }

  addBlog(request: RssNewBlogRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/blogs`, request);
  }

  unsubscribeFromBlog(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/blogs/${id}/unsubscribe`, {});
  }

  fetchLatestForBlog(id: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/blogs/${id}/fetch-latest`, {}, { responseType: 'text' });
  }
}
