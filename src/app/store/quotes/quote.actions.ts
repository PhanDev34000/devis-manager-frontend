import { createAction, props } from '@ngrx/store';
import { Quote, QuoteStatus } from './quote.model';

// Load all
export const loadQuotes = createAction('[Quotes] Load Quotes');
export const loadQuotesSuccess = createAction(
  '[Quotes] Load Quotes Success',
  props<{ quotes: Quote[] }>()
);
export const loadQuotesFailure = createAction(
  '[Quotes] Load Quotes Failure',
  props<{ error: string }>()
);

// Load one
export const loadQuote = createAction(
  '[Quotes] Load Quote',
  props<{ id: string }>()
);
export const loadQuoteSuccess = createAction(
  '[Quotes] Load Quote Success',
  props<{ quote: Quote }>()
);
export const loadQuoteFailure = createAction(
  '[Quotes] Load Quote Failure',
  props<{ error: string }>()
);

// Create
export const createQuote = createAction(
  '[Quotes] Create Quote',
  props<{ quote: Partial<Quote> }>()
);
export const createQuoteSuccess = createAction(
  '[Quotes] Create Quote Success',
  props<{ quote: Quote }>()
);
export const createQuoteFailure = createAction(
  '[Quotes] Create Quote Failure',
  props<{ error: string }>()
);

// Update
export const updateQuote = createAction(
  '[Quotes] Update Quote',
  props<{ id: string; quote: Partial<Quote> }>()
);
export const updateQuoteSuccess = createAction(
  '[Quotes] Update Quote Success',
  props<{ quote: Quote }>()
);
export const updateQuoteFailure = createAction(
  '[Quotes] Update Quote Failure',
  props<{ error: string }>()
);

// Update status
export const updateQuoteStatus = createAction(
  '[Quotes] Update Quote Status',
  props<{ id: string; status: QuoteStatus }>()
);
export const updateQuoteStatusSuccess = createAction(
  '[Quotes] Update Quote Status Success',
  props<{ quote: Quote }>()
);
export const updateQuoteStatusFailure = createAction(
  '[Quotes] Update Quote Status Failure',
  props<{ error: string }>()
);

// Delete
export const deleteQuote = createAction(
  '[Quotes] Delete Quote',
  props<{ id: string }>()
);
export const deleteQuoteSuccess = createAction(
  '[Quotes] Delete Quote Success',
  props<{ id: string }>()
);
export const deleteQuoteFailure = createAction(
  '[Quotes] Delete Quote Failure',
  props<{ error: string }>()
);