import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Quote, calcLineHT, calcTotalHT, calcTotalTVA, calcTotalTTC } from '../../store/quotes/quote.model';
import { UserProfile } from '../../store/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateQuotePdf(quote: Quote, profile?: UserProfile): void {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    const primary   = [99, 102, 241] as const;
    const grayDark  = [31, 41, 55] as const;
    const grayMid   = [75, 85, 99] as const;
    const grayLight = [229, 231, 235] as const;
    const white     = [255, 255, 255] as const;

    const pageW = doc.internal.pageSize.getWidth();

  // ---- HEADER BANDEAU BLEU ----
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageW, 45, 'F');

    // Gauche : titre + numéro
    doc.setTextColor(...white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS', margin, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.number, margin, 28);

    // Centre : logo
    if (profile?.logo) {
      try {
        const logoWidth  = 40;
        const logoHeight = 20;
        const logoX = (pageW - logoWidth) / 2;
        const logoY = 12;
        doc.addImage(profile.logo, logoX, logoY, logoWidth, logoHeight);
      } catch (e) {
        console.warn('Logo non chargé', e);
      }
    }

    // Droite : dates
    const colRight = pageW - margin;
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("DATE D'ÉMISSION", colRight, 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatDate(quote.issueDate), colRight, 20, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('VALIDE JUSQU\'AU', colRight, 30, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatDate(quote.validUntil), colRight, 36, { align: 'right' });

    y = 58;

    // ---- BANDEAU COORDONNÉES ----
    // Colonne gauche : émetteur (Mon Espace)
    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ÉMETTEUR', margin, y);
    y += 6;

    doc.setTextColor(...grayDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (profile?.companyName) {
      doc.text(profile.companyName, margin, y); y += 5;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayMid);
    if (profile?.representativeName) {
      doc.text(profile.representativeName, margin, y); y += 5;
    }
    if (profile?.address?.street) {
      doc.text(profile.address.street, margin, y); y += 5;
    }
    if (profile?.address?.zip || profile?.address?.city) {
      doc.text(
        `${profile?.address?.zip || ''} ${profile?.address?.city || ''}`.trim(),
        margin, y
      ); y += 5;
    }
    if (profile?.phone) {
      doc.text(profile.phone, margin, y); y += 5;
    }
    if (profile?.email) {
      doc.text(profile.email, margin, y); y += 5;
    }

    // Colonne droite : client
    const colRightX = pageW / 2 + 10;
    let yRight = 58;

    doc.setTextColor(...primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CLIENT', colRightX, yRight);
    yRight += 6;

    doc.setTextColor(...grayDark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(quote.client.name, colRightX, yRight); yRight += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayMid);
    doc.text(quote.client.email, colRightX, yRight); yRight += 5;
    if (quote.client.phone) {
      doc.text(quote.client.phone, colRightX, yRight); yRight += 5;
    }
    if (quote.client.address?.street) {
      doc.text(quote.client.address.street, colRightX, yRight); yRight += 5;
    }
    if (quote.client.address?.zip || quote.client.address?.city) {
      doc.text(
        `${quote.client.address?.zip || ''} ${quote.client.address?.city || ''}`.trim(),
        colRightX, yRight
      ); yRight += 5;
    }
    if (quote.client.address?.country) {
      doc.text(quote.client.address.country, colRightX, yRight); yRight += 5;
    }

    y = Math.max(y, yRight) + 8;

    // Ligne séparatrice
    doc.setDrawColor(...grayLight);
    doc.line(margin, y, pageW - margin, y);
    y += 10;

    // ---- NOTES (avant le tableau) ----
    if (quote.notes) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 4, pageW - margin * 2, 10 + doc.splitTextToSize(quote.notes, pageW - margin * 2).length * 5, 'F');

      doc.setTextColor(...primary);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('NOTES', margin + 4, y + 2);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grayMid);
      doc.setFontSize(9);
      const noteLines = doc.splitTextToSize(quote.notes, pageW - margin * 2 - 8);
      doc.text(noteLines, margin + 4, y);
      y += noteLines.length * 5 + 10;
    }

    // ---- TABLEAU PRESTATIONS ----
    doc.setFillColor(...primary);
    doc.rect(margin, y, pageW - margin * 2, 8, 'F');

    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);

    const col1 = margin + 2;
    const col2 = pageW - margin - 90;
    const col3 = pageW - margin - 60;
    const col4 = pageW - margin - 30;
    const col5 = pageW - margin - 2;

    doc.text('PRESTATION', col1, y + 5.5);
    doc.text('QTÉ',        col2, y + 5.5, { align: 'right' });
    doc.text('PRIX HT',    col3, y + 5.5, { align: 'right' });
    doc.text('TVA',        col4, y + 5.5, { align: 'right' });
    doc.text('TOTAL HT',   col5, y + 5.5, { align: 'right' });

    y += 8;

    let rowBg = false;
    for (const line of quote.lines) {
      const lineHT = calcLineHT(line);
      const titleLines = doc.splitTextToSize(line.title, col2 - col1 - 4);
      const descLines  = line.description
        ? doc.splitTextToSize(line.description, col2 - col1 - 4)
        : [];
      const rowH = Math.max(10, (titleLines.length + descLines.length) * 4.5 + 4);

      if (y + rowH > 270) {
        doc.addPage();
        y = 20;
      }

      if (rowBg) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
      }
      rowBg = !rowBg;

      doc.setTextColor(...grayDark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(titleLines, col1, y + 5);

      if (descLines.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayMid);
        doc.setFontSize(8);
        doc.text(descLines, col1, y + 5 + titleLines.length * 4.5);
      }

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grayDark);
      doc.setFontSize(9);
      doc.text(String(line.quantity),              col2, y + 5, { align: 'right' });
      doc.text(this.formatCurrency(line.unitPrice), col3, y + 5, { align: 'right' });
      doc.text(`${line.vatRate}%`,                 col4, y + 5, { align: 'right' });
      doc.text(this.formatCurrency(lineHT),        col5, y + 5, { align: 'right' });

      doc.setDrawColor(...grayLight);
      doc.line(margin, y + rowH, pageW - margin, y + rowH);
      y += rowH;
    }

    y += 8;

    // ---- TOTAUX ----
    const totalHT  = calcTotalHT(quote.lines);
    const totalTVA = calcTotalTVA(quote.lines);
    const totalTTC = calcTotalTTC(quote.lines);
    const totalsX  = pageW - margin - 80;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayMid);
    doc.text('Total HT', totalsX, y);
    doc.text(this.formatCurrency(totalHT), pageW - margin, y, { align: 'right' });
    y += 7;

    doc.text('TVA', totalsX, y);
    doc.text(this.formatCurrency(totalTVA), pageW - margin, y, { align: 'right' });
    y += 7;

    doc.setDrawColor(...grayLight);
    doc.line(totalsX, y, pageW - margin, y);
    y += 5;

    doc.setFillColor(...primary);
    doc.rect(totalsX - 4, y - 4, pageW - margin - totalsX + 8, 12, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total TTC', totalsX, y + 4);
    doc.text(this.formatCurrency(totalTTC), pageW - margin, y + 4, { align: 'right' });

    // ---- MENTION LÉGALE ----
    y += 16;
    doc.setDrawColor(...grayLight);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...grayMid);
    doc.text(
      "Pour accepter ce devis, veuillez nous le renvoyer signer avec la mention 'Bon pour accord'",
      pageW / 2, y,
      { align: 'center' }
    );

    // ---- FOOTER ----
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFillColor(...grayLight);
    doc.rect(0, footerY - 4, pageW, 16, 'F');
    doc.setTextColor(...grayMid);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Devis généré le ${this.formatDate(new Date().toISOString())}`,
      pageW / 2, footerY + 3,
      { align: 'center' }
    );

    doc.save(`${quote.number}.pdf`);
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR'
    }).format(amount);
  }
}