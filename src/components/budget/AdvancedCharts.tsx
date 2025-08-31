import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import { Transaction, MonthlyData } from '@/types/budget';
import { formatCurrency } from '@/utils/currency';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface AdvancedChartsProps {
  transactions: Transaction[];
  monthlyData: MonthlyData[];
  categorySummary: Record<string, number>;
}

// Premium color palette
const PREMIUM_COLORS = [
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316'  // Orange
];

export const AdvancedCharts = ({ transactions, monthlyData, categorySummary }: AdvancedChartsProps) => {
  // Prepare trend data for the last 30 days
  const getTrendData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map(date => {
      const dayTransactions = transactions.filter(t =>
        t.date.toDateString() === date.toDateString()
      );

      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      return {
        date: date.getDate().toString(),
        income,
        expenses,
        balance: income - expenses
      };
    });
  };

  const trendData = getTrendData();

  // Prepare category data for pie chart
  const categoryData = Object.entries(categorySummary).map(([category, amount]) => ({
    name: category,
    value: amount
  })).slice(0, 8); // Top 8 categories

  // Premium custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          className="bg-slate-800/95 backdrop-blur-xl p-3 sm:p-4 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl max-w-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-semibold text-white mb-2 text-sm sm:text-base">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs sm:text-sm text-white/90 flex items-center gap-2">
              <span
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate">{entry.name}: {formatCurrency(entry.value)}</span>
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Daily Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl sm:rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">Daily Cash Flow</h3>
              <p className="text-sm sm:text-base text-white/60">Last 30 days trend analysis</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-4">
            <div className="w-full h-64 sm:h-72 md:h-80 lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={10}
                    className="sm:text-xs md:text-sm"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={10}
                    className="sm:text-xs md:text-sm"
                    tick={{ fontSize: 10 }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#ef4444"
                    fill="url(#expenseGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                    className="sm:stroke-[3]"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-2xl sm:rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <PieChartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">Expense Distribution</h3>
              <p className="text-sm sm:text-base text-white/60">Breakdown by category</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-4">
              <div className="w-full h-64 sm:h-72 md:h-80 lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      className="sm:inner-radius-[60] sm:outer-radius-[120] md:inner-radius-[70] md:outer-radius-[140]"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg flex-shrink-0"
                      style={{ backgroundColor: PREMIUM_COLORS[index % PREMIUM_COLORS.length] }}
                    />
                    <span className="font-medium sm:font-semibold text-white text-sm sm:text-base truncate">{category.name}</span>
                  </div>
                  <span className="font-bold text-white text-sm sm:text-base flex-shrink-0 ml-2">{formatCurrency(category.value)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monthly Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl sm:rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">Monthly Comparison</h3>
              <p className="text-sm sm:text-base text-white/60">Income vs expenses over time</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-4">
            <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={10}
                    className="sm:text-xs md:text-sm"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={10}
                    className="sm:text-xs md:text-sm"
                    tick={{ fontSize: 10 }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="income"
                    fill="url(#incomeBar)"
                    radius={[4, 4, 0, 0]}
                    name="Income"
                    className="sm:radius-[6] md:radius-[8]"
                  />
                  <Bar
                    dataKey="expenses"
                    fill="url(#expenseBar)"
                    radius={[4, 4, 0, 0]}
                    name="Expenses"
                    className="sm:radius-[6] md:radius-[8]"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
