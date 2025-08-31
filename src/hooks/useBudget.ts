import { useState, useEffect, useCallback } from 'react';
import { Transaction, BudgetSummary, MonthlyData } from '@/types/budget';
import { supabase } from '@/integrations/supabase/client';

export const useBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load user and transactions on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await loadTransactions();
      } else {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const formattedTransactions: Transaction[] = data.map(t => ({
        id: t.id,
        type: t.type as 'income' | 'expense',
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        date: new Date(t.date),
        paymentMode: t.payment_mode || undefined
      }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
          payment_mode: transaction.paymentMode
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        amount: Number(data.amount),
        category: data.category,
        description: data.description,
        date: new Date(data.date),
        paymentMode: data.payment_mode || undefined
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }, [user]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }, []);

  const getSummary = useCallback((): BudgetSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categorySummary = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categorySummary
    };
  }, [transactions]);

  const getMonthlyData = useCallback((): MonthlyData[] => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(t => {
      const monthKey = t.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
      
      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expenses += t.amount;
      }
      
      monthlyMap.set(monthKey, existing);
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [transactions]);

  return {
    transactions,
    loading,
    user,
    addTransaction,
    deleteTransaction,
    getSummary,
    getMonthlyData
  };
};