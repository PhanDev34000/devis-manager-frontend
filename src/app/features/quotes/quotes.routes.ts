import { Routes } from '@angular/router';

export const QUOTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./quotes-list/quotes-list')
        .then(m => m.QuotesListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./quote-form/quote-form')
        .then(m => m.QuoteFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./quote-detail/quote-detail')
        .then(m => m.QuoteDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./quote-form/quote-form')
        .then(m => m.QuoteFormComponent)
  }
];