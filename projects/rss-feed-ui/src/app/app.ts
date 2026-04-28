import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { WakingUpComponent } from 'shared-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WakingUpComponent],
  template: `
    <lib-waking-up *ngIf="authService.isVerifying()" />
    <router-outlet />
  `,
  styles: [],
})
export class App {
  title = 'rss-feed-ui';
  authService = inject(AuthService);
}
