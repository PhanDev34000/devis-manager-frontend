import { createAction, props } from '@ngrx/store';
import { Client } from './client.model';

// Load all clients
export const loadClients = createAction('[Clients] Load Clients');
export const loadClientsSuccess = createAction(
  '[Clients] Load Clients Success',
  props<{ clients: Client[] }>()
);
export const loadClientsFailure = createAction(
  '[Clients] Load Clients Failure',
  props<{ error: string }>()
);

// Load one client
export const loadClient = createAction(
  '[Clients] Load Client',
  props<{ id: string }>()
);
export const loadClientSuccess = createAction(
  '[Clients] Load Client Success',
  props<{ client: Client }>()
);
export const loadClientFailure = createAction(
  '[Clients] Load Client Failure',
  props<{ error: string }>()
);

// Create
export const createClient = createAction(
  '[Clients] Create Client',
  props<{ client: Omit<Client, '_id' | 'createdAt'> }>()
);
export const createClientSuccess = createAction(
  '[Clients] Create Client Success',
  props<{ client: Client }>()
);
export const createClientFailure = createAction(
  '[Clients] Create Client Failure',
  props<{ error: string }>()
);

// Update
export const updateClient = createAction(
  '[Clients] Update Client',
  props<{ id: string; client: Partial<Client> }>()
);
export const updateClientSuccess = createAction(
  '[Clients] Update Client Success',
  props<{ client: Client }>()
);
export const updateClientFailure = createAction(
  '[Clients] Update Client Failure',
  props<{ error: string }>()
);

// Delete
export const deleteClient = createAction(
  '[Clients] Delete Client',
  props<{ id: string }>()
);
export const deleteClientSuccess = createAction(
  '[Clients] Delete Client Success',
  props<{ id: string }>()
);
export const deleteClientFailure = createAction(
  '[Clients] Delete Client Failure',
  props<{ error: string }>()
);