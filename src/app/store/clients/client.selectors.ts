import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.model';

export const selectClientState = createFeatureSelector<ClientState>('clients');

export const selectAllClients = createSelector(
  selectClientState,
  state => state.clients
);

export const selectSelectedClient = createSelector(
  selectClientState,
  state => state.selectedClient
);

export const selectClientsLoading = createSelector(
  selectClientState,
  state => state.loading
);

export const selectClientsError = createSelector(
  selectClientState,
  state => state.error
);