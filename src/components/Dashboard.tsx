import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SummaryCard } from './SummaryCard';
import { ChartsSection } from './ChartsSection';
import { TransactionsSection } from './TransactionsSection';
import { InsightCard } from './InsightCard';
import { TransactionModal } from './TransactionModal';
import { Transaction } from '../types';

export const Dashboard = () => {
  const { transactions, addTransaction, updateTransaction } = useDashboard();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<Transaction | undefined>(undefined);

  // Computed Values
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  // Insight: Highest Spending Category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  let highestCategory = 'None';
  let highestCategoryAmount = 0;
  Object.keys(expensesByCategory).forEach(cat => {
    if (expensesByCategory[cat] > highestCategoryAmount) {
      highestCategoryAmount = expensesByCategory[cat];
      highestCategory = cat;
    }
  });

  // Basic Insight: Key Observation
  const percentOfTotal = totalExpense > 0 ? ((highestCategoryAmount / totalExpense) * 100).toFixed(0) : 0;
  const keyObservation = totalExpense > 0 
    ? `${highestCategory} makes up ${percentOfTotal}% of your total expenses.` 
    : 'No expenses tracked yet.';

  // Insight: Monthly Comparison (Dummy delta calculation relative to 0)
  const previousMonthExpense = totalExpense * 0.85; // Mock 85% of current
  const delta = totalExpense > 0 ? (((totalExpense - previousMonthExpense) / previousMonthExpense) * 100).toFixed(1) : '0.0';
  const deltaIndicator = totalExpense > 0 ? `+${delta}%` : '0%';

  const handleOpenAdd = () => {
    setEditingTx(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setEditingTx(tx);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in tx) {
      updateTransaction(tx.id, tx);
    } else {
      addTransaction(tx);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-[24px] md:py-[32px] md:px-[40px] flex flex-col gap-[32px]">
      
      {/* 2. Dashboard Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[16px] font-semibold text-finance-text-primary m-0">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
          <SummaryCard 
            label="Total Balance" 
            value={`$${totalBalance.toLocaleString()}`} 
            indicatorText="+12.5%" 
            indicatorType="positive" 
          />
          <SummaryCard 
            label="Total Income" 
            value={`$${totalIncome.toLocaleString()}`} 
            indicatorText="+5.2%" 
            indicatorType="positive" 
          />
          <SummaryCard 
            label="Total Expenses" 
            value={`$${totalExpense.toLocaleString()}`} 
            indicatorText="-2.4%" 
            indicatorType="neutral" 
          />
        </div>
        <ChartsSection />
      </section>

      {/* 3. Transactions Section */}
      <TransactionsSection onAdd={handleOpenAdd} onEdit={handleOpenEdit} />

      {/* 4. Insights Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[16px] font-semibold text-finance-text-primary m-0">Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
          <InsightCard 
            title="Highest Spending" 
            value={highestCategory} 
            description={`$${highestCategoryAmount.toLocaleString()} this period`}
          />
          <InsightCard 
            title="Monthly Comparison" 
            value={`$${totalExpense.toLocaleString()}`} 
            description={`${deltaIndicator} vs last month`}
          />
          <InsightCard 
            title="Key Observation" 
            value="Spending Trend" 
            description={keyObservation}
          />
        </div>
      </section>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTx}
      />
    </div>
  );
};
