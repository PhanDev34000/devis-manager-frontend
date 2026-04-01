import { Client } from '../clients/client.model';

export interface QuoteLine {
  title: string;   
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quote {
  _id: string;
  number: string;
  client: Client;
  status: QuoteStatus;
  lines: QuoteLine[];
  issueDate: string;
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteState {
  quotes: Quote[];
  selectedQuote: Quote | null;
  loading: boolean;
  error: string | null;
}

// Utilitaires de calcul — utilisés partout dans l'appli
export const calcLineHT = (line: QuoteLine): number =>
  line.quantity * line.unitPrice;

export const calcLineTVA = (line: QuoteLine): number =>
  calcLineHT(line) * (line.vatRate / 100);

export const calcTotalHT = (lines: QuoteLine[]): number =>
  lines.reduce((sum, line) => sum + calcLineHT(line), 0);

export const calcTotalTVA = (lines: QuoteLine[]): number =>
  lines.reduce((sum, line) => sum + calcLineTVA(line), 0);

export const calcTotalTTC = (lines: QuoteLine[]): number =>
  calcTotalHT(lines) + calcTotalTVA(lines);