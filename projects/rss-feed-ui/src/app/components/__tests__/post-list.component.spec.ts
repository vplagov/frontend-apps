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
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, dateAdded: '2023-01-01T00:00:00' }
    ];
    spyOn(rssService, 'getUnreadPosts').and.returnValue(of(dummyPosts));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.posts()).toEqual(dummyPosts);
    expect(rssService.getUnreadPosts).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Blog: Blog 1');
  });

  it('should mark post as read', () => {
    const dummyPosts = [
      { id: 1, blogId: 1, blogName: 'Blog 1', name: 'Post 1', url: 'url1', isRead: false, dateAdded: '2023-01-01T00:00:00' }
    ];
    component.posts.set(dummyPosts);
    spyOn(rssService, 'markPostAsRead').and.returnValue(of(undefined));

    component.markAsRead(1);

    expect(rssService.markPostAsRead).toHaveBeenCalledWith(1);
    expect(component.posts().length).toBe(0);
  });
});
