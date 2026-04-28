import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';

describe('App', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['verifySession'], {
      isVerifying: () => false
    });
    authServiceSpy.verifySession.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, App, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(authServiceSpy.verifySession).toHaveBeenCalled();
  });

  it(`should have as title 'rss-feed-ui'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('rss-feed-ui');
  });
});
