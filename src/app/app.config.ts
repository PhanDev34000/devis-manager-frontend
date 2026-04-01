import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';
import { clientReducer } from './store/clients/client.reducer';
import { ClientEffects } from './store/clients/client.effects';
import { quoteReducer } from './store/quotes/quote.reducer';
import { QuoteEffects } from './store/quotes/quote.effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr' },
    provideStore({
      auth:    authReducer,
      clients: clientReducer,
      quotes:  quoteReducer
    }),
    provideEffects([AuthEffects, ClientEffects, QuoteEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};