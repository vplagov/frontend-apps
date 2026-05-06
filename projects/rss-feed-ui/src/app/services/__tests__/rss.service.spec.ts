import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RssService } from '../rss.service';
import { environment } from '../../../environments/environment';

describe('RssService', () => {
  let service: RssService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RssService]
    });
    service = TestBed.inject(RssService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch unread posts', () => {
    const dummyPosts = [
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, dateAdded: '2023-01-01T00:00:00' }
    ];

    service.getUnreadPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });
});
