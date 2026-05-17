import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArchiveListComponent } from '../archive-list.component';
import { RssService } from '../../services/rss.service';

describe('ArchiveListComponent', () => {
  let component: ArchiveListComponent;
  let fixture: ComponentFixture<ArchiveListComponent>;
  let rssService: jasmine.SpyObj<RssService>;

  const archivedPosts = [
    {
      id: 1,
      blogId: 1,
      blogName: 'Blog 1',
      name: 'Ignored by AI',
      url: 'https://example.com/1',
      isRead: true,
      isIgnored: true,
      aiReason: 'This post was a duplicate.',
      dateAdded: '2023-01-01T00:00:00',
      dateRead: '2023-01-02T00:00:00'
    },
    {
      id: 2,
      blogId: 2,
      blogName: 'Blog 2',
      name: 'Read normally',
      url: 'https://example.com/2',
      isRead: true,
      isIgnored: false,
      aiReason: null,
      dateAdded: '2023-01-03T00:00:00',
      dateRead: '2023-01-04T00:00:00'
    }
  ];

  beforeEach(async () => {
    rssService = jasmine.createSpyObj<RssService>('RssService', ['getArchivedPosts']);

    await TestBed.configureTestingModule({
      imports: [ArchiveListComponent],
      providers: [{ provide: RssService, useValue: rssService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ArchiveListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load archived posts on init', () => {
    rssService.getArchivedPosts.and.returnValue(of(archivedPosts));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.archivedPosts()).toEqual(archivedPosts);
    expect(rssService.getArchivedPosts).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Read normally');
    expect(fixture.nativeElement.textContent).toContain('Yes');
  });

  it('should only show reason button when aiReason exists', () => {
    rssService.getArchivedPosts.and.returnValue(of(archivedPosts));

    component.ngOnInit();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.textContent).toContain('Reason');
    });
  });

  it('should toggle the reason popover', () => {
    component.toggleReason(1);
    expect(component.activeReasonPostId).toBe(1);

    component.toggleReason(1);
    expect(component.activeReasonPostId).toBeNull();
  });
});
