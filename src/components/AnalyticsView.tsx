import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { InsightCard } from './InsightCard';
import { getHighestSpendingCategory, getMonthlyComparison, getExpenseTotalsByCategory } from '../utils/dashboard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const AnalyticsView = () => {
  const { transactions } = useDashboard();
  const comparison = React.useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const highestCategory = React.useMemo(() => getHighestSpendingCategory(transactions), [transactions]);
  
  const currentMonthBreakdown = getExpenseTotalsByCategory(transactions, comparison.currentMonthKey);
  const fallbackBreakdown = getExpenseTotalsByCategory(transactions);
  const expenseByCategory = Object.keys(currentMonthBreakdown).length > 0 ? currentMonthBreakdown : fallbackBreakdown;

  const donutData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  })).sort((a, b) => b.value - a.value);
  
  const totalSpent = donutData.reduce((acc, curr) => acc + curr.value, 0);

  const isIncrease = comparison.deltaAmount > 0;
  const isDecrease = comparison.deltaAmount < 0;
  const deltaPrefix = isIncrease ? '+' : isDecrease ? '-' : '';
  const comparisonIcon =
    comparison.deltaAmount === 0 ? <span className="material-symbols-outlined">drag_handle</span> : isIncrease ? <span className="material-symbols-outlined">trending_up</span> : <span className="material-symbols-outlined">trending_down</span>;

  return (
    <div className="space-y-8">
      {/* Top: Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          title="Top Expense"
          value={highestCategory.category || 'N/A'}
          description={highestCategory.amount > 0 ? `${highestCategory.sharePercent}% of total expenses` : 'No data recorded'}
          icon={<span className="material-symbols-outlined">home</span>}
        />
        <InsightCard
          title="Total Expenses"
          value={`$${totalSpent.toLocaleString()}`}
          description="In observed period"
          icon={<span className="material-symbols-outlined">account_balance_wallet</span>}
        />
        <InsightCard
          title="MoM Growth"
          value={`${deltaPrefix}${Math.abs(comparison.deltaPercent).toFixed(1)}%`}
          description="Vs. previous month"
          icon={<span className="material-symbols-outlined">equalizer</span>}
        />
        <InsightCard
          title="Income Streams"
          value={new Set(transactions.filter(t => t.type === 'income').map(t => t.category)).size.toString()}
          description="Active revenue categories"
          icon={<span className="material-symbols-outlined">savings</span>}
        />
      </section>

      {/* Middle: Spending by Category */}
      <section className="bg-surface-container-lowest p-8 rounded-xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Spending by Category</h3>
            <p className="text-sm text-on-surface-variant">Hierarchical breakdown of major outflows</p>
          </div>
        </div>
        <div className="space-y-6">
          {donutData.length > 0 ? donutData.slice(0, 4).map((item, index) => {
             const barColors = ['bg-primary', 'bg-primary/80', 'bg-secondary', 'bg-tertiary-fixed-dim'];
             const percent = Math.round((item.value / totalSpent) * 100);
             return (
               <div className="space-y-2" key={item.name}>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                   <span>{item.name}</span>
                   <span className="tabular-nums">${item.value.toLocaleString()}</span>
                 </div>
                 <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                   <div className={`h-full rounded-full ${barColors[index % barColors.length]}`} style={{ width: `${percent}%` }}></div>
                 </div>
               </div>
             );
          }) : (
             <p className="text-sm text-on-surface-variant font-medium">No categorization data available.</p>
          )}
        </div>
      </section>

      {/* Middle Bottom: Monthly Comparison */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-8 rounded-xl">
          <header className="mb-6">
            <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{comparison.previousLabel}</span>
            <h4 className="text-lg font-bold">Previous Month</h4>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Expenses</p>
              <p className="text-xl font-extrabold text-on-surface tabular-nums mt-1">${comparison.previousTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-2 py-1 bg-primary text-[8px] text-white font-bold uppercase tracking-wider rounded-sm">Current</span>
          </div>
          <header className="mb-6">
            <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{comparison.currentLabel}</span>
            <h4 className="text-lg font-bold">Current Month</h4>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Expenses</p>
              <p className="text-xl font-extrabold text-on-surface tabular-nums mt-1">${comparison.currentTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant">Change vs Prev</span>
            <span className={`text-sm font-bold tabular-nums ${isIncrease ? 'text-error' : isDecrease ? 'text-primary' : 'text-on-surface-variant'}`}>
               {deltaPrefix}${Math.abs(comparison.deltaAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Bottom: Strategic Observations */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          Strategic Observations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-primary space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">trending_down</span>
              <span className="text-xs font-bold uppercase text-on-surface tracking-wide">Optimization</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Top spending category is <span className="font-bold text-on-surface">{highestCategory.category}</span>, consisting of {highestCategory.sharePercent}% of total. Look here for optimization.
            </p>
          </div>
          <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-secondary space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">account_balance</span>
              <span className="text-xs font-bold uppercase text-on-surface tracking-wide">Liquidity</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Total expenses for this month are ${comparison.currentTotal.toLocaleString()}. Ensure you have sufficient surplus covering this volume.
            </p>
          </div>
          <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-tertiary space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-xl">analytics</span>
              <span className="text-xs font-bold uppercase text-on-surface tracking-wide">Cash Flow</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Month-over-Month expenses have {isIncrease ? 'expanded' : isDecrease ? 'shrunk' : 'remained steady'}. Maintain continuous tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
