import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout.component';
import { PostListComponent } from './components/post-list.component';
import { BlogListComponent } from './components/blog-list.component';
import { ArchiveListComponent } from './components/archive-list.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: PostListComponent },
      { path: 'blogs', component: BlogListComponent },
      { path: 'archive', component: ArchiveListComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
