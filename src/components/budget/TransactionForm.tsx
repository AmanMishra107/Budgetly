import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Banknote
} from 'lucide-react';
import { Transaction } from '@/types/budget';
import { defaultCategories } from '@/utils/categories';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string(),
  paymentMode: z.string().optional()
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

// Custom Payment Mode Selector Component
const PaymentModeSelector = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-2xl py-4">
        <SelectValue placeholder="Select payment mode" className="text-white/50" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl">
        <SelectItem
          value="upi"
          className="text-white hover:bg-white/10 focus:bg-white/10 flex items-center"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>UPI</span>
          </div>
        </SelectItem>
        <SelectItem
          value="credit_card"
          className="text-white hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>Credit Card</span>
          </div>
        </SelectItem>
        <SelectItem
          value="debit_card"
          className="text-white hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-green-400" />
            <span>Debit Card</span>
          </div>
        </SelectItem>
        <SelectItem
          value="net_banking"
          className="text-white hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Net Banking</span>
          </div>
        </SelectItem>
        <SelectItem
          value="cash"
          className="text-white hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>Cash</span>
          </div>
        </SelectItem>
        <SelectItem
          value="wallet"
          className="text-white hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-orange-400" />
            <span>Digital Wallet</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [paymentMode, setPaymentMode] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMode: ''
    }
  });

  const currentType = watch('type') || type;
  const categories = defaultCategories.filter(c => c.type === currentType);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setValue('type', newType);
    setValue('category', ''); // Reset category when type changes
  };

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      ...data,
      date: new Date(data.date)
    });
    reset({
      type: data.type,
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setPaymentMode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden w-full"
    >
      {/* Glow effect behind form */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl blur-xl" />

      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Add Transaction</h3>
                <p className="text-sm sm:text-base text-white/60">Record your income or expense</p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeChange('income')}
                  className={cn(
                    'w-full sm:w-auto transition-all duration-300 border-white/20 backdrop-blur-md text-xs sm:text-sm px-3 sm:px-4 py-2',
                    currentType === 'income'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-400 shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  )}
                >
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Income
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeChange('expense')}
                  className={cn(
                    'w-full sm:w-auto transition-all duration-300 border-white/20 backdrop-blur-md text-xs sm:text-sm px-3 sm:px-4 py-2',
                    currentType === 'expense'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-400 shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  )}
                >
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Expense
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
            <input type="hidden" {...register('type')} value={currentType} />

            {/* Amount and Category Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                className="space-y-2 sm:space-y-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="amount" className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className="text-base sm:text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl sm:rounded-2xl py-3 sm:py-4"
                />
                {errors.amount && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-red-400"
                  >
                    {errors.amount.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2 sm:space-y-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="category" className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Category
                </Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl sm:rounded-2xl py-3 sm:py-4">
                    <SelectValue placeholder="Select category" className="text-white/50" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-red-400"
                  >
                    {errors.category.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Description Field */}
            <motion.div
              className="space-y-2 sm:space-y-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="description" className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                <FileText className="w-4 h-4 text-purple-400" />
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="What was this transaction for?"
                {...register('description')}
                className="resize-none bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base"
                rows={3}
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-400"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </motion.div>

            {/* Date and Payment Mode Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                className="space-y-2 sm:space-y-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="date" className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl sm:rounded-2xl py-3 sm:py-4"
                />
                {errors.date && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-red-400"
                  >
                    {errors.date.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2 sm:space-y-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  Payment Mode
                </Label>
                <PaymentModeSelector
                  value={paymentMode}
                  onChange={(value) => {
                    setPaymentMode(value);
                    setValue('paymentMode', value);
                  }}
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className={cn(
                  'w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-xl border-0 transition-all duration-300 text-base sm:text-lg',
                  currentType === 'income'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                )}
              >
                {currentType === 'income' ? (
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                ) : (
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                )}
                Add {currentType === 'income' ? 'Income' : 'Expense'}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
