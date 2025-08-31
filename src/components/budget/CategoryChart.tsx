import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/utils/storage';
import { getCategoryName, getCategoryColor } from '@/utils/categories';

interface CategoryChartProps {
  categorySummary: Record<string, number>;
  type: 'bar' | 'pie';
}

export const CategoryChart = ({ categorySummary, type }: CategoryChartProps) => {
  const data = Object.entries(categorySummary)
    .map(([category, amount]) => ({
      category: getCategoryName(category),
      amount,
      color: getCategoryColor(category)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8); // Top 8 categories

  if (data.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-medium">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No data available yet. Add some transactions to see your spending patterns!</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-medium">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-medium">
      <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                radius={[4, 4, 0, 0]}
                fill="hsl(var(--primary))"
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => 
                  percent > 5 ? `${category} ${(percent * 100).toFixed(0)}%` : ''
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend for pie chart */}
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.category}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};