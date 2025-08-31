import { Transaction } from '@/types/budget';

const STORAGE_KEY = 'budget-planner-transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const transactions = JSON.parse(stored);
    // Convert date strings back to Date objects
    return transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date)
    }));
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return [];
  }
};

export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  if (currencyCode === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};