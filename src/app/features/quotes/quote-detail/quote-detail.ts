import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Quote, QuoteStatus, calcTotalHT, calcTotalTVA, calcTotalTTC } from '../../../store/quotes/quote.model';
import { User } from '../../../store/auth/auth.model';
import * as QuoteActions from '../../../store/quotes/quote.actions';
import { selectSelectedQuote, selectQuotesLoading } from '../../../store/quotes/quote.selectors';
import { selectUser } from '../../../store/auth/auth.selectors';
import { PdfService } from '../../../core/services/pdf.service';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-quote-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quote-detail.html',
  styleUrl: './quote-detail.scss'
})
export class QuoteDetailComponent implements OnInit {
  private store      = inject(Store);
  private route      = inject(ActivatedRoute);
  private pdfService = inject(PdfService);

  quote$:   Observable<Quote | null>;
  loading$: Observable<boolean>;
  user$:    Observable<User | null>;

  // Statut local pour mise à jour visuelle immédiate
  currentStatus: QuoteStatus | null = null;

  statuses: { value: QuoteStatus; label: string }[] = [
    { value: 'draft',    label: 'Brouillon' },
    { value: 'sent',     label: 'Envoyé' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'rejected', label: 'Refusé' }
  ];

  constructor() {
    this.quote$   = this.store.select(selectSelectedQuote);
    this.loading$ = this.store.select(selectQuotesLoading);
    this.user$    = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadMe());
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(QuoteActions.loadQuote({ id }));
      // Synchroniser currentStatus à chaque mise à jour du store
      this.quote$.subscribe(quote => {
        if (quote) this.currentStatus = quote.status;
      });
    }
  }

  onStatusChange(quote: Quote, status: QuoteStatus): void {
    this.currentStatus = status;
    this.store.dispatch(QuoteActions.updateQuoteStatus({
      id: quote._id,
      status
    }));
  }

  onExportPdf(quote: Quote): void {
  console.log('quote:', quote);
  console.log('currentStatus:', this.currentStatus);
  
  const updatedQuote: Quote = {
    ...quote,
    status: this.currentStatus ?? quote.status
  };

  console.log('updatedQuote:', updatedQuote);

  let userProfile = undefined;
  this.user$.subscribe(user => {
    userProfile = user?.profile;
  }).unsubscribe();

  console.log('userProfile:', userProfile);

  this.pdfService.generateQuotePdf(updatedQuote, userProfile);
}

  getLineHT(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }
  getTotalHT(quote: Quote): number  { return calcTotalHT(quote.lines); }
  getTotalTVA(quote: Quote): number { return calcTotalTVA(quote.lines); }
  getTotalTTC(quote: Quote): number { return calcTotalTTC(quote.lines); }

  getStatusLabel(status: QuoteStatus): string {
    return this.statuses.find(s => s.value === status)?.label || status;
  }
}