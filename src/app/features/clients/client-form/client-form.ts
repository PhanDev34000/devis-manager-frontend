import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import * as ClientActions from '../../../store/clients/client.actions';
import { selectSelectedClient, selectClientsLoading } from '../../../store/clients/client.selectors';
import { Observable } from 'rxjs';
import { Client } from '../../../store/clients/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  loading$: Observable<boolean>;

  constructor() {
    this.form = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: this.fb.group({
        street:  [''],
        city:    [''],
        zip:     [''],
        country: ['France']
      })
    });

    this.loading$ = this.store.select(selectClientsLoading);
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(ClientActions.loadClient({ id: this.clientId }));
      this.store.select(selectSelectedClient).subscribe((client: Client | null) => {
        if (client) {
          this.form.patchValue({
            name:  client.name,
            email: client.email,
            phone: client.phone || '',
            address: {
              street:  client.address?.street || '',
              city:    client.address?.city || '',
              zip:     client.address?.zip || '',
              country: client.address?.country || 'France'
            }
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(ClientActions.updateClient({
        id: this.clientId,
        client: this.form.value
      }));
    } else {
      this.store.dispatch(ClientActions.createClient({
        client: this.form.value
      }));
    }
  }

  // Helpers pour la validation dans le template
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}