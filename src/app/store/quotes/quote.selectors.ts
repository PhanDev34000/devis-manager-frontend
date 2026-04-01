import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuoteState } from './quote.model';

export const selectQuoteState = createFeatureSelector<QuoteState>('quotes');

export const selectAllQuotes = createSelector(
  selectQuoteState,
  state => state.quotes
);

export const selectSelectedQuote = createSelector(
  selectQuoteState,
  state => state.selectedQuote
);

export const selectQuotesLoading = createSelector(
  selectQuoteState,
  state => state.loading
);

export const selectQuotesError = createSelector(
  selectQuoteState,
  state => state.error
);

export const selectQuotesByStatus = (status: string) => createSelector(
  selectAllQuotes,
  quotes => quotes.filter(q => q.status === status)
);