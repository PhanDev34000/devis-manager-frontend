import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Quote, calcTotalTTC } from '../../store/quotes/quote.model';
import { Client } from '../../store/clients/client.model';
import * as QuoteActions from '../../store/quotes/quote.actions';
import * as ClientActions from '../../store/clients/client.actions';
import { selectAllQuotes } from '../../store/quotes/quote.selectors';
import { selectAllClients } from '../../store/clients/client.selectors';

interface DashboardStats {
  totalClients: number;
  totalQuotes: number;
  totalDraft: number;
  totalSent: number;
  totalAccepted: number;
  totalRejected: number;
  caPotentiel: number;    // devis envoyés
  caAccepte: number;      // devis acceptés
  recentQuotes: Quote[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  stats$: Observable<DashboardStats>;

  constructor() {
    this.stats$ = combineLatest([
      this.store.select(selectAllQuotes),
      this.store.select(selectAllClients)
    ]).pipe(
      map(([quotes, clients]) => this.computeStats(quotes, clients))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(QuoteActions.loadQuotes());
    this.store.dispatch(ClientActions.loadClients());
  }

  private computeStats(quotes: Quote[], clients: Client[]): DashboardStats {
    const accepted = quotes.filter(q => q.status === 'accepted');
    const sent     = quotes.filter(q => q.status === 'sent');

    return {
      totalClients:  clients.length,
      totalQuotes:   quotes.length,
      totalDraft:    quotes.filter(q => q.status === 'draft').length,
      totalSent:     sent.length,
      totalAccepted: accepted.length,
      totalRejected: quotes.filter(q => q.status === 'rejected').length,
      caPotentiel:   sent.reduce((sum, q) => sum + calcTotalTTC(q.lines), 0),
      caAccepte:     accepted.reduce((sum, q) => sum + calcTotalTTC(q.lines), 0),
      recentQuotes:  [...quotes].slice(0, 5)
    };
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Brouillon', sent: 'Envoyé',
      accepted: 'Accepté', rejected: 'Refusé'
    };
    return labels[status] || status;
  }
}