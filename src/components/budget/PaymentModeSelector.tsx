import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPaymentModes } from '@/utils/currency';
import { motion } from 'framer-motion';

interface PaymentModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PaymentModeSelector = ({ value, onChange }: PaymentModeSelectorProps) => {
  const paymentModes = getPaymentModes();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <Label htmlFor="payment-mode">Payment Mode</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select payment mode" />
        </SelectTrigger>
        <SelectContent>
          {paymentModes.map((mode) => (
            <SelectItem key={mode.id} value={mode.id}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{mode.icon}</span>
                <span>{mode.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};