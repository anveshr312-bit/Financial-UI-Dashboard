import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { downloadCSV } from '../utils/export';

export const ReportsView = () => {
  const { transactions } = useDashboard();
  const [dateFilter, setDateFilter] = useState<'this_month' | 'last_month' | 'all'>('this_month');

  // Filter Logic
  const now = new Date();
  const currentMonthISO = now.toISOString().substring(0, 7);
  
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthISO = lastMonthDate.toISOString().substring(0, 7);

  const filteredData = transactions.filter(t => {
    if (dateFilter === 'this_month') return t.date.startsWith(currentMonthISO);
    if (dateFilter === 'last_month') return t.date.startsWith(lastMonthISO);
    return true; // all
  });

  const handleDownloadObject = (data: any[], headers: string, rowMapper: (item: any) => string, filename: string) => {
    const csvRows = data.map(rowMapper).join('\n');
    const blob = new Blob([headers + '\n' + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStandard = (data: typeof transactions, filename: string) => {
     downloadCSV(data, filename);
  };

  // Pre-calculated stats for previews
  const totalIncome = filteredData.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredData.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  
  // Custom Exporters
  const exportSpendingSummary = () => {
     const expenses = filteredData.filter(t => t.type === 'expense');
     const byCategory = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
     }, {} as Record<string, number>);
     
     const data = Object.entries(byCategory).map(([cat, amt]) => ({ cat, amt }));
     handleDownloadObject(data, 'Category,Total_Amount', (d) => `${d.cat},${d.amt}`, `spending_summary_${dateFilter}.csv`);
  };

  const exportIncomeVsExpense = () => {
     const data = [
       { type: 'Income', amount: totalIncome },
       { type: 'Expense', amount: totalExpense },
       { type: 'Net', amount: totalIncome - totalExpense }
     ];
     handleDownloadObject(data, 'Metric,Total_Amount', (d) => `${d.type},${d.amount}`, `income_vs_expense_${dateFilter}.csv`);
  };

  const exportCategoryDetailed = () => {
     const sorted = [...filteredData].sort((a, b) => a.category.localeCompare(b.category));
     handleDownloadStandard(sorted, `category_detailed_${dateFilter}.csv`);
  };

  const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2">
            Structured Reports
          </h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Download pre-configured financial summaries based on your transactional history.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
            Last Generated: {lastUpdated}
          </p>
          <div className="flex bg-surface-container-low p-1 rounded-xl shadow-sm border border-outline-variant/10">
            <button 
              onClick={() => setDateFilter('this_month')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${dateFilter === 'this_month' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => setDateFilter('last_month')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${dateFilter === 'last_month' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Last Month
            </button>
            <button 
              onClick={() => setDateFilter('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${dateFilter === 'all' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Standard Export */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:border-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Standard Period Report</h3>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Complete log of all individual transactions logged within the selected date range.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="text-[10px] bg-surface-container-low p-2 rounded-lg text-on-surface-variant font-medium">
               Includes {filteredData.length} records • ${(totalIncome + totalExpense).toLocaleString()} total volume
             </div>
             <button 
               onClick={() => handleDownloadStandard(filteredData, `period_report_${dateFilter}.csv`)}
               className="py-2 px-4 rounded-lg font-bold text-xs bg-primary text-on-primary w-full hover:bg-primary/90 flex justify-center items-center gap-2"
             >
               <span className="material-symbols-outlined text-[16px]">download</span>
               Download CSV
             </button>
          </div>
        </div>

        {/* Spending Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:border-error/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-error-container group-hover:text-error transition-colors">
            <span className="material-symbols-outlined text-xl">pie_chart</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Spending Summary</h3>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Aggregated category-wise expense breakdown highlighting largest outflow channels.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="text-[10px] bg-error-container/30 p-2 rounded-lg text-error font-bold">
               Tracks ${totalExpense.toLocaleString()} in Expenses
             </div>
             <button 
               onClick={exportSpendingSummary}
               className="py-2 px-4 rounded-lg font-bold text-xs border border-error/20 text-error hover:bg-error-container/50 w-full flex justify-center items-center gap-2 transition-colors"
             >
               <span className="material-symbols-outlined text-[16px]">download</span>
               Download CSV
             </button>
          </div>
        </div>

        {/* Income vs Expense */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:border-success/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-emerald-100 group-hover:text-success transition-colors">
            <span className="material-symbols-outlined text-xl">balance</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Income vs Expense</h3>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">High-level comparison mapping total capital velocity and net positioning.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg text-success font-bold flex justify-between">
               <span>In: ${totalIncome.toLocaleString()}</span>
               <span>Net: ${(totalIncome - totalExpense).toLocaleString()}</span>
             </div>
             <button 
               onClick={exportIncomeVsExpense}
               className="py-2 px-4 rounded-lg font-bold text-xs border border-success/20 text-success hover:bg-emerald-50 dark:hover:bg-emerald-900/20 w-full flex justify-center items-center gap-2 transition-colors"
             >
               <span className="material-symbols-outlined text-[16px]">download</span>
               Download CSV
             </button>
          </div>
        </div>

        {/* Category Detailed */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:border-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">category</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Category Detailed</h3>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Chronological database export strictly grouped by categorization rules.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="text-[10px] bg-surface-container-low p-2 rounded-lg text-on-surface-variant font-medium">
               Sort rules applied to {filteredData.length} records
             </div>
             <button 
               onClick={exportCategoryDetailed}
               className="py-2 px-4 rounded-lg font-bold text-xs bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/20 w-full flex justify-center items-center gap-2 transition-colors"
             >
               <span className="material-symbols-outlined text-[16px]">download</span>
               Download CSV
             </button>
          </div>
        </div>

        {/* YTD Archive */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:border-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">database</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Complete YTD Archive</h3>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Raw export ignoring current UI filters. Represents the full unstructured system backup format.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="text-[10px] bg-surface-container-low p-2 rounded-lg text-on-surface-variant font-medium">
               Unfiltered • {transactions.length} total system records
             </div>
             <button 
               onClick={() => handleDownloadStandard(transactions, 'YTD_archive_full.csv')}
               className="py-2 px-4 rounded-lg font-bold text-xs bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/20 w-full flex justify-center items-center gap-2 transition-colors"
             >
               <span className="material-symbols-outlined text-[16px]">download</span>
               Download CSV
             </button>
          </div>
        </div>

        {/* Quarterly Overview (Disabled PDF) */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-4 opacity-60 relative group">
          <div className="absolute inset-0 bg-surface/40 z-10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
            <span className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">Coming soon in v2.0</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
          </div>
          <div>
             <div className="flex justify-between items-center">
                 <h3 className="font-bold text-on-surface">Quarterly PDF</h3>
                 <span className="text-[9px] bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">SOON</span>
             </div>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Visual PDF breakdown of quarterly earnings versus projected spending metrics.</p>
          </div>
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <button 
               disabled
               className="py-2 px-4 rounded-lg font-bold text-xs bg-surface-container flex justify-center items-center gap-2 text-on-surface-variant/50 cursor-not-allowed w-full"
             >
               <span className="material-symbols-outlined text-[16px]">lock</span>
               PDF Unavailable
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
