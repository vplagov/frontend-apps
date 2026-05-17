import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostListComponent } from '../post-list.component';
import { RssService } from '../../services/rss.service';
import { of } from 'rxjs';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let rssService: RssService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PostListComponent],
      providers: [RssService]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    rssService = TestBed.inject(RssService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    const dummyPosts = [
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, isIgnored: false, aiReason: null, dateAdded: '2023-01-01T00:00:00', dateRead: null },
      { id: 2, blogId: 1, blogName: 'Blog 1', name: 'Ignored Post', url: 'url2', isRead: false, isIgnored: true, aiReason: 'Ignored', dateAdded: '2023-01-02T00:00:00', dateRead: null }
    ];
    spyOn(rssService, 'getUnreadPosts').and.returnValue(of(dummyPosts));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.posts()).toEqual([dummyPosts[0]]);
    expect(rssService.getUnreadPosts).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Blog 1');
    expect(fixture.nativeElement.textContent).not.toContain('Ignored Post');
  });

  it('should mark post as read', () => {
    const dummyPosts = [
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, isIgnored: false, aiReason: null, dateAdded: '2023-01-01T00:00:00', dateRead: null }
    ];
    component.posts.set(dummyPosts);
    spyOn(rssService, 'markPostAsRead').and.returnValue(of(undefined));

    component.markAsRead(1);

    expect(rssService.markPostAsRead).toHaveBeenCalledWith(1);
    expect(component.posts().length).toBe(0);
  });

  it('should render icon-only mark as read action', () => {
    const dummyPosts = [
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, isIgnored: false, aiReason: null, dateAdded: '2023-01-01T00:00:00', dateRead: null }
    ];
    spyOn(rssService, 'getUnreadPosts').and.returnValue(of(dummyPosts));

    component.ngOnInit();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-label="Mark as read"]');
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('');
    expect(button.querySelector('svg')).toBeTruthy();
  });
});
