-- Add payment_mode column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN payment_mode TEXT;