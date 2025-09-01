import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, BarChart3, LogOut, Plus, Download, Eye } from 'lucide-react';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { TransactionForm } from '@/components/budget/TransactionForm';
import { TransactionList } from '@/components/budget/TransactionList';
import { AdvancedCharts } from '@/components/budget/AdvancedCharts';
import { ExportButtons } from '@/components/budget/ExportButtons';

import { PremiumHero } from '@/components/ui/premium-hero';
import { PremiumFooter } from '@/components/ui/premium-footer';
import { useBudget } from '@/hooks/useBudget';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/currency';
import { motion } from 'framer-motion';

const Index = () => {
  const { transactions, loading, user, addTransaction, deleteTransaction, getSummary, getMonthlyData } = useBudget();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Add ref for the transaction form
  const transactionFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  // Scroll to form when it becomes visible
  useEffect(() => {
    if (showTransactionForm && transactionFormRef.current) {
      // Add a small delay to ensure the animation starts first
      const scrollTimeout = setTimeout(() => {
        transactionFormRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100); // Small delay to let the form start opening

      return () => clearTimeout(scrollTimeout);
    }
  }, [showTransactionForm]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleToggleTransactionForm = () => {
    setShowTransactionForm(!showTransactionForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/80 text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const summary = getSummary();
  const monthlyData = getMonthlyData();

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
    setShowTransactionForm(false);
    toast({
      title: "Transaction added successfully!",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ₹${transaction.amount} added.`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed from your budget.",
    });
  };

  if (!user) {
    return <PremiumHero onGetStarted={() => navigate('/auth')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/10 to-slate-950">
      {/* Keep the Hero Section */}
      <PremiumHero onGetStarted={() => navigate('/auth')} />

      {/* Premium Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {user?.user_metadata?.name ? `Hello, ${user.user_metadata.name}` : "Hello Sir/Ma'am"}
              </h1>
              <p className="text-white/60 mt-1">Welcome back, manage your finances with style</p>
            </div>

            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleToggleTransactionForm}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-semibold backdrop-blur-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Premium Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-2">Current Balance</h3>
              <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Transaction Form with Ref for Auto-Scroll */}
        {showTransactionForm && (
          <motion.div
            ref={transactionFormRef}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden"
            id="transaction-form-section"
          >
            <TransactionForm onSubmit={handleAddTransaction} />
          </motion.div>
        )}

        {/* Premium Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Export & Analytics</h3>
                <p className="text-white/60">Download your financial data or view detailed reports</p>
              </div>
              <ExportButtons transactions={transactions} summary={summary} />
            </div>
          </div>
        </motion.div>

        {/* Premium Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Advanced Analytics</h3>
                <p className="text-white/60">Visualize your financial patterns</p>
              </div>
            </div>
            <AdvancedCharts
              transactions={transactions}
              monthlyData={monthlyData}
              categorySummary={summary.categorySummary}
            />
          </div>
        </motion.div>

        {/* Premium Transaction List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">Recent Transactions</h3>
              <p className="text-white/60">Your latest financial activities</p>
            </div>
            <div className="p-6">
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Footer */}
      <PremiumFooter />
    </div>
  );
};

export default Index;
