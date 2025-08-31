import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MonthlyData } from '@/types/budget';
import { formatCurrency } from '@/utils/storage';

interface MonthlyChartProps {
  data: MonthlyData[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No monthly data available yet. Add transactions to see trends over time!</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-medium">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.dataKey === 'income' ? 'Income' : 
               item.dataKey === 'expenses' ? 'Expenses' : 'Balance'}: {formatCurrency(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-medium">
      <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
      
      <div className="space-y-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Income vs Expenses</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="income" 
                fill="hsl(var(--income))"
                radius={[2, 2, 0, 0]}
                name="Income"
              />
              <Bar 
                dataKey="expenses" 
                fill="hsl(var(--expense))"
                radius={[2, 2, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Balance Line Chart */}
        <div className="h-48">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Monthly Balance</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};