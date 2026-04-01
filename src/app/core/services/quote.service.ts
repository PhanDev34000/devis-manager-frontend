import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Quote, QuoteStatus } from '../../store/quotes/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private path = 'quotes';

  constructor(private api: ApiService) {}

  getAll(): Observable<Quote[]> {
    return this.api.get<Quote[]>(this.path);
  }

  getById(id: string): Observable<Quote> {
    return this.api.get<Quote>(`${this.path}/${id}`);
  }

  create(quote: Partial<Quote>): Observable<Quote> {
    return this.api.post<Quote>(this.path, quote);
  }

  update(id: string, quote: Partial<Quote>): Observable<Quote> {
    return this.api.put<Quote>(`${this.path}/${id}`, quote);
  }

  updateStatus(id: string, status: QuoteStatus): Observable<Quote> {
    return this.api.patch<Quote>(`${this.path}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }
}