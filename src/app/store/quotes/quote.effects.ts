import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { QuoteService } from '../../core/services/quote.service';
import * as QuoteActions from './quote.actions';

@Injectable()
export class QuoteEffects {
  private actions$ = inject(Actions);
  private quoteService = inject(QuoteService);
  private router = inject(Router);

  loadQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadQuotes),
      exhaustMap(() =>
        this.quoteService.getAll().pipe(
          map(quotes => QuoteActions.loadQuotesSuccess({ quotes })),
          catchError(error => of(QuoteActions.loadQuotesFailure({ error: error.message })))
        )
      )
    )
  );

  loadQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadQuote),
      exhaustMap(({ id }) =>
        this.quoteService.getById(id).pipe(
          map(quote => QuoteActions.loadQuoteSuccess({ quote })),
          catchError(error => of(QuoteActions.loadQuoteFailure({ error: error.message })))
        )
      )
    )
  );

  createQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.createQuote),
      exhaustMap(({ quote }) =>
        this.quoteService.create(quote).pipe(
          map(newQuote => QuoteActions.createQuoteSuccess({ quote: newQuote })),
          catchError(error => of(QuoteActions.createQuoteFailure({ error: error.message })))
        )
      )
    )
  );

  createQuoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.createQuoteSuccess),
      tap(() => this.router.navigate(['/quotes']))
    ),
    { dispatch: false }
  );

  updateQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.updateQuote),
      exhaustMap(({ id, quote }) =>
        this.quoteService.update(id, quote).pipe(
          map(updatedQuote => QuoteActions.updateQuoteSuccess({ quote: updatedQuote })),
          catchError(error => of(QuoteActions.updateQuoteFailure({ error: error.message })))
        )
      )
    )
  );

  updateQuoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.updateQuoteSuccess),
      tap(() => this.router.navigate(['/quotes']))
    ),
    { dispatch: false }
  );

  updateQuoteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.updateQuoteStatus),
      exhaustMap(({ id, status }) =>
        this.quoteService.updateStatus(id, status).pipe(
          map(quote => QuoteActions.updateQuoteStatusSuccess({ quote })),
          catchError(error => of(QuoteActions.updateQuoteStatusFailure({ error: error.message })))
        )
      )
    )
  );

  deleteQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.deleteQuote),
      exhaustMap(({ id }) =>
        this.quoteService.delete(id).pipe(
          map(() => QuoteActions.deleteQuoteSuccess({ id })),
          catchError(error => of(QuoteActions.deleteQuoteFailure({ error: error.message })))
        )
      )
    )
  );
}