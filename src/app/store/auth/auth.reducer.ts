import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.model';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user:    null,
  token:   localStorage.getItem('token'),
  loading: false,
  error:   null
};

export const authReducer = createReducer(
  initialState,

  // Register
  on(AuthActions.register, state => ({
    ...state, loading: true, error: null
  })),
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state, loading: false, user, token
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Login
  on(AuthActions.login, state => ({
    ...state, loading: true, error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state, loading: false, user, token
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Logout
  on(AuthActions.logout, state => ({
    ...state, user: null, token: null
  })),

  // Update profile
  on(AuthActions.updateProfile, state => ({
    ...state, loading: true, error: null
  })),
  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state, loading: false, user
  })),
  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Load me
  on(AuthActions.loadMe, state => ({
    ...state, loading: true
  })),
  on(AuthActions.loadMeSuccess, (state, { user }) => ({
    ...state, loading: false, user
  })),
  on(AuthActions.loadMeFailure, state => ({
    ...state, loading: false, token: null, user: null
  }))
);