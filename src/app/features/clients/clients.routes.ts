import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clients-list/clients-list')
        .then(m => m.ClientsListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./client-form/client-form')
        .then(m => m.ClientFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./client-form/client-form')
        .then(m => m.ClientFormComponent)
  }
];