// Currency utilities for Indian Rupee and conversion

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate compared to INR (1 INR = rate)
}

export const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0095 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.8 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.018 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.016 },
];

export const getDefaultCurrency = (): Currency => currencies[0]; // INR

export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  const currency = currencies.find(c => c.code === currencyCode) || getDefaultCurrency();
  
  // For Indian Rupee, use Indian number formatting
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

export const convertCurrency = (amount: number, fromCode: string, toCode: string): number => {
  const fromCurrency = currencies.find(c => c.code === fromCode);
  const toCurrency = currencies.find(c => c.code === toCode);
  
  if (!fromCurrency || !toCurrency) return amount;
  
  // Convert to INR first, then to target currency
  const inrAmount = amount / fromCurrency.rate;
  return inrAmount * toCurrency.rate;
};

export const getPaymentModes = () => [
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'card', name: 'Debit/Credit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
  { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
];