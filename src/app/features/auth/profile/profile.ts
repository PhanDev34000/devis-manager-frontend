import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../store/auth/auth.model';
import * as AuthActions from '../../../store/auth/auth.actions';
import {
  selectUser,
  selectAuthLoading,
  selectAuthError
} from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  loading$: Observable<boolean>;
  error$:   Observable<string | null>;
  user$:    Observable<User | null>;

  // Prévisualisation du logo
  logoPreview: string | null = null;

  constructor() {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$   = this.store.select(selectAuthError);
    this.user$    = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      companyName:        ['', Validators.required],
      representativeName: ['', Validators.required],
      email:              ['', [Validators.required, Validators.email]],
      phone:              [''],
      logo:               [''], // ← nouveau
      address: this.fb.group({
        street:  [''],
        city:    [''],
        zip:     [''],
        country: ['France']
      })
    });

    this.store.dispatch(AuthActions.loadMe());
    this.user$.subscribe((user: User | null) => {
      if (user?.profile) {
        this.form.patchValue({
          companyName:        user.profile.companyName || '',
          representativeName: user.profile.representativeName || '',
          email:              user.profile.email || '',
          phone:              user.profile.phone || '',
          logo:               user.profile.logo || '',
          address: {
            street:  user.profile.address?.street  || '',
            city:    user.profile.address?.city    || '',
            zip:     user.profile.address?.zip     || '',
            country: user.profile.address?.country || 'France'
          }
        });

        // Afficher le logo existant
        if (user.profile.logo) {
          this.logoPreview = user.profile.logo;
        }
      }
    });
  }

  // Conversion de l'image en base64
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Vérification taille (max 1MB)
    if (file.size >2 * 1024 * 1024) {
      alert('Le logo ne doit pas dépasser 2MB & 1024 x 1024px');
      return;
    }

    const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        console.log('Base64 généré, longueur:', base64?.length);
        this.logoPreview = base64;
        this.form.patchValue({ logo: base64 });
         this.cdr.detectChanges();
      };
      reader.onerror = (e) => {
        console.error('Erreur FileReader:', e);
        alert('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }

  removeLogo(): void {
    this.logoPreview = null;
    this.form.patchValue({ logo: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(AuthActions.updateProfile({ profile: this.form.value }));
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}