import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Transaction } from '@/types/budget';
import { formatCurrency } from './currency';

export const exportToExcel = (transactions: Transaction[], filename: string = 'budget-data') => {
  const data = transactions.map((transaction, index) => ({
    'S.No': index + 1,
    'Date': transaction.date.toLocaleDateString('en-IN'),
    'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    'Category': transaction.category,
    'Description': transaction.description,
    'Payment Mode': transaction.paymentMode || 'Not specified',
    'Amount (₹)': transaction.amount,
  }));

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Add summary rows with proper types
  const summaryRows: any[] = [
    { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': '', 'Payment Mode': '', 'Amount (₹)': null },
    { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Total Income', 'Payment Mode': '', 'Amount (₹)': totalIncome },
    { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Total Expenses', 'Payment Mode': '', 'Amount (₹)': totalExpenses },
    { 'S.No': '', 'Date': '', 'Type': '', 'Category': '', 'Description': 'Balance', 'Payment Mode': '', 'Amount (₹)': balance }
  ];
  
  data.push(...summaryRows);

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Auto-size columns
  const colWidths = [
    { wch: 8 },  // S.No
    { wch: 12 }, // Date
    { wch: 10 }, // Type
    { wch: 20 }, // Category
    { wch: 30 }, // Description
    { wch: 15 }, // Payment Mode
    { wch: 15 }, // Amount
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (transactions: Transaction[], summary: any, filename: string = 'budget-report') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(60, 60, 60);
  doc.text('Budget Report', 20, 20);
  
  // Summary section
  doc.setFontSize(14);
  doc.text('Financial Summary', 20, 40);
  
  doc.setFontSize(12);
  doc.text(`Total Income: ${formatCurrency(summary.totalIncome)}`, 20, 55);
  doc.text(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`, 20, 65);
  doc.text(`Balance: ${formatCurrency(summary.balance)}`, 20, 75);
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 85);
  
  // Transactions table
  doc.setFontSize(14);
  doc.text('Transaction Details', 20, 105);
  
  let yPosition = 120;
  const pageHeight = doc.internal.pageSize.height;
  
  // Table headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Date', 20, yPosition);
  doc.text('Type', 45, yPosition);
  doc.text('Category', 65, yPosition);
  doc.text('Description', 95, yPosition);
  doc.text('Payment', 135, yPosition);
  doc.text('Amount (₹)', 155, yPosition);
  
  doc.setFont(undefined, 'normal');
  yPosition += 10;
  
  // Table content
  transactions.slice(0, 50).forEach((transaction) => { // Limit to 50 transactions
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(transaction.date.toLocaleDateString('en-IN'), 20, yPosition);
    doc.text(transaction.type, 45, yPosition);
    doc.text(transaction.category.substring(0, 12), 65, yPosition);
    doc.text(transaction.description.substring(0, 15), 95, yPosition);
    doc.text((transaction.paymentMode || 'N/A').substring(0, 8), 135, yPosition);
    doc.text(transaction.amount.toFixed(2), 155, yPosition);
    
    yPosition += 8;
  });
  
  if (transactions.length > 50) {
    doc.text(`... and ${transactions.length - 50} more transactions`, 20, yPosition + 10);
  }
  
  doc.save(`${filename}.pdf`);
};