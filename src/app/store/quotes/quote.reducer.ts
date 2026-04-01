import { createReducer, on } from '@ngrx/store';
import { QuoteState } from './quote.model';
import * as QuoteActions from './quote.actions';

export const initialState: QuoteState = {
  quotes: [],
  selectedQuote: null,
  loading: false,
  error: null
};

export const quoteReducer = createReducer(
  initialState,

  // Load all
  on(QuoteActions.loadQuotes, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.loadQuotesSuccess, (state, { quotes }) => ({
    ...state, loading: false, quotes
  })),
  on(QuoteActions.loadQuotesFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Load one
  on(QuoteActions.loadQuote, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.loadQuoteSuccess, (state, { quote }) => ({
    ...state, loading: false, selectedQuote: quote
  })),
  on(QuoteActions.loadQuoteFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create
  on(QuoteActions.createQuote, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.createQuoteSuccess, (state, { quote }) => ({
    ...state, loading: false, quotes: [quote, ...state.quotes]
  })),
  on(QuoteActions.createQuoteFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Update
  on(QuoteActions.updateQuote, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.updateQuoteSuccess, (state, { quote }) => ({
    ...state,
    loading: false,
    quotes: state.quotes.map(q => q._id === quote._id ? quote : q),
    selectedQuote: quote
  })),
  on(QuoteActions.updateQuoteFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Update status
  on(QuoteActions.updateQuoteStatus, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.updateQuoteStatusSuccess, (state, { quote }) => ({
    ...state,
    loading: false,
    quotes: state.quotes.map(q => q._id === quote._id ? quote : q),
    selectedQuote: quote
  })),
  on(QuoteActions.updateQuoteStatusFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Delete
  on(QuoteActions.deleteQuote, state => ({
    ...state, loading: true, error: null
  })),
  on(QuoteActions.deleteQuoteSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    quotes: state.quotes.filter(q => q._id !== id)
  })),
  on(QuoteActions.deleteQuoteFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);