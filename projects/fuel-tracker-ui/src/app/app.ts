import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { WakingUpComponent } from 'shared-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, WakingUpComponent],
  template: `
    <lib-waking-up *ngIf="authService.isVerifying()" />
    <router-outlet />
  `,
  styles: [],
})
export class App {
  title = 'fuel-tracker-ui';
  authService = inject(AuthService);
}
