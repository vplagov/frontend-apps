import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BlogListComponent } from '../blog-list.component';
import { RssService } from '../../services/rss.service';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  let rssService: jasmine.SpyObj<RssService>;

  const dummyBlogs = [
    {
      id: 1,
      name: 'Blog 1',
      feedUrl: 'https://example.com/feed.xml',
      isSubscribed: true,
      useAiFiltering: false
    },
    {
      id: 2,
      name: 'Blog 2',
      feedUrl: 'https://example.com/ai-feed.xml',
      isSubscribed: false,
      useAiFiltering: true
    }
  ];

  beforeEach(async () => {
    rssService = jasmine.createSpyObj<RssService>('RssService', [
      'getBlogs',
      'addBlog',
      'updateBlog',
      'unsubscribeFromBlog',
      'fetchLatestForBlog'
    ]);

    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [{ provide: RssService, useValue: rssService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogs on init and render AI filtering status', () => {
    rssService.getBlogs.and.returnValue(of(dummyBlogs));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.blogs()).toEqual(dummyBlogs);
    expect(rssService.getBlogs).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('AI Filtering');
    expect(fixture.nativeElement.textContent).toContain('Enabled');
    expect(fixture.nativeElement.textContent).toContain('Disabled');
  });

  it('should open add modal with empty defaults', () => {
    component.openAddModal();

    expect(component.showModal).toBeTrue();
    expect(component.editingBlogId).toBeNull();
    expect(component.blogForm).toEqual({
      name: '',
      feedUrl: '',
      isSubscribed: true,
      useAiFiltering: false
    });
  });

  it('should open edit modal with blog values prefilled', () => {
    component.openEditModal(dummyBlogs[1]);

    expect(component.showModal).toBeTrue();
    expect(component.editingBlogId).toBe(2);
    expect(component.blogForm).toEqual({
      name: 'Blog 2',
      feedUrl: 'https://example.com/ai-feed.xml',
      isSubscribed: false,
      useAiFiltering: true
    });
  });

  it('should add a blog when saving from add mode', () => {
    rssService.addBlog.and.returnValue(of(undefined));
    spyOn(component, 'loadBlogs');
    spyOn(component, 'closeModal').and.callThrough();

    component.blogForm = {
      name: 'New Blog',
      feedUrl: 'https://example.com/new-feed.xml',
      isSubscribed: true,
      useAiFiltering: false
    };

    component.saveBlog();

    expect(rssService.addBlog).toHaveBeenCalledWith({
      name: 'New Blog',
      feedUrl: 'https://example.com/new-feed.xml'
    });
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.loadBlogs).toHaveBeenCalled();
  });

  it('should update a blog when saving from edit mode', () => {
    rssService.updateBlog.and.returnValue(of(undefined));
    spyOn(component, 'loadBlogs');
    spyOn(component, 'closeModal').and.callThrough();

    component.editingBlogId = 2;
    component.blogForm = {
      name: 'Updated Blog',
      feedUrl: 'https://example.com/updated-feed.xml',
      isSubscribed: false,
      useAiFiltering: true
    };

    component.saveBlog();

    expect(rssService.updateBlog).toHaveBeenCalledWith(2, {
      name: 'Updated Blog',
      feedUrl: 'https://example.com/updated-feed.xml',
      isSubscribed: false,
      useAiFiltering: true
    });
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.loadBlogs).toHaveBeenCalled();
  });
});
