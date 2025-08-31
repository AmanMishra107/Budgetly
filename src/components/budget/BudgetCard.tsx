import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/storage';

interface BudgetCardProps {
  title: string;
  amount: number;
  variant: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
  className?: string;
}

export const BudgetCard = ({ title, amount, variant, icon, className }: BudgetCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'bg-gradient-income text-income-foreground shadow-medium hover:shadow-hover';
      case 'expense':
        return 'bg-gradient-expense text-expense-foreground shadow-medium hover:shadow-hover';
      case 'balance':
        return amount >= 0 
          ? 'bg-gradient-income text-income-foreground shadow-medium hover:shadow-hover'
          : 'bg-gradient-expense text-expense-foreground shadow-medium hover:shadow-hover';
      default:
        return 'bg-gradient-card shadow-soft hover:shadow-medium';
    }
  };

  return (
    <Card className={cn(
      'p-6 transition-all duration-300 hover:scale-105 border-0',
      getVariantStyles(),
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">
            {title}
          </p>
          <p className="text-2xl font-bold">
            {formatCurrency(amount)}
          </p>
        </div>
        <div className="opacity-80 text-2xl">
          {icon}
        </div>
      </div>
    </Card>
  );
};