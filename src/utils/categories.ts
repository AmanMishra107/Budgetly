import { Category } from '@/types/budget';
import { supabase } from '@/integrations/supabase/client';

export const defaultCategories: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', type: 'income', color: 'hsl(142 50% 55%)' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: 'hsl(142 45% 60%)' },
  { id: 'investment', name: 'Investment', type: 'income', color: 'hsl(142 40% 65%)' },
  { id: 'other-income', name: 'Other Income', type: 'income', color: 'hsl(142 35% 70%)' },
  
  // Expense categories
  { id: 'food', name: 'Food & Dining', type: 'expense', color: 'hsl(15 70% 70%)' },
  { id: 'transportation', name: 'Transportation', type: 'expense', color: 'hsl(25 65% 65%)' },
  { id: 'housing', name: 'Housing', type: 'expense', color: 'hsl(35 60% 60%)' },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: 'hsl(45 55% 55%)' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: 'hsl(55 50% 50%)' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: 'hsl(65 45% 45%)' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: 'hsl(275 60% 65%)' },
  { id: 'education', name: 'Education', type: 'expense', color: 'hsl(195 55% 60%)' },
  { id: 'other-expense', name: 'Other Expenses', type: 'expense', color: 'hsl(315 50% 55%)' }
];

export const getCategories = async (type?: 'income' | 'expense'): Promise<Category[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Return default categories for non-authenticated users
      if (type) return defaultCategories.filter(c => c.type === type);
      return defaultCategories;
    }

    let query = supabase.from('categories').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    const categories: Category[] = data?.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type as 'income' | 'expense',
      color: d.color
    })) || [];
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to default categories
    if (type) return defaultCategories.filter(c => c.type === type);
    return defaultCategories;
  }
};

export const getCategoryColor = (categoryName: string): string => {
  const category = defaultCategories.find(c => c.name === categoryName);
  return category?.color || 'hsl(220 15% 60%)';
};

export const getCategoryName = (categoryId: string): string => {
  const category = defaultCategories.find(c => c.id === categoryId);
  return category?.name || categoryId;
};

export const getIncomeCategories = (): Category[] => {
  return defaultCategories.filter(c => c.type === 'income');
};

export const getExpenseCategories = (): Category[] => {
  return defaultCategories.filter(c => c.type === 'expense');
};