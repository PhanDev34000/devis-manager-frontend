import { createAction, props } from '@ngrx/store';
import { User } from './auth.model';

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');

// Update profile
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ profile: any }>()
);
export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);
export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Load current user
export const loadMe = createAction('[Auth] Load Me');
export const loadMeSuccess = createAction(
  '[Auth] Load Me Success',
  props<{ user: User }>()
);
export const loadMeFailure = createAction(
  '[Auth] Load Me Failure',
  props<{ error: string }>()
);