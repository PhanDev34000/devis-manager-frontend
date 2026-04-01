import { createReducer, on } from '@ngrx/store';
import { ClientState } from './client.model';
import * as ClientActions from './client.actions';

export const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null
};

export const clientReducer = createReducer(
  initialState,

  // Load all
  on(ClientActions.loadClients, state => ({
    ...state, loading: true, error: null
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state, loading: false, clients
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Load one
  on(ClientActions.loadClient, state => ({
    ...state, loading: true, error: null
  })),
  on(ClientActions.loadClientSuccess, (state, { client }) => ({
    ...state, loading: false, selectedClient: client
  })),
  on(ClientActions.loadClientFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create
  on(ClientActions.createClient, state => ({
    ...state, loading: true, error: null
  })),
  on(ClientActions.createClientSuccess, (state, { client }) => ({
    ...state, loading: false, clients: [client, ...state.clients]
  })),
  on(ClientActions.createClientFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Update
  on(ClientActions.updateClient, state => ({
    ...state, loading: true, error: null
  })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    loading: false,
    clients: state.clients.map(c => c._id === client._id ? client : c),
    selectedClient: client
  })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Delete
  on(ClientActions.deleteClient, state => ({
    ...state, loading: true, error: null
  })),
  on(ClientActions.deleteClientSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    clients: state.clients.filter(c => c._id !== id)
  })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);