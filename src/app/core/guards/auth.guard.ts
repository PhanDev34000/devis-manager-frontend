import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, first } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store  = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    first(),
    map(isAuthenticated => {
      if (isAuthenticated) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};