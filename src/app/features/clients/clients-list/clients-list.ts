import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Client } from '../../../store/clients/client.model';
import * as ClientActions from '../../../store/clients/client.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError
} from '../../../store/clients/client.selectors';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss'
})
export class ClientsListComponent implements OnInit {
  clients$: Observable<Client[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.clients$ = this.store.select(selectAllClients);
    this.loading$ = this.store.select(selectClientsLoading);
    this.error$ = this.store.select(selectClientsError);
  }

  ngOnInit(): void {
    this.store.dispatch(ClientActions.loadClients());
  }

  onDelete(id: string): void {
    if (confirm('Supprimer ce client ?')) {
      this.store.dispatch(ClientActions.deleteClient({ id }));
    }
  }
}