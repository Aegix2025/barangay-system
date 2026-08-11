// src/components/ExportReport.tsx
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Printer, Check } from 'lucide-react';

interface ExportReportProps {
  data: any[];
  columns: { key: string; label: string }[];
  filename?: string;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onPrint?: () => void;
}

export const ExportReport: React.FC<ExportReportProps> = ({
  data,
  columns,
  filename = 'report',
  onExport,
  onPrint,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setExporting(true);
    
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onExport) {
        onExport(format);
      } else {
        // Default export behavior
        const headers = columns.map(c => c.label).join(',');
        const rows = data.map(item => 
          columns.map(c => {
            let value = item[c.key];
            if (typeof value === 'string' && value.includes(',')) {
              value = `"${value}"`;
            }
            return value || '';
          }).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'csv'}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      setExportSuccess(format.toUpperCase());
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
      setShowMenu(false);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>Export as PDF</span>
                {exportSuccess === 'PDF' && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                <span>Export as Excel</span>
                {exportSuccess === 'EXCEL' && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Export as CSV</span>
                {exportSuccess === 'CSV' && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <Printer className="w-4 h-4 text-purple-500" />
                <span>Print Report</span>
              </button>
            </div>

            {exporting && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exporting...</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};