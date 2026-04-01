import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { ClientService } from '../../core/services/client.service';
import * as ClientActions from './client.actions';

@Injectable()
export class ClientEffects {
  private actions$ = inject(Actions);
  private clientService = inject(ClientService);
  private router = inject(Router);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      exhaustMap(() =>
        this.clientService.getAll().pipe(
          map(clients => ClientActions.loadClientsSuccess({ clients })),
          catchError(error => of(ClientActions.loadClientsFailure({ error: error.message })))
        )
      )
    )
  );

  loadClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClient),
      exhaustMap(({ id }) =>
        this.clientService.getById(id).pipe(
          map(client => ClientActions.loadClientSuccess({ client })),
          catchError(error => of(ClientActions.loadClientFailure({ error: error.message })))
        )
      )
    )
  );

  createClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.createClient),
      exhaustMap(({ client }) =>
        this.clientService.create(client).pipe(
          map(newClient => ClientActions.createClientSuccess({ client: newClient })),
          catchError(error => of(ClientActions.createClientFailure({ error: error.message })))
        )
      )
    )
  );

  createClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.createClientSuccess),
      tap(() => this.router.navigate(['/clients']))
    ),
    { dispatch: false }
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      exhaustMap(({ id, client }) =>
        this.clientService.update(id, client).pipe(
          map(updatedClient => ClientActions.updateClientSuccess({ client: updatedClient })),
          catchError(error => of(ClientActions.updateClientFailure({ error: error.message })))
        )
      )
    )
  );

  updateClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClientSuccess),
      tap(() => this.router.navigate(['/clients']))
    ),
    { dispatch: false }
  );

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      exhaustMap(({ id }) =>
        this.clientService.delete(id).pipe(
          map(() => ClientActions.deleteClientSuccess({ id })),
          catchError(error => of(ClientActions.deleteClientFailure({ error: error.message })))
        )
      )
    )
  );
}