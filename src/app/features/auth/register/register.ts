import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

// Validator custom : vérifie que password === confirmPassword
const passwordMatchValidator = (control: AbstractControl) => {
  const password        = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors({ mismatch: true });
    return { mismatch: true };
  }
  confirmPassword?.setErrors(null);
  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb    = inject(FormBuilder);
  private store = inject(Store);

  form: FormGroup;
  loading$: Observable<boolean>;
  error$:   Observable<string | null>;

  constructor() {
    this.form = this.fb.group({
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });

    this.loading$ = this.store.select(selectAuthLoading);
    this.error$   = this.store.select(selectAuthError);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    this.store.dispatch(AuthActions.register({ email, password }));
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}