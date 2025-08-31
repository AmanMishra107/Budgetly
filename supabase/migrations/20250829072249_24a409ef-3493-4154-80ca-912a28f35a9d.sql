-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, type, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for categories
CREATE POLICY "Users can view their own categories" 
ON public.categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for income
INSERT INTO public.categories (name, type, color, user_id) VALUES
('Salary', 'income', '#10b981', '00000000-0000-0000-0000-000000000000'),
('Freelance', 'income', '#3b82f6', '00000000-0000-0000-0000-000000000000'),
('Investment', 'income', '#8b5cf6', '00000000-0000-0000-0000-000000000000'),
('Gift', 'income', '#f59e0b', '00000000-0000-0000-0000-000000000000'),
('Other Income', 'income', '#06b6d4', '00000000-0000-0000-0000-000000000000');

-- Insert default categories for expenses
INSERT INTO public.categories (name, type, color, user_id) VALUES
('Food & Dining', 'expense', '#ef4444', '00000000-0000-0000-0000-000000000000'),
('Transportation', 'expense', '#f97316', '00000000-0000-0000-0000-000000000000'),
('Shopping', 'expense', '#ec4899', '00000000-0000-0000-0000-000000000000'),
('Entertainment', 'expense', '#8b5cf6', '00000000-0000-0000-0000-000000000000'),
('Bills & Utilities', 'expense', '#6b7280', '00000000-0000-0000-0000-000000000000'),
('Healthcare', 'expense', '#14b8a6', '00000000-0000-0000-0000-000000000000'),
('Education', 'expense', '#3b82f6', '00000000-0000-0000-0000-000000000000'),
('Other Expense', 'expense', '#64748b', '00000000-0000-0000-0000-000000000000');