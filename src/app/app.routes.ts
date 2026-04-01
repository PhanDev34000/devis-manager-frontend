import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // Routes protégées
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes')
        .then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/clients/clients.routes')
        .then(m => m.CLIENTS_ROUTES)
  },
  {
    path: 'quotes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/quotes/quotes.routes')
        .then(m => m.QUOTES_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/profile/profile')
        .then(m => m.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];