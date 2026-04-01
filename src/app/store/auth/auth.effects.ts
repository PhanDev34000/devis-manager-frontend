import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Inscription
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password }) =>
        this.authService.register(email, password).pipe(
          map(({ user, token }) => AuthActions.registerSuccess({ user, token })),
          catchError(error => of(AuthActions.registerFailure({
            error: error.error?.message || 'Erreur lors de l\'inscription'
          })))
        )
      )
    )
  );

  // Sauvegarde token + redirection après inscription
  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(({ token }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      })
    ),
    { dispatch: false }
  );

  // Connexion
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
          catchError(error => of(AuthActions.loginFailure({
            error: error.error?.message || 'Email ou mot de passe incorrect'
          })))
        )
      )
    )
  );

  // Sauvegarde token + redirection après connexion
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ token }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      })
    ),
    { dispatch: false }
  );

  // Déconnexion — supprime le token et redirige vers login
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  // Chargement du profil utilisateur connecté
  loadMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadMe),
      exhaustMap(() =>
        this.authService.getMe().pipe(
          map(user => AuthActions.loadMeSuccess({ user })),
          catchError(error => of(AuthActions.loadMeFailure({
            error: error.error?.message || 'Erreur de chargement'
          })))
        )
      )
    )
  );

  // Mise à jour du profil
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(({ profile }) =>
        this.authService.updateProfile(profile).pipe(
          map(user => AuthActions.updateProfileSuccess({ user })),
          catchError(error => of(AuthActions.updateProfileFailure({
            error: error.error?.message || 'Erreur de mise à jour'
          })))
        )
      )
    )
  );

  // Redirection après mise à jour profil
  updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfileSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );
}