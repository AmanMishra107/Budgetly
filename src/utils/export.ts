import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
// REMOVED: import jsPDFAutoTable from 'jspdf-autotable';
import { Transaction } from '@/types/budget';
import { formatCurrency } from './currency';

export const exportToExcel = (transactions: Transaction[], filename: string = 'budgetly-data') => {
  try {
    const data = transactions.map((transaction, index) => ({
      'S.No': index + 1,
      'Date': transaction.date.toLocaleDateString('en-IN'),
      'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      'Category': transaction.category,
      'Description': transaction.description,
      'Payment Mode': transaction.paymentMode || 'Not specified',
      'Amount': transaction.amount,
    }));

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const summaryRows: any[] = [
      { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': '', 'Payment Mode': '', 'Amount': '' },
      { 'S.No': '', 'Date': '', 'Type': '', 'Category': 'SUMMARY', 'Description': '', 'Payment Mode': '', 'Amount': '' },
      { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Total Income', 'Payment Mode': '', 'Amount': totalIncome },
      { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Total Expenses', 'Payment Mode': '', 'Amount': totalExpenses },
      { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Net Balance', 'Payment Mode': '', 'Amount': balance }
    ];

    data.push(...summaryRows);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const colWidths = [
      { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 35 }, { wch: 18 }, { wch: 18 }
    ];
    worksheet['!cols'] = colWidths;

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:G1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellRef]) continue;

      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2980B9" } },
        alignment: { horizontal: "center" }
      };
    }

    const titleData = [
      ['BUDGETLY - FINANCIAL REPORT'],
      [`Generated on: ${new Date().toLocaleDateString('en-IN')}`],
      [`Total Transactions: ${transactions.length}`],
      [''],
      ['FINANCIAL SUMMARY'],
      ['Total Income', totalIncome],
      ['Total Expenses', totalExpenses],
      ['Net Balance', balance],
    ];

    const titleSheet = XLSX.utils.aoa_to_sheet(titleData);
    titleSheet['!cols'] = [{ wch: 25 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(workbook, titleSheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    XLSX.writeFile(workbook, `${filename}.xlsx`);
    console.log('Excel file exported successfully');
  } catch (error) {
    console.error('Excel export failed:', error);
    alert('Failed to export Excel file. Please try again.');
  }
};

const savePDFFile = (doc: jsPDF, filename: string) => {
  try {
    doc.save(filename);
  } catch (error) {
    console.error('Standard save failed, trying manual download:', error);
    try {
      const pdfBlob = doc.output('blob');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (blobError) {
      console.error('Manual download failed:', blobError);
      alert('PDF download failed. Please try again.');
    }
  }
};

export const exportToPDF = (transactions: Transaction[], summary: any, filename: string = 'budgetly-report') => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');

    const colors = {
      primary: [41, 128, 185] as [number, number, number],
      secondary: [52, 152, 219] as [number, number, number],
      accent: [26, 82, 118] as [number, number, number],
      success: [46, 204, 113] as [number, number, number],
      danger: [231, 76, 60] as [number, number, number],
      light: [236, 240, 241] as [number, number, number],
      lighter: [248, 249, 250] as [number, number, number],
      text: [52, 73, 94] as [number, number, number],
      textLight: [127, 140, 141] as [number, number, number],
      white: [255, 255, 255] as [number, number, number]
    };

    // Transparent watermark overlay ON TOP of content (see-through)
    const addTransparentWatermarkOverlay = () => {
      try {
        // Create graphics state with opacity (if supported)
        const gState = (doc as any).GState ? (doc as any).GState({ opacity: 0.15 }) : null;
        if (gState) {
          (doc as any).setGState(gState);
        }

        // Watermark style
        doc.setTextColor(120, 120, 120); // medium gray
        doc.setFontSize(65);
        doc.setFont('helvetica', 'bold');

        // Center coordinates
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        // Add rotated transparent watermark
        doc.text('BUDGETLY', centerX, centerY, {
          angle: -45,
          align: 'center'
        });

        // Reset opacity (if supported)
        if (gState) {
          const reset = (doc as any).GState({ opacity: 1 });
          (doc as any).setGState(reset);
        }
      } catch (error) {
        console.warn('Transparent watermark overlay failed, using fallback:', error);

        // Fallback: fake transparency with lighter color
        doc.setTextColor(200, 200, 200); // light gray
        doc.setFontSize(65);
        doc.setFont('helvetica', 'bold');

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        doc.text('BUDGETLY', centerX, centerY, {
          angle: -45,
          align: 'center'
        });
      }
    };


    // YOUR EXACT SAME header design
    const createHeader = () => {
      try {
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(0, 35, 210, 5, 'F');

        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('BUDGETLY', 20, 22);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Smart Budget Management Solution', 20, 30);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('FINANCIAL REPORT', 190, 18, { align: 'right' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const currentDate = new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        doc.text(`Generated: ${currentDate}`, 190, 26, { align: 'right' });
        doc.text(`Transactions: ${transactions.length}`, 190, 32, { align: 'right' });
      } catch (error) {
        console.error('Header creation failed:', error);
      }
    };

    // YOUR EXACT SAME summary section
    const createSummary = () => {
      try {
        const startY = 50;

        doc.setFillColor(colors.lighter[0], colors.lighter[1], colors.lighter[2]);
        doc.rect(15, startY, 180, 45, 'F');

        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(1);
        doc.rect(15, startY, 180, 45, 'S');

        doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.rect(15, startY, 180, 10, 'F');
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('FINANCIAL SUMMARY', 20, startY + 7);

        const contentY = startY + 20;

        doc.setFontSize(10);
        doc.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Income', 25, contentY);
        doc.setFontSize(12);

        const incomeAmount = summary.totalIncome.toFixed(2);
        const incomeText = `Rs. ${incomeAmount}`;
        doc.text(incomeText, 25, contentY + 8);

        doc.setFontSize(10);
        doc.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
        doc.text('Total Expenses', 85, contentY);
        doc.setFontSize(12);

        const expenseAmount = summary.totalExpenses.toFixed(2);
        const expenseText = `Rs. ${expenseAmount}`;
        doc.text(expenseText, 85, contentY + 8);

        const balanceColor = summary.balance >= 0 ? colors.success : colors.danger;
        doc.setFontSize(10);
        doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
        doc.text('Net Balance', 145, contentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');

        const balanceAmount = summary.balance.toFixed(2);
        const balanceText = `Rs. ${balanceAmount}`;
        doc.text(balanceText, 145, contentY + 8);

        return startY + 50;
      } catch (error) {
        console.error('Summary creation failed:', error);
        return 100;
      }
    };

    // REPLACED: Manual table creation with YOUR EXACT SAME styling
    const createTransactionTable = (startY: number) => {
      try {
        const tableData = transactions.map(transaction => [
          transaction.date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
          }),
          transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
          transaction.category.length > 12 ? transaction.category.substring(0, 12) + '...' : transaction.category,
          transaction.description.length > 22 ? transaction.description.substring(0, 22) + '...' : transaction.description,
          (transaction.paymentMode || 'Cash').length > 8 ? (transaction.paymentMode || 'Cash').substring(0, 8) + '...' : (transaction.paymentMode || 'Cash'),
          `Rs. ${transaction.amount.toFixed(2)}`
        ]);

        // Manual table implementation with YOUR EXACT styling
        const rowHeight = 8;
        const colWidths = [22, 18, 30, 50, 20, 30];
        const colX = [10, 32, 50, 80, 130, 150];
        let currentY = startY;

        // Table header with YOUR EXACT colors and styling
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(10, currentY, 190, rowHeight + 2, 'F');

        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');

        const headers = ['Date', 'Type', 'Category', 'Description', 'Payment', 'Amount'];
        headers.forEach((header, i) => {
          doc.text(header, colX[i] + 2, currentY + 6);
        });

        currentY += rowHeight + 2;

        // Table rows with YOUR EXACT styling
        tableData.forEach((row, index) => {
          // Alternating row colors like YOUR design
          if (index % 2 === 0) {
            doc.setFillColor(colors.lighter[0], colors.lighter[1], colors.lighter[2]);
            doc.rect(10, currentY, 190, rowHeight, 'F');
          }

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');

          row.forEach((cell, colIndex) => {
            // YOUR EXACT color coding for transaction types
            if (colIndex === 1) { // Type column
              const type = cell.toString().toLowerCase();
              if (type === 'income') {
                doc.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
                doc.setFont('helvetica', 'bold');
              } else if (type === 'expense') {
                doc.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
                doc.setFont('helvetica', 'bold');
              }
            } else if (colIndex === 5) { // Amount column
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
              doc.setFont('helvetica', 'bold');
            } else {
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
              doc.setFont('helvetica', 'normal');
            }

            const align = colIndex === 5 ? 'right' : 'left';
            const xPos = align === 'right' ? colX[colIndex] + colWidths[colIndex] - 2 : colX[colIndex] + 2;

            doc.text(cell, xPos, currentY + 6, { align });
          });

          currentY += rowHeight;

          // Add new page if needed
          if (currentY > 250) {
            // YOUR EXACT footer before new page
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;

            doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');

            doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text('Budgetly - Your Personal Finance Manager', 10, pageHeight - 10);

            doc.setFontSize(6);
            const currentYear = new Date().getFullYear();
            doc.text(`© ${currentYear} Budgetly. All rights reserved.`, 10, pageHeight - 4);

            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(`Page 1`, pageWidth - 15, pageHeight - 7, { align: 'right' });

            // Add watermark and new page
            addTransparentWatermarkOverlay();
            doc.addPage();
            currentY = 20;
          }
        });

        // Final page watermark and footer
        addTransparentWatermarkOverlay();

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');

        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Budgetly - Your Personal Finance Manager', 10, pageHeight - 10);

        doc.setFontSize(6);
        const currentYear = new Date().getFullYear();
        doc.text(`© ${currentYear} Budgetly. All rights reserved.`, 10, pageHeight - 4);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(`Page 1`, pageWidth - 15, pageHeight - 7, { align: 'right' });

      } catch (error) {
        console.error('Table creation failed:', error);
      }
    };

    console.log('Starting PDF generation...');

    createHeader();
    const summaryEndY = createSummary();

    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION DETAILS', 15, summaryEndY + 15);

    createTransactionTable(summaryEndY + 25);

    console.log('PDF generation completed, saving...');
    savePDFFile(doc, `${filename}.pdf`);

  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to generate PDF. Please check console for details.');
  }
};
