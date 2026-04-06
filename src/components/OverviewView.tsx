import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SummaryCard } from './SummaryCard';
import { ChartsSection } from './ChartsSection';
import { formatTransactionDate, getLatestTransactions, getTransactionTotals } from '../utils/dashboard';
import { Pencil } from 'lucide-react';

interface OverviewViewProps {
  onViewAll: () => void;
}

const SkeletonSummary = () => (
  <div className="bg-surface-container-lowest flex h-[132px] flex-col justify-between rounded-xl p-[20px] animate-pulse opacity-70">
    <div className="mb-2 flex items-start justify-between">
      <div className="h-3 w-24 rounded bg-surface-container-high"></div>
      <div className="h-5 w-5 rounded-full bg-surface-container-high opacity-50"></div>
    </div>
    <div className="mt-4 flex items-end justify-between">
      <div className="h-8 w-32 rounded bg-surface-container-high"></div>
      <div className="h-5 w-16 rounded bg-surface-container-high"></div>
    </div>
  </div>
);

export const OverviewView = ({ onViewAll }: OverviewViewProps) => {
  const { transactions, isLoadingData, role } = useDashboard();
  const recentTransactions = React.useMemo(() => getLatestTransactions(transactions, 5), [transactions]);
  const { totalIncome, totalExpense, totalBalance } = React.useMemo(
    () => getTransactionTotals(transactions),
    [transactions],
  );

  return (
    <>
      {/* Top Row: Summary Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isLoadingData ? (
          <>
             <SkeletonSummary />
             <SkeletonSummary />
             <SkeletonSummary />
          </>
        ) : (
          <>
             <SummaryCard
                label="Total Balance"
                rawValue={totalBalance}
                indicatorText={`+${totalIncome > 0 ? (totalIncome/1000).toFixed(1) : 0}k this month`}
                indicatorType="positive"
                tone="primary"
                icon={true} // use true as a flag here if we want default icon
             />
             <SummaryCard
                label="Monthly Income"
                rawValue={totalIncome}
                indicatorText={`+${((totalIncome / (totalBalance || 1)) * 100).toFixed(1)}%`}
                indicatorType="positive"
                tone="success"
             />
             <SummaryCard
                label="Monthly Expenses"
                rawValue={totalExpense}
                indicatorText={`-${((totalExpense / (totalBalance || 1)) * 100).toFixed(1)}%`}
                indicatorType="negative"
                tone="gold"
             />
          </>
        )}
      </div>

      {/* Middle Row: Charts */}
      <div className="mb-8">
         <ChartsSection inlineLayout />
      </div>

      {/* Bottom Row: Recent Transactions Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="p-8 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-on-surface">Recent Transactions</h3>
            <p className="text-xs text-on-surface-variant">Review and manage your latest financial activities</p>
          </div>
          <button onClick={onViewAll} className="text-primary text-xs font-bold hover:underline">View all transactions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">
                <th className="px-8 py-4 font-bold">Date</th>
                <th className="px-8 py-4 font-bold">Category</th>
                <th className="px-8 py-4 font-bold">Type</th>
                <th className="px-8 py-4 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {isLoadingData ? (
                 Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`loading-row-${index}`} className="animate-pulse">
                      <td className="px-8 py-4"><div className="h-4 w-24 rounded bg-surface-container-high"></div></td>
                      <td className="px-8 py-4"><div className="h-5 w-16 rounded-full bg-surface-container-high"></div></td>
                      <td className="px-8 py-4"><div className="h-4 w-12 rounded bg-surface-container-high"></div></td>
                      <td className="px-8 py-4"><div className="h-4 w-20 rounded bg-surface-container-high"></div></td>
                    </tr>
                 ))
              ) : recentTransactions.length > 0 ? (
                 recentTransactions.map(transaction => (
                   <tr key={transaction.id} className="hover:bg-surface-container-low/50 transition-colors group">
                     <td className="px-8 py-4 text-xs text-on-surface-variant mono-nums">{formatTransactionDate(transaction.date)}</td>
                     <td className="px-8 py-4">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant uppercase tracking-tight">
                           {transaction.category}
                        </span>
                     </td>
                     <td className="px-8 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                           {transaction.type === 'income' ? 'Credit' : 'Expense'}
                        </span>
                     </td>
                     <td className={`px-8 py-4 text-xs font-bold mono-nums ${transaction.type === 'income' ? 'text-emerald-600' : 'text-on-surface'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                     </td>
                   </tr>
                 ))
              ) : (
                 <tr>
                   <td colSpan={4} className="px-8 py-14 text-center text-sm text-on-surface-variant">
                     No transactions recorded yet.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
