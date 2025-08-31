import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, Filter, Calendar, FileText } from 'lucide-react';
import { Transaction } from '@/types/budget';
import { formatCurrency, formatDate } from '@/utils/storage';
import { getCategoryName, defaultCategories } from '@/utils/categories';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(transaction.category).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = defaultCategories.filter(c => filterType === 'all' || c.type === filterType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      {/* Glow effect behind container */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl blur-xl" />

      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Recent Transactions</h3>
                <p className="text-sm sm:text-base text-white/60">Your latest financial activities</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base text-white/70 bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
              <Filter className="w-4 h-4 text-purple-400" />
              <span className="font-medium">{filteredTransactions.length} of {transactions.length}</span>
            </div>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <motion.div
              className="lg:col-span-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl py-3 text-sm sm:text-base"
              />
            </motion.div>

            {/* Type Filter */}
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Select value={filterType} onValueChange={(value: any) => {
                setFilterType(value);
                setFilterCategory('all');
              }}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl py-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl">
                  <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Types</SelectItem>
                  <SelectItem value="income" className="text-white hover:bg-white/10 focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Income
                    </div>
                  </SelectItem>
                  <SelectItem value="expense" className="text-white hover:bg-white/10 focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Expense
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Category Filter */}
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl py-3">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl max-h-60 overflow-y-auto">
                  <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Categories</SelectItem>
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
            </motion.div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredTransactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white/40" />
                </div>
                <p className="text-white/60 text-base sm:text-lg">
                  {transactions.length === 0 ? (
                    "No transactions yet. Add your first transaction!"
                  ) : (
                    "No transactions match your current filters."
                  )}
                </p>
              </motion.div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative overflow-hidden"
                >
                  {/* Item glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-sm" />

                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg hover:bg-white/10 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={cn(
                          'w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0',
                          transaction.type === 'income' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
                        )}
                        style={{
                          boxShadow: transaction.type === 'income' ? '0 0 8px rgba(16, 185, 129, 0.5)' : '0 0 8px rgba(239, 68, 68, 0.5)'
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm sm:text-base truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60 mt-1">
                          <span className="truncate">{getCategoryName(transaction.category)}</span>
                          <div className="w-1 h-1 bg-white/40 rounded-full flex-shrink-0"></div>
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-shrink-0">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-3 sm:mt-0">
                      <span
                        className={cn(
                          'font-bold text-lg sm:text-xl',
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        )}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(transaction.id)}
                          className="text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg p-2 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
