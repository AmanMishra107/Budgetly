import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Transaction } from '@/types/budget';
import { exportToExcel, exportToPDF } from '@/utils/export';
import { motion } from 'framer-motion';

interface ExportButtonsProps {
  transactions: Transaction[];
  summary: any;
}

export const ExportButtons = ({ transactions, summary }: ExportButtonsProps) => {
  const handleExcelExport = () => {
    const filename = `budget-data-${new Date().toISOString().split('T')[0]}`;
    exportToExcel(transactions, filename);
  };

  const handlePDFExport = () => {
    const filename = `budget-report-${new Date().toISOString().split('T')[0]}`;
    exportToPDF(transactions, summary, filename);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1"
      >
        <Button
          onClick={handleExcelExport}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border-0 group transition-all duration-300"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Export to Excel
          </span>
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1"
      >
        <Button
          onClick={handlePDFExport}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border-0 group transition-all duration-300"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative flex items-center justify-center gap-3">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Export to PDF
          </span>
        </Button>
      </motion.div>
    </div>
  );
};
