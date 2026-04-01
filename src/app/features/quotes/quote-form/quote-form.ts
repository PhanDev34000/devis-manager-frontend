import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Quote, QuoteLine, calcTotalHT, calcTotalTVA, calcTotalTTC } from '../../../store/quotes/quote.model';
import { Client } from '../../../store/clients/client.model';
import * as QuoteActions from '../../../store/quotes/quote.actions';
import * as ClientActions from '../../../store/clients/client.actions';
import { selectSelectedQuote, selectQuotesLoading } from '../../../store/quotes/quote.selectors';
import { selectAllClients } from '../../../store/clients/client.selectors';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss'
})
export class QuoteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = false;
  quoteId: string | null = null;

  clients$: Observable<Client[]>;
  loading$: Observable<boolean>;

  constructor() {
    this.clients$ = this.store.select(selectAllClients);
    this.loading$ = this.store.select(selectQuotesLoading);
  }

  ngOnInit(): void {
    this.initForm();

    // Charger la liste des clients pour le select
    this.store.dispatch(ClientActions.loadClients());
              this.clients$.subscribe(clients => console.log('clients:', clients));
    this.quoteId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.quoteId;

    if (this.isEditMode && this.quoteId) {
      this.store.dispatch(QuoteActions.loadQuote({ id: this.quoteId }));
      this.store.select(selectSelectedQuote).subscribe((quote: Quote | null) => {
        if (quote) {
          this.form.patchValue({
            client:     quote.client._id,
            issueDate:  quote.issueDate.substring(0, 10),
            validUntil: quote.validUntil.substring(0, 10),
            notes:      quote.notes || ''
          });
          // Remplir les lignes
          this.lines.clear();
          quote.lines.forEach(line => this.lines.push(this.createLine(line)));
        }
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      client:     ['', Validators.required],
      issueDate:  ['', Validators.required],
      validUntil: ['', Validators.required],
      notes:      [''],
      lines:      this.fb.array([this.createLine()])
    });
  }

  // Getter pratique pour accéder au FormArray
  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  createLine(line?: Partial<QuoteLine>): FormGroup {
    return this.fb.group({
      title:       [line?.title || '', Validators.required],
      description: [line?.description || '', Validators.required],
      quantity:    [line?.quantity || 1, [Validators.required, Validators.min(0.01)]],
      unitPrice:   [line?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      vatRate:     [line?.vatRate || 20, Validators.required]
    });
  }

  addLine(): void {
    this.lines.push(this.createLine());
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
    }
  }

  // Calculs en temps réel
  getLineHT(index: number): number {
    const line = this.lines.at(index).value;
    return (line.quantity || 0) * (line.unitPrice || 0);
  }

  getTotalHT(): number {
    return calcTotalHT(this.lines.value);
  }

  getTotalTVA(): number {
    return calcTotalTVA(this.lines.value);
  }

  getTotalTTC(): number {
    return calcTotalTTC(this.lines.value);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      client:     this.form.value.client,
      issueDate:  this.form.value.issueDate,
      validUntil: this.form.value.validUntil,
      notes:      this.form.value.notes,
      lines:      this.form.value.lines
    };

    if (this.isEditMode && this.quoteId) {
      this.store.dispatch(QuoteActions.updateQuote({
        id: this.quoteId,
        quote: payload
      }));
    } else {
      this.store.dispatch(QuoteActions.createQuote({ quote: payload }));
    }
  }
}