import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Quote, QuoteStatus, calcTotalTTC } from '../../../store/quotes/quote.model';
import * as QuoteActions from '../../../store/quotes/quote.actions';
import {
  selectAllQuotes,
  selectQuotesLoading,
  selectQuotesError
} from '../../../store/quotes/quote.selectors';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quotes-list.html',
  styleUrl: './quotes-list.scss'
})
export class QuotesListComponent implements OnInit {
  private store = inject(Store);

  quotes$: Observable<Quote[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  // Filtre actif
  activeFilter: QuoteStatus | 'all' = 'all';

  filters: { label: string; value: QuoteStatus | 'all' }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Brouillons', value: 'draft' },
    { label: 'Envoyés', value: 'sent' },
    { label: 'Acceptés', value: 'accepted' },
    { label: 'Refusés', value: 'rejected' }
  ];

  constructor() {
    this.quotes$ = this.store.select(selectAllQuotes);
    this.loading$ = this.store.select(selectQuotesLoading);
    this.error$ = this.store.select(selectQuotesError);
  }

  ngOnInit(): void {
    this.store.dispatch(QuoteActions.loadQuotes());
  }

  setFilter(filter: QuoteStatus | 'all'): void {
    this.activeFilter = filter;
  }

  filterQuotes(quotes: Quote[]): Quote[] {
    if (this.activeFilter === 'all') return quotes;
    return quotes.filter(q => q.status === this.activeFilter);
  }

  onDelete(id: string): void {
    if (confirm('Supprimer ce devis ?')) {
      this.store.dispatch(QuoteActions.deleteQuote({ id }));
    }
  }

  getTotalTTC(quote: Quote): number {
    return calcTotalTTC(quote.lines);
  }

  getStatusLabel(status: QuoteStatus): string {
    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyé',
      accepted: 'Accepté',
      rejected: 'Refusé'
    };
    return labels[status];
  }
}