import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'timeline',
    loadComponent: () => import('./features/timeline/timeline.component').then(m => m.TimelineComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'entry/new',
    loadComponent: () => import('./features/entry-editor/entry-editor.component').then(m => m.EntryEditorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'entry/:id',
    loadComponent: () => import('./features/entry-detail/entry-detail.component').then(m => m.EntryDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'entry/:id/edit',
    loadComponent: () => import('./features/entry-editor/entry-editor.component').then(m => m.EntryEditorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/timeline',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/timeline'
  }
];
